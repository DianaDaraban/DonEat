export type ApiCartItem = {
    id: number;
    product: number;
    product_title: string;
    product_image: string;
    price_at_add: string;
    quantity: number;
    updated_at: number;
    product_stock: number;
};
export type CartState = {
    items: CartItem[];
};
export type CartItem = {
    id?: number;
    productId: number;
    quantity: number;
    name: string;
    image: string;
    price: number;
    updated_at?: number;
    stock: number;
};
export type GuestCartItem = {
    productId: number;
    quantity: number;
    cached: {
        name: string;
        image: string;
        price: number;
        stock: number;
    };
};
export type AddToCartInput = {
    productId: number;
    quantity?: number;
    cached?: {
        name: string;
        image: string;
        price: number;
        stock: number;
    };
};
//# sourceMappingURL=Cart.d.ts.map