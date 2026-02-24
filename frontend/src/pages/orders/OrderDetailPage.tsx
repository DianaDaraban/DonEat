import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api.ts";

type OrderItem = {
    id: number;
    product_title: string;
    quantity: number;
    price_at_purchase: number;
};

type Order = {
    id: number;
    created_at: string;
    total: number;
    completed: boolean;
    items: OrderItem[];
};

export default function OrderDetailPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<Order | null>(null);



    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get(`/api/orders/${id}/`);
                setOrder(res.data);
            } catch (err) {
                console.error("Error fetching order", err);
            }
        };

        fetchOrder();
    }, []);

    if (!order) return <p>Se încarcă...</p>;

    return (
        <div>
            <h1>Comanda #{order.id}</h1>
            <p>Data: {new Date(order.created_at).toLocaleString()}</p>
            <p>Status: {order.completed ? "Finalizată" : "În procesare"}</p>

            <h2>Produse</h2>

            {order.items.map((item) => (
                <div key={item.id} style={{ marginBottom: "1rem" }}>
                    <p><strong>{item.product_title}</strong></p>
                    <p>Cantitate: {item.quantity}</p>
                    <p>Pret: {item.price_at_purchase} RON</p>
                </div>
            ))}

            <h3>Total: {order.total} RON</h3>
        </div>
    );
}
