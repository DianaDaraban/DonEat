import { Notification } from "../types/Notifications.ts";
interface NotificationContextType {
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}
export declare const NotificationContext: import("react").Context<NotificationContextType | null>;
export declare const useNotifications: () => NotificationContextType;
export {};
//# sourceMappingURL=NotificationContext.d.ts.map