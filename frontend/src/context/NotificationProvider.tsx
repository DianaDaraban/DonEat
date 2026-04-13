import { useEffect, useState, ReactNode } from "react"
import api from "../api.ts"
import { NotificationContext } from './NotificationContext.tsx'
import { Notification } from "../types/Notifications.ts"


export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([])

    useEffect(() => {
        const fetchNotifications = async () => {
            const res = await api.get('/api/notifications/')
            setNotifications(Array.isArray(res.data) ? res.data : [])
        }

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60_000)
        return () => clearInterval(interval)
    }, [])

    return <NotificationContext.Provider value={{ notifications, setNotifications }}>
        {children}
    </NotificationContext.Provider>
}