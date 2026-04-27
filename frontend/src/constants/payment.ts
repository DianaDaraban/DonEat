export type PaymentMethod = "cash" | "card";
export type PaymentStatus = "pending" | "paid";

export const PAYMENT_METHOD_RO: Record<PaymentMethod, { label: string; colorRgb: string }> = {
    cash: {
        label: "Plată la ridicare",
        colorRgb: "var(--color-primary-rgb)",
    },
    card: {
        label: "Card online",
        colorRgb: "var(--color-secondary-rgb)",
    },
};

export const PAYMENT_STATUS_RO: Record<PaymentStatus, { label: string; colorRgb: string }> = {
    pending: {
        label: "În așteptare",
        colorRgb: "var(--color-orange-rgb)",
    },
    paid: {
        label: "Plătită",
        colorRgb: "var(--color-primary-rgb)",
    },
};