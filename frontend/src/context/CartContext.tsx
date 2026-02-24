import { createContext, Dispatch, SetStateAction } from "react";
import { AddToCartInput, CartState } from "../types/Cart.ts";

export interface CartContextType {
    cart: CartState | null
    setCart: Dispatch<SetStateAction<CartState | null>>
    refreshCart: () => Promise<void>
    clearCart: () => Promise<void>
    addProduct: (input: AddToCartInput) => Promise<void>
    loading: boolean
}

export const CartContext = createContext<CartContextType | null>(null)

