import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../../context/useCart.ts"
import api from "../../api.ts"


export default function CheckoutPage() {
    const { cart, refreshCart } = useCart()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const total = cart?.items.reduce((acc, item) => acc + item.quantity * item.price, 0)

    const handleConfirmOrder = async () => {
        try {
            setLoading(true)
            setError('')

            const res = await api.post('/api/checkout/')

            refreshCart()

            navigate(`/orders/${res.data.order_id}`)
        } catch (err) {
            setError(err.response?.data?.error || 'Eroare la plasarea comenzii')
        } finally {
            setLoading(false)
        }
    }

    if (!cart?.items.length) {
        return <p>Coșul este gol.</p>
    }

    return (
        <div>
            <h2>Sumar comandă</h2>

            {cart?.items.map(item => (
                <div key={item.productId}>
                    <span>{item.name}</span>
                    <span>{item.quantity}</span>
                    <span>{item.price} lei</span>
                </div>
            ))}

            <h3>Total: {total} lei</h3>

            {error && <p>{error}</p>}

            <button onClick={handleConfirmOrder} disabled={loading}>
                {loading ? "Se procesează..." : "Confirmă comanda"}
            </button>
        </div>
    )
}