import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, HandCoins, ShieldCheck, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/useCart.ts";
import api from "../../api.ts";
import styles from "./CheckoutPage.module.scss";

type PaymentMethod = "cash" | "card";

export default function CheckoutPage() {
    const { cart, refreshCart } = useCart();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");

    const total =
        cart?.items.reduce(
            (acc, item) => acc + item.quantity * Number(item.price),
            0
        ) ?? 0;

    const handleConfirmOrder = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await api.post("/api/checkout/", {
                payment_method: paymentMethod,
            });

            await refreshCart();
            navigate(`/orders/${res.data.order_id}`);
        } catch (err: any) {
            setError(err.response?.data?.error || "Eroare la plasarea comenzii");
        } finally {
            setLoading(false);
        }
    };

    if (!cart?.items.length) {
        return <div className={styles.empty}>Coșul este gol.</div>;
    }

    return (
        <main className={styles.checkout}>
            <section className={styles.card}>
                <div className={styles.header}>
                    <ShoppingBag size={32} />
                    <div>
                        <h2>Finalizează comanda</h2>
                        <p>Verifică sumarul și alege metoda de plată.</p>
                    </div>
                </div>

                <div className={styles.summary}>
                    <h3>Sumar comandă</h3>

                    {cart.items.map(item => (
                        <div key={item.productId} className={styles.item}>
                            <span className={styles.item_name}>{item.name}</span>

                            <span className={styles.item_quantity}>
                                x {item.quantity} porții
                            </span>

                            <strong className={styles.item_price}>
                                {Number(item.price) * item.quantity} lei
                            </strong>
                        </div>
                    ))}

                    <div className={styles.total}>
                        <span>Total</span>
                        <strong>{total} lei</strong>
                    </div>
                </div>

                <div className={styles.payment}>
                    <h3>Metodă de plată</h3>

                    <button
                        type="button"
                        className={`${styles.payment_option} ${paymentMethod === "cash" ? styles.active : ""
                            }`}
                        onClick={() => setPaymentMethod("cash")}
                    >
                        <HandCoins />
                        <div>
                            <strong>Plată la ridicare</strong>
                            <span>Achită direct la vânzător</span>
                        </div>
                    </button>

                    <button
                        type="button"
                        className={`${styles.payment_option} ${paymentMethod === "card" ? styles.active : ""
                            }`}
                        onClick={() => setPaymentMethod("card")}
                    >
                        <CreditCard />
                        <div>
                            <strong>Card online simulat</strong>
                            <span>Plata este marcată ca plătită, fără procesator real.</span>
                        </div>
                    </button>

                    {paymentMethod === "card" && (
                        <p className={styles.fake_notice}>
                            <ShieldCheck size={17} />
                            Plata este simulată. Nu se introduc și nu se salvează date de card.
                        </p>
                    )}
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <button
                    className={styles.confirm_btn}
                    onClick={handleConfirmOrder}
                    disabled={loading}
                >
                    {loading ? "Se procesează..." : "Confirmă comanda"}
                </button>
            </section>
        </main>
    );
}