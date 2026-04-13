import { useEffect, useState } from "react";
import api from "../../api.ts";
import { VendorOrder } from "../../types/VendorOrder.ts";
import styles from "./OrderPages.module.scss";
import LoadingIndicator from "../../components/LoadingIndicator.tsx";
import { STATUS_RO, OrderStatus } from "../../constants/status.ts";
import { CircleCheckBig, X, PackageX } from 'lucide-react'

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

    if (!orders.length) return (
        <div className={styles.no_order_container}>
            <PackageX color='var(--color-light-red)' size={28} />
            <h2>Nu ai nicio comandă momentan.</h2>
        </div>)

    const groupedOrders = orders.reduce((acc, item) => {
        const key = item.order_id.toString();

        if (!acc[key]) {
            acc[key] = [];
        }

        acc[key].push(item);
        return acc;
    }, {} as Record<string, VendorOrder[]>);

    return (
        <div className={styles.vendor_orders}>
            <h3>Comenzi</h3>

            <div className={styles.vendor_orders__content}>
                {Object.entries(groupedOrders).map(([itemId, items]) => (
                    <div key={`${itemId}`} className={styles.card}>

                        <div className={styles.header}>
                            <span>Comanda nr. {itemId}</span>
                            <span
                                className={`${styles.status}`}
                                style={{ backgroundColor: `rgba(${STATUS_RO[items[0].order_status as OrderStatus].colorRgb}, .65)`, border: `1px solid rgba(${STATUS_RO[items[0].order_status as OrderStatus].colorRgb}, .95)` }}
                            >
                                {STATUS_RO[items[0].order_status as OrderStatus].status}
                            </span>
                        </div>

                        <div className={styles.card_details_main_container}>
                            <div className={styles.details_container}>
                                <div className={styles.details_container__details_row}>
                                    <span>Cumpărător</span>
                                    <span></span>
                                    <span>{items[0].buyer_name}</span>
                                </div>
                                {items.map(item => {
                                    return (
                                        <div className={styles.product_container}>
                                            <div className={styles.details_container__details_row}>
                                                <span>Produs</span>
                                                <span></span>
                                                <span>{item.product_title}</span>
                                            </div>
                                            <div className={styles.details_container__details_row}>
                                                <span>Cantitate</span>
                                                <span></span>
                                                <span>{item.quantity} Bucăți</span>
                                            </div>
                                            <div className={styles.details_container__details_row}>
                                                <span>Total</span>
                                                <span></span>
                                                <span>{item.total} RON</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className={styles.actions}>
                                {items[0].order_status === "CONFIRMED" && (
                                    <>
                                        <button
                                            onClick={() =>
                                                updateStatus(items[0].order_id, "SHIPPED")
                                            }
                                            className={styles.status_update_btn}
                                        >
                                            <CircleCheckBig
                                                color="rgba(var(--color-orange-rgb), 0.9)"
                                                size={20}
                                            />
                                            <span>Marchează ca livrat</span>

                                        </button>
                                        <button
                                            onClick={() => updateStatus(items[0].order_id, "CANCELLED")}
                                            className={styles.status_update_btn}
                                            style={{ border: `2px solid rgba(var(--color-light-red-rgb), .95)`, color: 'var(--color-dark-red)' }}
                                        >
                                            <X
                                                color="rgba(var(--color-light-red-rgb), 0.9)"
                                                size={20}
                                            />
                                            <span>Anulează comanda</span>
                                        </button>
                                    </>

                                )}

                                {items[0].order_status === "SHIPPED" && (
                                    <button
                                        onClick={() =>
                                            updateStatus(items[0].order_id, "DELIVERED")
                                        }
                                        className={styles.status_update_btn}
                                    >
                                        <CircleCheckBig
                                            color="rgba(var(--color-orange-rgb), 0.9)"
                                            size={20}
                                        />
                                        Confirmă livrare
                                    </button>
                                )}

                                {items[0].order_status === "PENDING" && (
                                    <>
                                        <button
                                            onClick={() => updateStatus(items[0].order_id, "CONFIRMED")}
                                            className={styles.status_update_btn}
                                        >
                                            <CircleCheckBig
                                                color="rgba(var(--color-orange-rgb), 0.9)"
                                                size={20}
                                            />
                                            <span>Confirmă comanda</span>
                                        </button>

                                        <button
                                            onClick={() => updateStatus(items[0].order_id, "CANCELLED")}
                                            className={styles.status_update_btn}
                                            style={{ border: `2px solid rgba(var(--color-light-red-rgb), .95)`, color: 'var(--color-dark-red)' }}
                                        >
                                            <X
                                                color="rgba(var(--color-light-red-rgb), 0.9)"
                                                size={20}
                                            />
                                            <span>Anulează comanda</span>
                                        </button>
                                    </>
                                )}
                            </div>

                        </div>



                    </div>
                ))}
            </div>
        </div>
    );
}