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
                        fill='rgba(var(--color-light-red-rgb), 0.6)'
                    />
                </div>

                <div className={styles.card__description}>
                    <span className={styles.product_description_title}>Descriere</span>
                    <span className={styles.product_description}>{product.description}</span>
                </div>

                <div className={styles.card__meta}>

                    <div className={styles.card__meta_item}>
                        <Package size={20} color="var(--color-primary)" />
                        <span>{product.quantity} {product.unit}</span>
                    </div>

                    <div className={styles.card__meta_item}>
                        <HandCoins size={20} color="var(--color-primary)" />
                        <span>
                            {product.price ?? "Gratuit"} {product.price ? " lei" : ""}
                        </span>
                    </div>

                    <div className={styles.card__meta_item}>
                        <MapPinCheckInside size={20} color="var(--color-primary)" />
                        <span>{product.location}</span>
                    </div>

                </div>
                <div className={styles.vendor_add_btn_container}>
                    <div className={styles.vendor_container}>
                        <span>Vânzător</span>
                        <span className={styles.vendor_store_name}>{product.store_name}</span>
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
        </div>
    )
}

export default WishlistItemCard
