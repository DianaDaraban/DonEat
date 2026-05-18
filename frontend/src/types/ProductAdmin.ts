export type ProductAdmin = {
    id: number;
    title: string;
    price: string;
    original_price?: string | number | null;
    quantity: number;
    expires_at: string;
    is_available: boolean;
    created_at: string;
    description: string;
    location: string;
    is_donation: boolean;
    slug: string;
}