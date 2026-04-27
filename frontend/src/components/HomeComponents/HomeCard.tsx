import { useNavigate } from 'react-router-dom'
import styles from '../../pages/Home/Home.module.scss'
import dayjs from 'dayjs'
import { ProductPublic } from '../../types/Product.ts'
import { Package, HandCoins, MapPinCheckInside, Info, ShoppingBag, SquareMousePointer, ClockFading, Heart, Store, MapPinHouse } from 'lucide-react'
import { useCart } from '../../context/useCart.ts'
import placeholderImage from '../../assets/default_image_icon.jpg'
import { useWishlist } from '../../context/WishlistContext.tsx'
import { useAuth } from '../../context/useAuth.ts'
const API_URL = import.meta.env.VITE_API_URL;

function HomeCard({ product }: { product: ProductPublic }) {
    const { addProduct } = useCart()
    const { wishlist, toggleWishlist } = useWishlist()
    const isWishlisted = wishlist.includes(product.id)
    const { user } = useAuth()
    const navigate = useNavigate()

    const expiresAt = new Date(product.expires_at);
    const now = new Date();

    const hoursUntilExpire =
        (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60);

    const isExpiringSoon = hoursUntilExpire > 0 && hoursUntilExpire <= 24;
    const isLowStock = product.quantity > 0 && product.quantity <= 3;
    const isSoldOut = product.quantity <= 0;
    const isDonation = Number(product.price) === 0 || product.is_donation;

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        if (!user) {
            navigate('/login')
        } else {
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
    }

    return (<div
        key={product.slug}
        className={styles.product_card_container}
        style={{ cursor: 'pointer' }}
        onClick={() => navigate(`/products/${product.slug}`)}
    >
        <div
            className={`${styles.wishlist_icon}`}
            onClick={(e) => {
                e.stopPropagation()
                if (!user) {
                    navigate('/login')
                } else {
                    console.log("Apasat heart pentru:", product.id);
                    toggleWishlist(product.id);
                }
            }}
        >
            <Heart
                size={26}
                className={`${isWishlisted ? styles.wishlist_icon__heart_toggled : styles.wishlist_icon__heart} cursor-pointer`}
            />
        </div>

        <div className={styles.badges_container}>
            {isDonation && (
                <span className={`${styles.badge} ${styles.badge_donation}`}>
                    Donație
                </span>
            )}

            {isSoldOut && (
                <span className={`${styles.badge} ${styles.badge_sold_out}`}>
                    Epuizat
                </span>
            )}

            {!isSoldOut && isLowStock && (
                <span className={`${styles.badge} ${styles.badge_low_stock}`}>
                    Stoc redus
                </span>
            )}

            {!isSoldOut && isExpiringSoon && (
                <span className={`${styles.badge} ${styles.badge_expiring}`}>
                    Expiră curând
                </span>
            )}
        </div>
        <a href="#" className={styles.product_card}>
            <div className={styles.product_card__img_container}>
                <img src={product.image ? product.image.includes(API_URL) ? product.image : API_URL + product.image : placeholderImage} alt="food" className={styles.product_card__img} />
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
                    <HandCoins className={`${styles.product_card_container__icon}`} />

                    <span className={styles.price_content}>
                        {product.original_price && (
                            <span className={styles.old_price}>
                                {product.original_price} lei
                            </span>
                        )}

                        <span className={styles.new_price}>
                            {Number(product.price) === 0 ? "Gratuit" : `${product.price} lei`}
                        </span>
                    </span>
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
            <div className={styles.store_container}>
                <div
                    className={styles.store_name_container}
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        navigate(`/store/${product.owner}`)
                    }}
                >
                    <span className={styles.store_name_icon}>
                        <Store />
                    </span>

                    <span className={styles.store_name_content}>{product.store_name}</span>
                </div>
                <div className={styles.store_location_container}>
                    <span className={styles.store_location_icon}>
                        <MapPinHouse />
                    </span>
                    <span className={styles.store_location_content}>{product.location}</span>
                </div>

            </div>




            <div className={`${styles.product_card_container__info_hover} flex`}>
                <Info className={`${styles.product_card_container__icon} `} />
                <span>{product.description}</span>
            </div>


            <button
                className={`${styles.product_card_container__add_to_cart} flex justify-center items-center`}
                onClick={(e) => handleAddToCart(e)}
            >
                <ShoppingBag size={20} strokeWidth={2.3} />
            </button>

            <div className={`${styles.product_card_container__info_button} flex justify-center items-center`}>
                <SquareMousePointer className={`${styles.product_card_container__info_icon} `} />
                <span>Detalii</span>
            </div>
        </div>
    </div>)

}

export default HomeCard

