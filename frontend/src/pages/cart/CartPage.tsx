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
import placeholderImage from '../../assets/default_image_icon.jpg'
// const API_URL = import.meta.env.VITE_API_URL

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
        if (newQuantity < 1) return;

        if (!user) {
            const cart = getGuestCart()
            const existing = cart.find(el => el.productId === item.productId)
            if (existing) existing.quantity = newQuantity

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
            return { items: prev.items.map(el => el.id === item.id ? { ...el, quantity: newQuantity } : el) }
        })

        if (item.id !== undefined) {
            setUpdatingItems(prev => [...prev, item.id].filter(Boolean) as number[])
        }

        try {
            await updateCartItem(item.id!, newQuantity)
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

    const handleCheckout = () => {
        if (!user) {
            navigate('/login', {
                state: { from: '/cart' }
            })

            return
        }

        navigate('/checkout')
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
                    console.log(item)
                    return (<div key={item.productId} className={styles.cart_item}>
                        <img
                            src={`${item.image ? item.image : placeholderImage}`}
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
                                    disabled={updatingItems.includes(item.productId)}
                                    type="button"
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