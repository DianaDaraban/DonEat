import {
    Sparkles,
    ArrowUp,
    ArrowDown,
    Clock,
    Package
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export type ProductOrder =
    | 'newest'
    | 'price_asc'
    | 'price_desc'
    | 'expires_soon'
    | 'quantity_desc';

export const ORDER_LIST: {
    label: string;
    value: ProductOrder;
    icon: LucideIcon;
}[] = [
        { label: 'Cele mai noi', value: 'newest', icon: Sparkles },
        { label: 'Preț crescător', value: 'price_asc', icon: ArrowUp },
        { label: 'Preț descrescător', value: 'price_desc', icon: ArrowDown },
        { label: 'Expiră curând', value: 'expires_soon', icon: Clock },
        { label: 'Cantitate mare', value: 'quantity_desc', icon: Package },
    ];