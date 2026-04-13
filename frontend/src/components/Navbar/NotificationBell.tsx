import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext.tsx";
import { Notification } from "../../types/Notifications.ts";
import { Bell } from 'lucide-react'
import styles from '../../pages/navbar/Navbar.module.scss'
import { useDashboardTab } from "../../context/DashboardTabContext.tsx";

export default function NotificationBell() {
    const { notifications } = useNotifications()
    const { setActiveTab } = useDashboardTab()
    const navigate = useNavigate()

    const unreadCount = notifications.filter((item: Notification) => !item.read).length

    return (
        <div
            className={styles.cart_items_badge}
            onClick={() => {
                setActiveTab('Notificări')
                navigate('/dashboard')
            }}
        >
            <Bell className="cursor-pointer" />
            {unreadCount > 0 && (
                <span className={styles.badge}>{unreadCount}</span>
            )}
        </div>
    )

}