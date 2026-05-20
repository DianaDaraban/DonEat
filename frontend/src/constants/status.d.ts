export type OrderStatus = "CONFIRMED" | "DELIVERED" | "PENDING" | "SHIPPED" | "CANCELLED";
export interface StatusMeta {
    label: string;
    color: string;
    status: string;
    colorRgb: string;
}
export declare const STATUS_RO: Record<OrderStatus, StatusMeta>;
//# sourceMappingURL=status.d.ts.map