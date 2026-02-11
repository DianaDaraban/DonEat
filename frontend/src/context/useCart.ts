import { useContext } from "react";
import { CartContext, CartContextType} from "./CartContext.tsx";

export function useCart(): CartContextType {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used inside CartProvider')
    }

    return context
}