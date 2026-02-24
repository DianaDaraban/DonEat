import { createContext, useContext } from "react";

interface WishlistContextType{
    wishlist: number[]
    toggleWishlist: (productId:number) => Promise<void>
    loading:boolean
}

export const WishlistContext = createContext<WishlistContextType | null>(null);

export const useWishlist = () => {
    const context = useContext(WishlistContext)
    if(!context) throw new Error('useWishlist must be used inside WishlistProvider')
    return context
}
