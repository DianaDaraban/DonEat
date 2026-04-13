import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api.ts";
import styles from './OrderPages.module.scss'
import { STATUS_RO, OrderStatus } from "../../constants/status.ts";
import placeholderImage from "../../assets/default_image_icon.jpg";
import LoadingIndicator from "../../components/LoadingIndicator.tsx";

type OrderItem = {
    id: number;
    product_title: string;
    quantity: number;
    price_at_purchase: number;
    product_image: string
};

type Order = {
    id: number;
    created_at: string;
    total: number;
    completed: boolean;
    items: OrderItem[];
    status: string;
};

export default function OrderDetailPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<Order | null>(null);



    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get(`/api/orders/${id}/`);
                console.log(res.data)
                setOrder(res.data);
            } catch (err) {
                console.error("Error fetching order", err);
            }
        };

        fetchOrder();
    }, []);

    if (!order) return <LoadingIndicator />;

    return (
        <div className={styles.vendor_orders} style={{ marginTop: '2rem' }}>
            <div className={styles.card_order_detail}>
                <h1 className={styles.header}>Comanda nr. {order.id}</h1>
                <div className={styles.card_details_main_container}>
                    <div className={styles.details_container}>
                        <div className={styles.details_container__details_row}>
                            <span>Data</span>
                            <span></span>
                            <span>{new Date(order.created_at).toLocaleString()}</span>
                        </div>
                        <div className={styles.details_container__details_row}>
                            <span> Status</span>
                            <span></span>
                            <span className={`${styles.buyer_status}`}
                                style={{ backgroundColor: `rgba(${STATUS_RO[order.status as OrderStatus].colorRgb}, .65)`, border: `1px solid rgba(${STATUS_RO[order.status as OrderStatus].colorRgb}, .95)` }}
                            >
                                {STATUS_RO[order.status as OrderStatus].status}
                            </span>
                        </div>

                    </div>

                    <div className={styles.details_product_container}>
                        <h2>Produse</h2>

                        {order.items.map((item) => (
                            <div
                                key={item.id}
                                style={{ marginBottom: "1rem" }}
                                className={styles.product_card}
                            >
                                <div className={styles.image_container}>
                                    <img src={item.product_image || placeholderImage} alt="" />
                                </div>
                                <div className={styles.product_details}>
                                    <div className={styles.product_title}>{item.product_title}</div>
                                    <div className={styles.details_container__details_row}>
                                        <span>Cantitate</span>
                                        <span></span>
                                        <span>{item.quantity} Bucăți</span>
                                    </div>
                                    <div className={styles.details_container__details_row}>
                                        <span>Pret</span>
                                        <span></span>
                                        <span>{item.price_at_purchase} RON</span>
                                    </div>
                                </div>

                            </div>
                        ))}

                        <div
                            className={styles.details_container__details_row}
                        >
                            <span>Total comandă</span>
                            <span></span>
                            <span>{order.total} RON</span>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}
