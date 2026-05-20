import { useState } from "react"
import { useCart } from "../../context/useCart.ts"
import { updateCartItem, removeCartItem } from "../../api/cart.ts"
import styles from './Cart.module.scss'
import dayjs from "dayjs"
import LoadingIndicator from "../../components/LoadingIndicator.tsx"
import { useNavigate } from "react-router-dom"
import { CartItem } from "../../types/Cart.ts"
import { useAuth } from "../../context/useAuth.ts"
import { useWishlist } from "../../context/WishlistContext.tsx"
import { getGuestCart, setGuestCart } from "../../utils/guestCart.ts"
import { normalizeGuestItem } from "../../utils/cartNormalizer.ts"
import placeholderImage from '../../assets/default_image_icon.jpg'
import { Heart, Trash, HandCoins } from 'lucide-react'
const API_URL = import.meta.env.VITE_API_URL
import ConfirmModal from "../../components/ConfirmModal.tsx"

function CartPage() {
    const { cart, setCart, refreshCart, loading } = useCart()
    const [updatingItems, setUpdatingItems] = useState<number[]>([])
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toggleWishlist } = useWishlist();
    const [itemToDelete, setItemToDelete] = useState<CartItem | null>(null);


    if (loading) {
        return <LoadingIndicator />
    }

    if (!cart || cart.items.length === 0) {
        return <div className={styles.empty_cart_container}>
            <h2>Coșul tău este gol.</h2>
        </div>
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

        navigate('/checkout');
    }


    const total = cart.items.reduce((acc, item) => acc += Number(item.price) * item.quantity, 0)


    return (
        <div className={styles.cart_container}>
            <h3>Coșul tău</h3>
            <div className={styles.cart_items}>
                {cart.items.map((item) => {
                    return (<div key={item.productId} className={styles.cart_item}>
                        <div className={styles.image_wrapper}>
                            <img
                                src={`${item.image ? item.image.includes(API_URL) ? item.image : API_URL + item.image : placeholderImage}`}
                                alt={item.name}
                                loading="lazy"
                                decoding="async"
                            />
                        </div>

                        <div className={styles.cart_item_details}>
                            <div className={styles.cart_item_details__header}>
                                <div className={styles.cart_item_details__title}>{item.name}</div>
                                <button
                                    onClick={() => setItemToDelete(item)}
                                    disabled={updatingItems.includes(item.productId)}
                                    className={styles.remove_button}
                                >
                                    <Trash size={13} />
                                    <span>Șterge</span>
                                </button>
                                <Heart
                                    className={styles.card_heart}
                                    onClick={() => toggleWishlist(item.productId)}
                                    fill='rgba(var(--color-light-red-rgb), 0.6)'
                                    color='rgba(var(--color-light-red-rgb), 0.8)'
                                    size={22}
                                />
                            </div>
                            <div className={styles.card_item_meta} style={{ marginRight: '1rem' }}>
                                <span>Adăugat la</span>
                                <span></span>
                                <span>{dayjs(item.updated_at).format('DD/MM/YYYY')}</span>
                            </div>

                            <div className={styles.card_meta}>
                                <div className={styles.cart_item_quantity}>
                                    <button
                                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                        disabled={updatingItems.includes(item.productId)}
                                        type="button"
                                    >
                                        <span>-</span>
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
                                <div className={styles.card_item_meta}>
                                    <span>Preț per unitate</span>
                                    <span></span>
                                    <span>{item.price} lei</span>
                                </div>
                            </div>
                            <div className={styles.card_meta}>
                                <div className={styles.card_item_meta}>
                                    <span>Total per produs</span>
                                    <span></span>
                                    <span>{Number(item.price) * item.quantity} lei</span>
                                </div>
                            </div>


                        </div>
                    </div>)
                })}
            </div>
            <div className={styles.cart_summary}>
                <div className={styles.card_total}>
                    <span>Total coș</span>
                    <span></span>
                    <span>{total} lei</span>
                </div>
                <button
                    className={styles.checkout_button}
                    onClick={handleCheckout}
                >
                    <HandCoins />
                    <span>Finalizează comanda</span>
                </button>
            </div>
            <ConfirmModal
                open={!!itemToDelete}
                title="Ștergi produsul din coș?"
                message={`Produsul "${itemToDelete?.name}" va fi eliminat din coș.`}
                confirmText="Șterge"
                cancelText="Renunță"
                danger
                onCancel={() => setItemToDelete(null)}
                onConfirm={() => {
                    if (!itemToDelete) return;
                    handleRemoveItem(itemToDelete);
                    setItemToDelete(null);
                }}
            />
        </div>
    )
}

export default CartPage