import { useState } from "react"
import { useCart } from "../../context/useCart.ts"
import { updateCartItem, removeCartItem } from "../../api/cart.ts"
import styles from './Cart.module.scss'
import dayjs from "dayjs"
import LoadingIndicator from "../../components/LoadingIndicator.tsx"
import { useNavigate } from "react-router-dom"
import { CartItem } from "../../types/Cart.ts"
import { useAuth } from "../../context/useAuth.ts"
import { getGuestCart, setGuestCart } from "../../utils/guestCart.ts"
import { normalizeGuestItem } from "../../utils/cartNormalizer.ts"
import api from "../../api.ts"
import placeholderImage from '../../assets/default_image_icon.jpg'
const API_URL = import.meta.env.VITE_API_URL

function CartPage() {
    const { cart, setCart, refreshCart, loading } = useCart()
    const [updatingItems, setUpdatingItems] = useState<number[]>([])
    const navigate = useNavigate();
    const { user } = useAuth()


    if (loading) {
        return <LoadingIndicator />
    }

    const handleGoHome = () => {
        navigate('/')
    }

    if (!cart || cart.items.length === 0) {
        return <>
            <button className={styles.go_home_btn} onClick={handleGoHome}>
                Înapoi la Home
            </button>
            <div>Coșul tău este gol.</div>
        </>
    }

    const handleQuantityChange = async (item: CartItem, newQuantity: number) => {
        const maxStock = item.stock
        const validatedQuantity = Math.min(Math.max(newQuantity, 1), maxStock);

        if (validatedQuantity < 1) return;

        if (!user) {
            const cart = getGuestCart()
            const existing = cart.find(el => el.productId === item.productId)
            if (existing) existing.quantity = validatedQuantity

            setGuestCart(cart)
            setCart({ items: cart.map(normalizeGuestItem) })
            return
        }

        if (!item.id) {
            console.warn('Cannot update item without id:', item)
            return
        }

        setCart(prev => {
            if (!prev) return prev
            return { items: prev.items.map(el => el.id === item.id ? { ...el, quantity: validatedQuantity } : el) }
        })

        if (item.id !== undefined) {
            setUpdatingItems(prev => [...prev, item.id].filter(Boolean) as number[])
        }

        try {
            await updateCartItem(item.id!, validatedQuantity)
            await refreshCart()
        } catch (err) {
            console.error('Failed to update item', err)
        }
    }

    const handleRemoveItem = async (item: CartItem) => {
        const itemId = item.productId
        setUpdatingItems((prev) => [...prev, itemId])

        try {
            if (!user) {
                const cart = getGuestCart()
                const updated = cart.filter(el => el.productId !== item.productId)

                setGuestCart(updated)
                setCart({ items: updated.map(normalizeGuestItem) })
                return
            }

            await removeCartItem(item.id!);
            await refreshCart();
        } catch (err) {
            console.error('Failed to remove item', err)
        } finally {
            if (item.id !== undefined) {
                setUpdatingItems(prev => prev.filter(id => id !== item.id))
            }
        }
    }

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login', { state: { from: '/cart' } });
            return;
        }

        try {
            const res = await api.post('/api/checkout/');
            await refreshCart();

            navigate(`/orders/${res.data.order_id}`);

        } catch (err: unknown) {
            if (err instanceof Error) {
                alert(err.message);
            } else if (typeof err === 'object' && err !== null && 'response' in err) {
                const axiosErr = err as { response?: { data?: { error?: string } } };
                alert(axiosErr.response?.data?.error || 'Eroare la finalizare comanda');
            } else {
                alert('Eroare la finalizare comanda');
            }

            await refreshCart();
        }
    }


    const total = cart.items.reduce((acc, item) => acc += Number(item.price) * item.quantity, 0)


    return (
        <div className={styles.cart_container}>
            <h2>Coșul tău</h2>
            <button className={styles.go_home_btn} onClick={handleGoHome}>
                Înapoi la Home
            </button>
            <div className={styles.cart_items}>
                {cart.items.map((item) => {
                    return (<div key={item.productId} className={styles.cart_item}>
                        <img
                            src={`${item.image ? item.image.includes(API_URL) ? item.image : API_URL + item.image : placeholderImage}`}
                            alt={item.name}
                            className={styles.cart_item_image}
                        />
                        <div className={styles.cart_item_details}>
                            <h3>{item.name}</h3>
                            <p>Adăugat la: {dayjs(item.updated_at).format('DD/MM/YYYY')}</p>
                            <div className={styles.cart_item_quantity}>
                                <button
                                    onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                    disabled={updatingItems.includes(item.productId)}
                                    type="button"
                                >
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                    type="button"
                                    disabled={
                                        updatingItems.includes(item.productId) ||
                                        item.quantity >= item.stock
                                    }
                                >
                                    +
                                </button>
                            </div>
                            <p>Preț per unitate: {item.price} lei</p>
                            <p>Total: {Number(item.price) * item.quantity} lei</p>
                            <button
                                onClick={() => handleRemoveItem(item)}
                                disabled={updatingItems.includes(item.productId)}
                                className={styles.remove_button}
                            >
                                Șterge
                            </button>
                        </div>
                    </div>)
                })}
            </div>
            <div className={styles.cart_summary}>
                <h3>Total coș: {total} lei</h3>
                <button
                    className={styles.checkout_button}
                    onClick={handleCheckout}
                >Finalizează comanda</button>
            </div>
        </div>
    )
}

export default CartPage