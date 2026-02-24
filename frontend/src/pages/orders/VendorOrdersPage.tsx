import { useEffect, useState } from "react";
import api from "../../api.ts";
import { VendorOrder } from "../../types/VendorOrder.ts";
import styles from "./OrderPages.module.scss";
import LoadingIndicator from "../../components/LoadingIndicator.tsx";

export default function VendorOrdersPage() {
    const [orders, setOrders] = useState<VendorOrder[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        const res = await api.get("/api/vendor/orders/");
        setOrders(res.data);
        setLoading(false);
    };

    useEffect(() => {
        const fetch = async () => {
            await fetchOrders();
        };
        fetch();
    }, []);

    const updateStatus = async (orderId: number, status: string) => {
        await api.patch(`/api/vendor/orders/${orderId}/`, { status });
        fetchOrders();
    };

    if (loading) return <LoadingIndicator />;

    if (!orders.length) return <p>Nu ai comenzi momentan.</p>;
    console.log(orders)
    return (
        <div className={styles.vendor_orders}>
            {orders.map((item) => (
                <div key={`${item.order_id}-${item.product_title}`} className={styles.card}>

                    <div className={styles.header}>
                        <span>Comanda #{item.order_id}</span>
                        <span
                            className={`${styles.status} ${styles[item.order_status.toLowerCase()]
                                }`}
                        >
                            {item.order_status}
                        </span>
                    </div>

                    <div className={styles.body}>
                        <p><strong>Cumpărător:</strong> {item.buyer}</p>
                        <p><strong>Produs:</strong> {item.product_title}</p>
                        <p><strong>Cantitate:</strong> {item.quantity}</p>
                        <p><strong>Total:</strong> {item.total} RON</p>
                    </div>

                    <div className={styles.actions}>
                        {item.order_status === "CONFIRMED" && (
                            <button
                                onClick={() =>
                                    updateStatus(item.order_id, "SHIPPED")
                                }
                            >
                                Marchează ca livrat
                            </button>
                        )}

                        {item.order_status === "SHIPPED" && (
                            <button
                                onClick={() =>
                                    updateStatus(item.order_id, "DELIVERED")
                                }
                            >
                                Confirmă livrare
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}