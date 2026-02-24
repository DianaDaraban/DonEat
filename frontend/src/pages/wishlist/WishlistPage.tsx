import { useState, useEffect } from 'react'
import style from './Wishlist.module.scss'
import WishlistItemCard from '../../components/WishlistComponents/WishlistItemCard.tsx'
import LoadingIndicator from '../../components/LoadingIndicator.tsx'
import { ProductPublic } from '../../types/Product.ts'
import { useWishlist } from '../../context/WishlistContext.tsx'
import api from '../../api.ts'


export default function Wishlist() {
    const { wishlist, loading } = useWishlist()
    const [products, setProducts] = useState<ProductPublic[]>([])
    const [pageLoading, setPageLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get("/api/wishlist/")
                setProducts(res.data)
            } catch (err) {
                console.log(err)
            } finally {
                setPageLoading(false)
            }
        }

        fetchProducts()
    }, [wishlist])

    if (loading || pageLoading) return <LoadingIndicator />

    if (products.length === 0) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <h2>Nu ai produse favorite încă ❤️</h2>
            </div>
        )
    }

    return (
        <div className={`${style.main_wishlist_container} flex flex-col`}>
            {products.map((product: ProductPublic) => (
                <WishlistItemCard key={product.id} product={product} />
            ))}
        </div>
    )

}
