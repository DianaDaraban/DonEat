import { Category } from "./Category.ts"

export interface ProductPublic {
    id: number;
    title: string;
    description?: string;
    category: Category;
    quantity: number;
    unit: string;
    price: number | null;
    original_price?: string | null;
    is_donation: boolean;
    expires_at: string;
    created_at: string;
    slug: string;
    location: string;
    image?: string;
    stock: number;
    store_name?: string;
    store_logo?: string | null;
    store_description?: string | null;
    store_latitude?: string | number | null;
    store_longitude?: string | number | null;
    owner: number;
}

export interface ProductLocalStorage {
    id: number
    title: string
    image: string
    price: number

}