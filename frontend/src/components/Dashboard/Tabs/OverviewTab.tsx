import { useEffect, useState } from "react";
import api from "../../../api.ts";
import styles from "../styles/OverviewTab.module.scss";
import LoadingIndicator from "../../LoadingIndicator.tsx";
import { useDashboardStats } from "../../../context/DashboardStatsContext.tsx";
import { STATUS_RO, OrderStatus } from '../../../constants/status.ts'

const API_URL = import.meta.env.VITE_API_URL;

interface StatusCount {
    status: string;
    count: number;
}

interface RecentOrder {
    id: number;
    user__username: string;
    user__first_name: string;
    user__last_name: string;
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
            console.log(res.data)
            setStats({
                totalOrders: res.data.total_orders,
                productsCount: res.data.products_count,
                sales: res.data.total_sales,
                store: res.data.store
            })
            setStatusCounts(res.data.status_counts);
            setRecentOrders(res.data.recent_orders);
        }).finally(() => setLoading(false));
    }, [setStats]);

    if (loading) return <LoadingIndicator />;
    return (
        <div className={styles.dashboard_container}>
            <div className={styles.dashboard_container__company_header}>
                <div className={styles.dashboard_container__company_header__avatar}>
                    <img src={API_URL + stats.store?.logo} alt="company-logo" />
                </div>
                <h3>{stats.store?.name}
                    <span style={{ color: 'var(--color-secondary)', textShadow: 'none', marginLeft: '1.5rem' }}>/</span>
                    <span style={{ color: 'var(--color-secondary)', textShadow: 'none', marginLeft: '1.5rem' }}>Rezumat</span>
                </h3>

            </div>
            <div className={styles.summary_container}>
                <div className={styles.summary_cards}>
                    <div className={styles.card}>
                        <h3>Total produse</h3>
                        <p>{stats.productsCount}</p>
                    </div>
                    <div className={styles.card}>
                        <h3>Total comenzi</h3>
                        <p>{stats.totalOrders}</p>
                    </div>
                    <div className={styles.card}>
                        <h3>Total venituri</h3>
                        <p>{stats.sales} RON</p>
                    </div>
                </div>

                <div className={styles.status_summary}>
                    <h3>Comenzi pe status</h3>
                    <ul>
                        {statusCounts.map((status, idx) => (
                            <li
                                key={`${status.status}-${idx}`}
                            >
                                {STATUS_RO[status.status as OrderStatus].label}<span style={{ color: 'var(--color-secondary)', fontWeight: '600' }}>{status.count} {status.count === 1 ? 'comandă' : 'comenzi'}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={styles.recent_orders}>
                    <h3>Comenzi recente</h3>
                    <ul>
                        {recentOrders.map((order, idx) => (
                            <li key={`${order.id}-${idx}`}>
                                <div className={styles.recent_orders__details}>
                                    <div>
                                        <span>Numar comandă: </span>
                                        <span style={{ fontWeight: '500' }}>{order.id}</span></div>
                                    <div>
                                        <span>Nume client: </span>
                                        <span style={{ fontWeight: '500' }}>{order?.user__first_name} {order?.user__last_name}</span>
                                    </div>
                                    <div>
                                        <span>Sumă comandă: </span>
                                        <span style={{ fontWeight: '500' }}>{order.total} RON</span>
                                    </div>
                                </div>
                                <div
                                    className={styles.status}
                                    style={{ backgroundColor: STATUS_RO[order.status as OrderStatus].color }}
                                >
                                    {STATUS_RO[order.status as OrderStatus].status}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default OverviewTab