import { useState, useEffect } from "react";
import api from "../api.ts";
import { ProductPublic } from "../types/Product.ts";
import { WishlistContext } from "./WishlistContext.tsx";

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
    const [wishlist, setWishlist] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchWishlist = async () => {
        try {
            const res = await api.get('/api/wishlist/')
            const productIds = res.data.map((product: ProductPublic) => product.id)
            setWishlist(productIds)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const toggleWishlist = async (productId: number) => {
        try {
            if (wishlist.includes(productId)) {
                await api.delete('/api/wishlist/', {
                    data: { product_id: productId }
                })
                setWishlist(prev => prev.filter(id => id !== productId))
            } else {
                await api.post('/api/wishlist/', {
                    product_id: productId
                })
                setWishlist(prev => [...prev, productId])
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchWishlist()
    }, [])

    return <WishlistContext.Provider value={{ wishlist, toggleWishlist, loading }}>
        {children}
    </WishlistContext.Provider>
}