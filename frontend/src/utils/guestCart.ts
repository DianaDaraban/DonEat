import { GuestCartItem } from "../types/Cart.ts"


const KEY = 'guest_cart'

export const getGuestCart = (): GuestCartItem[] => {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []

    try {
        const parsed = JSON.parse(raw)
        return parsed.filter((item: any) => item.productId &&
            item.quantity && item.cached && item.cached.name
        )
    } catch {
        return []
    }
}



export const setGuestCart = (items: GuestCartItem[]) => localStorage.setItem(KEY, JSON.stringify(items))