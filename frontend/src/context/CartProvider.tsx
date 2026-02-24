import { useEffect, useState, ReactNode, useCallback } from "react";
import { fetchCart } from "../api/cart.ts";
import { CartContext } from "./CartContext.tsx";
import { AddToCartInput, CartState } from "../types/Cart.ts";
import { useAuth } from "./useAuth.ts";
import { addToCart } from "../api/cart.ts";
import { getGuestCart, setGuestCart } from "../utils/guestCart.ts";
import { normalizeApiItem, normalizeGuestItem } from "../utils/cartNormalizer.ts";



function CartProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const [cart, setCart] = useState<CartState | null>(null)
    const [loading, setLoading] = useState(false)


    const refreshCart = useCallback(async () => {
        if (!user) {
            const guestCart = getGuestCart()
            setCart({ items: guestCart.map(normalizeGuestItem) })
            setLoading(false)
            return
        }
        try {
            setLoading(true);
            const res = await fetchCart();

            setCart({ items: res.data.items.map(normalizeApiItem) });
        } catch (err) {
            console.error(err);
            setCart({ items: [] })
        } finally {
            setLoading(false);
        }
    }, [user])


    const addProduct = useCallback(
        async (input: AddToCartInput) => {
            const { productId, quantity = 1, cached } = input

            if (!user) {
                if (!cached) {
                    console.warn('Guest cart need chached product data.')
                    return
                }
                const cart = getGuestCart()
                const existing = cart.find(
                    item => item.productId === productId
                )

                if (existing) {
                    existing.quantity += quantity
                } else {
                    cart.push({
                        productId,
                        quantity,
                        cached,
                    })
                }


                setGuestCart(cart)
                setCart({ items: cart.map(normalizeGuestItem) })
                return
            }

            try {
                setLoading(true)
                await addToCart(productId, quantity)
                await refreshCart()
            } catch (err) {
                console.error('Failed to add product to cart', err)
            } finally {
                setLoading(false)
            }
        }, [user, refreshCart]
    )

    const clearCart = useCallback(async () => {
        if (!user) {
            setGuestCart([])
            setCart({ items: [] })
            return
        }

        try {
            setLoading(true)

            await fetch('/api/cart/clear', {
                method: 'DELETE',
                credentials: 'include'
            })
            setCart({ items: [] })
        } catch (err) {
            console.error('Failed to clear cart', err)
        } finally {
            setLoading(false)
        }
    }, [user])

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    return (
        <CartContext.Provider value={{ cart, setCart, refreshCart, clearCart, addProduct, loading }}>
            {children}
        </CartContext.Provider>
    );
}

export default CartProvider