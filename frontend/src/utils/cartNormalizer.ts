import { ApiCartItem, CartItem, GuestCartItem } from "../types/Cart.ts";

export function normalizeGuestItem(item: GuestCartItem): CartItem {
    return {
        productId: item.productId,
        quantity: item.quantity,
        name: item.cached.name,
        image: item.cached.image,
        price: item.cached.price,
    }
}

export function normalizeApiItem(item: ApiCartItem): CartItem {
    return {
        id:item.id,
        productId: item.product,
        quantity: item.quantity,
        name: item.product_name,
        image: item.product_image,
        price: Number(item.price_at_add),
        updated_at: item.updated_at,
    }
}