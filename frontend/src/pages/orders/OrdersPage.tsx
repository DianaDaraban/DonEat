import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api.ts";

type Order = {
    id: number;
    created_at: string;
    total: number;
    completed: boolean;
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
        return <p>Nu ai nicio comandă momentan.</p>;
    }

    return (
        <div>
            <h1>Comenzile mele</h1>

            {orders.map((order) => (
                <div
                    key={order.id}
                    onClick={() => navigate(`/orders/${order.id}`)}
                    style={{
                        border: "1px solid #ddd",
                        padding: "1rem",
                        marginBottom: "1rem",
                        cursor: "pointer",
                    }}
                >
                    <p><strong>Comanda #{order.id}</strong></p>
                    <p>Data: {new Date(order.created_at).toLocaleString()}</p>
                    <p>Total: {order.total} RON</p>
                    <p>Status: {order.completed ? "Finalizată" : "În procesare"}</p>
                </div>
            ))}
        </div>
    );
}
