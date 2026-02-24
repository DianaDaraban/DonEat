import styles from "../../pages/wishlist/Wishlist.module.scss"
import { ProductPublic } from "../../types/Product.ts"
import {
    Heart,
    ShoppingBag,
    MapPinCheckInside,
    Package,
    HandCoins
} from "lucide-react"
import { useWishlist } from "../../context/WishlistContext.tsx"
import { useCart } from "../../context/useCart.ts"
import placeholderImage from "../../assets/default_image_icon.jpg"
const API_URL = import.meta.env.VITE_API_URL;

function WishlistItemCard({ product }: { product: ProductPublic }) {
    const { toggleWishlist } = useWishlist()
    const { addProduct } = useCart()

    const handleAddToCart = () => {
        addProduct({
            productId: product.id,
            quantity: 1,
            cached: {
                name: product.title,
                image: product.image ?? "",
                price: Number(product.price ?? 0),
                stock: product.stock
            }
        })
    }

    return (
        <div className={styles.card}>

            <div className={styles.card__image_wrapper}>
                <img
                    src={product.image ? product.image.includes(API_URL) ? product.image : API_URL + product.image : placeholderImage}
                    alt={product.title}
                    className={styles.card__image}
                />
            </div>

            <div className={styles.card__content}>

                <div className={styles.card__header}>
                    <h3 className={styles.card__title}>
                        {product.title}
                    </h3>

                    <Heart
                        className={styles.card__heart}
                        onClick={() => toggleWishlist(product.id)}
                    />
                </div>

                <p className={styles.card__description}>
                    {product.description}
                </p>

                <div className={styles.card__meta}>

                    <div className={styles.card__meta_item}>
                        <Package size={16} />
                        <span>{product.quantity} {product.unit}</span>
                    </div>

                    <div className={styles.card__meta_item}>
                        <HandCoins size={16} />
                        <span>
                            {product.price ?? "Gratuit"} {product.price ? " lei" : ""}
                        </span>
                    </div>

                    <div className={styles.card__meta_item}>
                        <MapPinCheckInside size={16} />
                        <span>{product.location}</span>
                    </div>

                </div>

                <button
                    onClick={handleAddToCart}
                    className={styles.card__button}
                >
                    <ShoppingBag size={16} />
                    Adaugă în coș
                </button>

            </div>
        </div>
    )
}

export default WishlistItemCard
