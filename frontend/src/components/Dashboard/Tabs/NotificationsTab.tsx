import { useNotifications } from "../../../context/NotificationContext.tsx";
import styles from '../styles/NotificationsTab.module.scss'
import { ExternalLink, MailCheck, BellOff } from 'lucide-react'
import api from "../../../api.ts";
import { useNavigate } from "react-router-dom";

export default function NotificationsPage() {
    const { notifications, setNotifications } = useNotifications()
    const navigate = useNavigate()

    const markAsRead = async (id: number) => {
        await api.patch(`/api/notifications/${id}/mark-read/`)
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    }

    if (notifications.length === 0) return (<div className={styles.empty_container}>
        <h2 style={{ color: 'white', textShadow: '1px 2px 3px rgba(0, 0, 0, 0.3)' }}>Nu ai notificări noi</h2>
        <BellOff size={28} color="var(--color-light-red)" />
    </div>)
    return (
        <div className={styles.main_notifications_container}>
            <h3>Notificări</h3>
            <div className={styles.notifications_container}>{
                notifications.map(n => (
                    <div key={n.id} className={styles.notification_card}>
                        <div
                            className={styles.notification_card__header}
                            style={n.read ? { backgroundColor: 'rgba(var(--color-grey-rgb), 0.1)' } : { backgroundColor: 'rgba(var(--color-orange-rgb), 0.15)' }}
                        >
                            <span>{n.message}</span>
                            <ExternalLink
                                color="var(--color-primary)"
                                className={styles.order_link}
                                onClick={() => n.related_order ? navigate(`/orders/${n.related_order}`) : navigate(`/products/${n.related_product_slug}`)}
                            />
                            <div
                                style={n.read ? { borderColor: 'rgba(var(--color-orange-rgb), 0.6)' } : { borderColor: 'rgba(var(--color-secondary-rgb), 0.6)' }}
                                className={styles.notification_mark_as_read}
                                onClick={() => markAsRead(n.id)}
                            >
                                <MailCheck size={17} color="var(--color-orange)" />
                                {n.read ? <div></div> : <span>Marchează ca citit
                                </span>}

                            </div>
                        </div>
                        <div className={styles.notification_card__description}>
                            <span>Creată la</span>
                            <span></span>
                            <span>{new Date(n.created_at).toLocaleString()}</span>
                        </div>
                    </div>
                ))
            }</div>
        </div>
    );
};