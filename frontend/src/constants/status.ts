export type OrderStatus = "CONFIRMED" | "DELIVERED" | "PENDING" | "SHIPPED" | "CANCELLED";

export interface StatusMeta {
    label: string;
    color: string;
    status: string;
    colorRgb: string
}

export const STATUS_RO: Record<OrderStatus, StatusMeta> = {
    CONFIRMED: { label: 'Confirmate', status: 'Confirmată', color: 'var(--color-secondary)', colorRgb: 'var(--color-secondary-rgb)' },
    DELIVERED: { label: 'Livrate', status: 'Livrată', color: 'var(--color-grey)', colorRgb: 'var(--color-grey-rgb)' },
    PENDING: { label: 'În așteptare', status: 'În așteptare', color: 'var(--color-orange)', colorRgb: 'var(--color-orange-rgb)' },
    SHIPPED: { label: 'Expediate', status: 'Expediată', color: 'var(--color-primary)', colorRgb: 'var(--color-primary-rgb)' },
    CANCELLED: { label: 'Anulate', status: 'Anulată', color: 'var(--color-light-red)', colorRgb: 'var(--color-light-red-rgb)' }
}
