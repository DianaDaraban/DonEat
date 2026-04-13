import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingIndicator from "../../components/LoadingIndicator.tsx";
import styles from './ProductDetailPage.module.scss'
import { ProductPublic } from "../../types/Product.ts";
import { MapPinCheckInside, Package, HouseHeart } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL;
import placeholderImage from "../../assets/default_image_icon.jpg"

function ProductDetailPage() {
    const { slug } = useParams()
    const [product, setProduct] = useState<ProductPublic | null>(null)

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

    if (!product) return <LoadingIndicator />
    console.log(product)
    return (
        <div className={styles.container}>
            <div className={styles.card}>

                <div className={styles.imageWrapper}>
                    <img
                        src={product.image ? product.image.includes(API_URL) ? product.image : API_URL + product.image : placeholderImage}
                        alt={product.title}
                        className={styles.card__image}
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
                            <div className={styles.owner_details}>
                                <HouseHeart color="var(--color-primary)"
                                    size={18} />
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
                        Expiră la: {new Date(product.expires_at).toLocaleString()}
                    </div>

                    <p className={styles.description}>
                        {product.description}
                    </p>

                    <button className={styles.button}>
                        Adaugă în coș
                    </button>

                </div>
            </div>
        </div>
    )
}

export default ProductDetailPage