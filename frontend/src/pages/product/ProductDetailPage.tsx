import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingIndicator from "../../components/LoadingIndicator.tsx";
import styles from './ProductDetailPage.module.scss'
import { ProductPublic } from "../../types/Product.ts";
import { MapPinCheckInside, Package, HouseHeart, Heart, ShoppingCart, StepBack, StepForward } from 'lucide-react'
import { useWishlist } from '../../context/WishlistContext.tsx'
import { useAuth } from "../../context/useAuth.ts";
import { useCart } from "../../context/useCart.ts";

const API_URL = import.meta.env.VITE_API_URL;
import placeholderImage from "../../assets/default_image_icon.jpg"

function ProductDetailPage() {
    const { slug } = useParams()
    const [product, setProduct] = useState<ProductPublic | null>(null)
    const [relatedProducts, setRelatedProducts] = useState<ProductPublic[]>([])
    const [sameCategoryProducts, setSameCategoryProducts] = useState<ProductPublic[]>([])
    const [carouselIndex, setCarouselIndex] = useState(0)
    const navigate = useNavigate()
    const { toggleWishlist } = useWishlist()
    const { user } = useAuth()
    const { addProduct } = useCart()

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products/${slug}/`)
                const data = await res.json()
                setProduct(data)
            } catch (err) {
                console.log(err)
            }
        }
        if (slug) {
            fetchProduct()
        }

    }, [slug])

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            if (!product?.owner) return

            try {
                const res = await fetch(`${API_URL}/api/products/`)
                let data: ProductPublic[] = await res.json()
                data = data.filter(item => item.owner === product.owner && item.id !== product.id)
                setRelatedProducts(data)
            } catch (err) {
                console.log(err)
            }
        }

        fetchRelatedProducts()
    }, [product])

    useEffect(() => {
        const fetchSameCategoryProducts = async () => {
            if (!product?.category?.id) return

            try {
                const res = await fetch(`${API_URL}/api/products/`)
                let data: ProductPublic[] = await res.json()

                data = data
                    .filter(item =>
                        item.category?.id === product.category?.id &&
                        item.id !== product.id
                    )
                    .slice(0, 12)

                setSameCategoryProducts(data)
                setCarouselIndex(0)
            } catch (err) {
                console.log(err)
            }
        }

        fetchSameCategoryProducts()
    }, [product])

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        if (!user) {
            navigate('/login')
        } else {
            if (product) {
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
    }
    const visibleCards = 4
    const maxIndex = Math.max(0, sameCategoryProducts.length - visibleCards)

    const handlePrevCategory = () => {
        setCarouselIndex(prev => Math.max(prev - 1, 0))
    }

    const handleNextCategory = () => {
        setCarouselIndex(prev => Math.min(prev + 1, maxIndex))
    }


    if (!product) return <LoadingIndicator />
    console.log(sameCategoryProducts)
    return (
        <div className={styles.container}>
            <div className={styles.upper_container}>
                <div className={styles.card}>
                    <div className={styles.card__info_card}>
                        <div className={styles.imageWrapper}>
                            <img
                                src={product.image ? product.image.includes(API_URL) ? product.image : API_URL + product.image : placeholderImage}
                                alt={product.title}
                                className={styles.card__image}
                                loading="lazy"
                                decoding="async"
                            />
                        </div>

                        <div className={styles.info}>
                            <h1 className={styles.title}>{product.title}</h1>

                            <p className={styles.category}>
                                Categorie: <span>{product.category?.name}</span>
                            </p>

                            <div className={styles.meta}>
                                <div className={styles.owner_container}>
                                    <div className={styles.owner_title}>Vânzător</div>
                                    <div
                                        className={styles.owner_details}
                                        onClick={() => navigate(`/store/${product.owner}`)}
                                        role="button"
                                    >
                                        <HouseHeart color="var(--color-primary)" size={18} />
                                        <span>{product.store_name}</span>
                                    </div>
                                </div>
                                <div className={styles.location_container}>
                                    <div className={styles.location_title}>Locație</div>
                                    <div className={styles.location_details}>
                                        <MapPinCheckInside
                                            color="var(--color-primary)"
                                            size={18}
                                        />
                                        <span>{product.location}</span>
                                    </div>
                                </div>
                                <div className={styles.quantity_container}>
                                    <div className={styles.quantity_title}>Cantitate disponibilă</div>
                                    <div className={styles.quantity_details}>
                                        <Package
                                            color="var(--color-primary)"
                                            size={18}
                                        />
                                        <span>
                                            {product.quantity} {product.unit}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.priceSection}>
                                    <div className={styles.priceSection__title}>Preț</div>
                                    {Number(product.price) === 0 ? (
                                        <span className={styles.price}>Gratuit</span>
                                    ) : (
                                        <span className={styles.price}>
                                            {product.price} RON
                                        </span>
                                    )}
                                </div>

                                <div className={styles.expiry}>
                                    <span className={styles.expiry__title}>Expiră la</span>
                                    <span className={styles.expiry__content}>{new Date(product.expires_at).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.description}>
                        <div className={styles.description__title}>
                            Detalii
                        </div>
                        <div className={styles.description__content}>
                            {product.description}
                        </div>

                    </div>
                    <div className={styles.product_btn_container}>
                        <button
                            className={styles.button_wishlist}
                            onClick={() => toggleWishlist(product.id)}
                        >
                            <Heart size={18} />
                            <span>Adaugă în wishlist</span>
                        </button>
                        <button
                            className={styles.button_cart}
                            onClick={(e) => handleAddToCart(e)}
                        >
                            <ShoppingCart size={18} />
                            <span>Adaugă în coș</span>
                        </button>
                    </div>

                </div>
                <div className={styles.related_products}>
                    <div className={styles.related_products__title}>
                        Mai multe de la
                        <span
                            className={styles.related_products__store_name}
                            onClick={() => navigate(`/store/${product.owner}`)}
                        >
                            {product.store_name}
                        </span>
                    </div>
                    <div className={styles.related_products__content}>
                        {relatedProducts.map(relatedProduct => {
                            return (
                                <div
                                    className={styles.related_product_container}
                                    onClick={() => navigate(`/products/${relatedProduct.slug}`)}
                                    key={relatedProduct.slug}
                                >
                                    <div className={styles.related_product_imageWrapper}>
                                        <img
                                            src={relatedProduct.image ? relatedProduct.image.includes(API_URL) ? relatedProduct.image : API_URL + relatedProduct.image : placeholderImage}
                                            alt={relatedProduct.title}
                                            className={styles.related_product_image}
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                    <div className={styles.related_product_details}>
                                        <div className={styles.related_product_details__title}>
                                            {relatedProduct.title}
                                        </div>
                                        <div className={styles.related_product_details__price}>
                                            <span>Preț</span>
                                            <span>{relatedProduct.price} Ron</span>
                                        </div>
                                        <div className={styles.related_product_details__expiry}>
                                            <span>Expiră la</span>
                                            <span>{new Date(relatedProduct.expires_at).toLocaleString()}</span>
                                        </div>
                                    </div>

                                </div>

                            )
                        })}
                    </div>
                </div>
            </div>

            <div className={styles.lower_container}>
                <div className={styles.category_section}>
                    <div className={styles.category_section__header}>
                        <div className={styles.category_section__title}>
                            Produse similare din categoria
                            <span className={styles.category_section__name}>
                                {product.category?.name}
                            </span>
                        </div>

                        {sameCategoryProducts.length > visibleCards && (
                            <div className={styles.category_section__actions}>
                                <button
                                    type="button"
                                    className={styles.carousel_btn}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        console.log('up')
                                        handlePrevCategory()
                                    }}
                                    disabled={carouselIndex === 0}
                                >
                                    <StepBack />
                                </button>
                                <button
                                    type="button"
                                    className={styles.carousel_btn}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        console.log('up')
                                        handleNextCategory()
                                    }}
                                    disabled={carouselIndex === maxIndex}
                                >
                                    <StepForward />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={styles.category_carousel}>
                        <div
                            className={styles.category_carousel__track}
                            style={{
                                transform: `translateX(-${carouselIndex * (100 / visibleCards)}%)`
                            }}
                        >
                            {sameCategoryProducts.map(categoryProduct => (
                                <div
                                    key={categoryProduct.slug}
                                    className={styles.category_product_card}
                                    onClick={() => navigate(`/products/${categoryProduct.slug}`)}
                                >
                                    <div className={styles.category_product_imageWrapper}>
                                        <img
                                            src={
                                                categoryProduct.image
                                                    ? categoryProduct.image.includes(API_URL)
                                                        ? categoryProduct.image
                                                        : API_URL + categoryProduct.image
                                                    : placeholderImage
                                            }
                                            alt={categoryProduct.title}
                                            className={styles.category_product_image}
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>

                                    <div className={styles.category_product_details}>
                                        <div className={styles.category_product_details__title}>
                                            {categoryProduct.title}
                                        </div>

                                        <div
                                            className={styles.category_product_details__store}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/store/${categoryProduct.owner}`);
                                            }}
                                        >
                                            {categoryProduct.store_name || 'Magazin necunoscut'}
                                        </div>

                                        <div className={styles.category_product_details__price}>
                                            <span className={styles.price_title}>Preț</span>
                                            <span className={styles.price_content}>{Number(categoryProduct.price) === 0
                                                ? 'Gratuit'
                                                : `${categoryProduct.price} RON`}</span>
                                        </div>

                                        <div className={styles.category_product_details__expiry}>
                                            Expiră la {new Date(categoryProduct.expires_at).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>


    )
}

export default ProductDetailPage