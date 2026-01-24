import { Category } from "./Category.ts"

export interface ProductPublic {
    title: string;
    description?: string;
    category: Category;
    quantity: number;
    unit: string;
    price: number | null;
    is_donation: boolean;
    expires_at: string;
    created_at: string;
    slug: string;
    location: string;
}