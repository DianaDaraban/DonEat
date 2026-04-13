export interface Notification {
    id: number;
    type: string;
    message: string;
    read: boolean;
    created_at: string;
    related_order: number
}

export interface NotificationSettings {
    order_confirmed: boolean;
    order_shipped: boolean;
    order_delivered: boolean;
    wishlist_expiring: boolean;
    product_back_in_stock: boolean;
    send_mail: boolean;
}