import styles from '../../pages/Home/Home.module.scss'
import dayjs from 'dayjs'
import { ProductPublic } from '../../types/Product.ts'
import { Package, HandCoins, MapPinCheckInside, Info, ShoppingBag, SquareMousePointer, ClockFading, Heart } from 'lucide-react'
import { useCart } from '../../context/useCart.ts'
import placeholderImage from '../../assets/default_image_icon.jpg'
import { useWishlist } from '../../context/WishlistContext.tsx'

function HomeCard({ product }: { product: ProductPublic }) {
    const { addProduct } = useCart()
    const { wishlist, toggleWishlist } = useWishlist()
    const isWishlisted = wishlist.includes(product.id)
    console.log(wishlist, isWishlisted)

    const handleAddToCart = () => {
        addProduct({
            productId: product.id,
            quantity: 1,
            cached: {
                name: product.title,
                image: product.image ?? '',
                price: Number(product.price ?? 0),
                stock: product.stock
            }
        })
    }

    return (<div key={product.slug} className={styles.product_card_container}>
        <div
            className={`${styles.wishlist_icon}`}
            onClick={() => {
                console.log("Apasat heart pentru:", product.id);
                toggleWishlist(product.id);
            }}
        >
            <Heart
                size={26}
                className={`${isWishlisted ? styles.wishlist_icon__heart_toggled : styles.wishlist_icon__heart} cursor-pointer`}
            />
        </div>
        <a href="#" className={styles.product_card}>
            <div className={styles.product_card__img_container}>
                <img src={product.image ? product.image : placeholderImage} alt="food" className={styles.product_card__img} />
            </div>

        </a>
        <div className={`${styles.product_card_container__text_wrapper}`}>
            <h3 className={`${styles.product_card_container__title} `}>{product.title}</h3>
            <div className={`${styles.product_card_container__info_default} flex flex-col`}>
                <div className={`${styles.product_card_container__quantity} flex`}>
                    <Package className={`${styles.product_card_container__icon} `} />
                    <span>{product.quantity} {product.unit}</span>
                </div>
                <div className={`${styles.product_card_container__price} flex`}>
                    <HandCoins className={`${styles.product_card_container__icon} `} />
                    <span>{product.price ?? 'Gratuit'} {product.price ? 'lei' : ''}</span>
                </div>
                <div className={`${styles.product_card_container__location} flex`}>
                    <MapPinCheckInside className={`${styles.product_card_container__icon} `} />
                    <span>{product.location}</span>
                </div>
                <div className={`${styles.product_card_container__pick_hours} flex`}>
                    <ClockFading className={`${styles.product_card_container__icon} `} />
                    <span>Expiră la: {dayjs(product.expires_at).format('DD/MM/YYYY HH:mm')}</span>
                </div>

            </div>



            <div className={`${styles.product_card_container__info_hover} flex`}>
                <Info className={`${styles.product_card_container__icon} `} />
                <span>{product.description}</span>
            </div>


            <button
                className={`${styles.product_card_container__add_to_cart} flex justify-center items-center`}
                onClick={handleAddToCart}
            >
                <ShoppingBag size={20} strokeWidth={2} />
            </button>

            <div className={`${styles.product_card_container__info_button} flex justify-center items-center`}>
                <SquareMousePointer className={`${styles.product_card_container__info_icon} `} />
                <span>Detalii</span>
            </div>
        </div>
    </div>)

}

export default HomeCard

