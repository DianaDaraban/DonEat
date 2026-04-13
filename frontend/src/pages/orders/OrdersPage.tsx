import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api.ts";
import styles from './OrderPages.module.scss'
import { STATUS_RO, OrderStatus } from "../../constants/status.ts";
import { ExternalLink, PackageX } from 'lucide-react'

type Order = {
    id: number;
    created_at: string;
    total: number;
    completed: boolean;
    status: string;
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get("/api/orders/");
                setOrders(res.data);
            } catch (err) {
                console.error("Error fetching orders", err);
            }
        };

        fetchOrders();
    }, []);



    if (!orders.length) {
        return (
            <div className={styles.no_order_container}>
                <PackageX color='var(--color-light-red)' size={28} />
                <h2>Nu ai nicio comandă momentan.</h2>
            </div>)

    }
    console.log(orders)
    return (
        <div className={styles.vendor_orders}>
            <h2>Comenzile mele</h2>

            {orders.map((order) => (
                <div
                    key={order.id}
                    className={styles.card}
                >
                    <div className={styles.header}>Comanda nr. {order.id}</div>
                    <div className={styles.card_details_main_container}>
                        <div className={styles.details_container}>
                            <div className={styles.details_container__details_row}>
                                <span>Data</span>
                                <span></span>
                                <span>{new Date(order.created_at).toLocaleString()}</span>
                            </div>
                            <div className={styles.details_container__details_row}>
                                <span>Total</span>
                                <span></span>
                                <span>{order.total} RON</span>
                            </div>
                            <div className={styles.details_container__details_row}>
                                <span>Status</span>
                                <span></span>
                                <span
                                    className={`${styles.buyer_status}`}
                                    style={{ backgroundColor: `rgba(${STATUS_RO[order.status as OrderStatus].colorRgb}, .65)`, border: `1px solid rgba(${STATUS_RO[order.status as OrderStatus].colorRgb}, .95)` }}
                                >{STATUS_RO[order.status as OrderStatus].status}</span>
                            </div>
                        </div>
                        <ExternalLink
                            className={styles.order_detail_bn}
                            strokeWidth={2.3}
                            size={26}
                            onClick={() => navigate(`/orders/${order.id}`)}
                        />
                    </div>

                </div>
            ))}
        </div>
    );
}
