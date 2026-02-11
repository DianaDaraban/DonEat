export type ApiCartItem = {
    id: number
    product: number
    product_name: string
    product_image: string
    price_at_add: string
    quantity: number
    updated_at: number
}

export type CartState = {
    items: CartItem[]
}

export type CartItem = {
    id?: number;
    productId: number
    quantity: number
    name: string
    image: string
    price: number
    updated_at?: number
}

export type GuestCartItem = {
    productId: number
    quantity: number
    cached: {
        name: string
        image: string
        price: number
    }
}

export type AddToCartInput = {
    productId: number
    quantity?: number
    cached?: {
        name: string
        image: string
        price: number
    }
}
