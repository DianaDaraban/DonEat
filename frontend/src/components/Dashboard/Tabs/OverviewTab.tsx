import { useEffect, useState } from "react";
import api from "../../../api.ts";
import styles from "../styles/OverviewTab.module.scss";
import LoadingIndicator from "../../LoadingIndicator.tsx";
import { useDashboardStats } from "../../../context/DashboardStatsContext.tsx";

interface StatusCount {
    status: string;
    count: number;
}

interface RecentOrder {
    id: number;
    user__username: string;
    total: number;
    status: string;
    created_at: string;
}


function OverviewTab() {
    const { stats, setStats } = useDashboardStats();
    const [loading, setLoading] = useState(true);
    const [statusCounts, setStatusCounts] = useState<StatusCount[]>([]);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

    useEffect(() => {
        api.get("/api/vendor/dashboard/").then(res => {
            setStats({
                totalOrders: res.data.total_orders,
                productsCount: res.data.products_count,
                sales: res.data.total_sales,
                storeName: res.data.store_name
            })
            setStatusCounts(res.data.status_counts);
            setRecentOrders(res.data.recent_orders);
        }).finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingIndicator />;

    return (
        <div className={styles.dashboard_container}>
            <div className={styles.summary_cards}>
                <div className={styles.card}>
                    <h3>Total comenzi</h3>
                    <p>{stats.totalOrders}</p>
                </div>
                <div className={styles.card}>
                    <h3>Total venituri</h3>
                    <p>{stats.totalSales} RON</p>
                </div>
            </div>

            <div className={styles.status_summary}>
                <h3>Comenzi pe status</h3>
                <ul>
                    {statusCounts.map((status, idx) => (
                        <li key={`${status.status}-${idx}`}>
                            {status.status}: {status.count}
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.recent_orders}>
                <h3>Comenzi recente</h3>
                <ul>
                    {recentOrders.map((order, idx) => (
                        <li key={`${order.id}-${idx}`}>
                            #{order.id} - {order.user__username} - {order.total} RON - {order.status}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default OverviewTab