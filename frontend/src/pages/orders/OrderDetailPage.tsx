import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api.ts";
import styles from './OrderPages.module.scss'
import { STATUS_RO, OrderStatus } from "../../constants/status.ts";
import {
    PAYMENT_METHOD_RO,
    PAYMENT_STATUS_RO,
    PaymentMethod,
    PaymentStatus
} from "../../constants/payment.ts";
import placeholderImage from "../../assets/default_image_icon.jpg";
import LoadingIndicator from "../../components/LoadingIndicator.tsx";

type OrderItem = {
    id: number;
    product: number;
    product_slug: string;
    product_title: string;
    quantity: number;
    price_at_purchase: number;
    product_image: string;
    store_name: string;
    store_location: string;
    store_owner: number;
}

type Order = {
    id: number;
    created_at: string;
    total: number;
    completed: boolean;
    items: OrderItem[];
    status: string;
    payment_method: PaymentMethod;
    payment_status: PaymentStatus;
};

export default function OrderDetailPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const navigate = useNavigate()


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
        <div className={styles.vendor_orders} >
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
                        <div className={styles.details_container__details_row}>
                            <span>Metodă plată</span>
                            <span></span>
                            <span
                                className={styles.buyer_status}
                                style={{
                                    backgroundColor: `rgba(${PAYMENT_METHOD_RO[order.payment_method].colorRgb}, .65)`,
                                    border: `1px solid rgba(${PAYMENT_METHOD_RO[order.payment_method].colorRgb}, .95)`
                                }}
                            >
                                {PAYMENT_METHOD_RO[order.payment_method].label}
                            </span>
                        </div>
                        <div className={styles.details_container__details_row}>
                            <span>Status plată</span>
                            <span></span>
                            <span
                                className={styles.buyer_status}
                                style={{
                                    backgroundColor: `rgba(${PAYMENT_STATUS_RO[order.payment_status].colorRgb}, .65)`,
                                    border: `1px solid rgba(${PAYMENT_STATUS_RO[order.payment_status].colorRgb}, .95)`
                                }}
                            >
                                {PAYMENT_STATUS_RO[order.payment_status].label}
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
                                onClick={() => navigate(`/products/${item.product_slug}`)}
                            >
                                <div className={styles.image_container}>
                                    <img src={item.product_image || placeholderImage} alt={item.product_title || ''} loading="lazy"
                                        decoding="async" />
                                </div>
                                <div className={styles.product_details}>
                                    <div className={styles.product_title}>{item.product_title}</div>
                                    <div
                                        className={styles.details_container__details_row}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/store/${item.store_owner}`);
                                        }}
                                    >
                                        <span>Vendor</span>
                                        <span></span>
                                        <span>{item.store_name}</span>
                                    </div>

                                    <div className={styles.details_container__details_row}>
                                        <span>Ridicare</span>
                                        <span></span>
                                        <span>{item.store_location}</span>
                                    </div>
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
