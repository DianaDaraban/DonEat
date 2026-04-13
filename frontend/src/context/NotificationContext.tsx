import { createContext, useContext } from "react";
import { Notification } from "../types/Notifications.ts";

interface NotificationContextType {
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

export const NotificationContext = createContext<NotificationContextType | null>(null)

export const useNotifications = () => {
    const context = useContext(NotificationContext)

    if (!context) {
        throw new Error("useNotifications must be used within NotificationProvider")
    }

    return context
}



