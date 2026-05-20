import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Store, Package, Gift, MapPin } from "lucide-react";
import { ProductPublic } from "../../types/Product.ts";
import styles from "./StorePage.module.scss";
import LoadingIndicator from "../../components/LoadingIndicator.tsx";
import HomeCard from "../../components/HomeComponents/HomeCard.tsx";

const API_URL = import.meta.env.VITE_API_URL;

function StorePage() {
    const { ownerId } = useParams();
    const [products, setProducts] = useState<ProductPublic[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products/`);
                const data: ProductPublic[] = await res.json();

                const filtered = data.filter(
                    product => String(product.owner) === String(ownerId)
                );

                setProducts(filtered);
            } catch (error) {
                console.error("Failed to fetch store products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [ownerId]);

    if (loading) return <LoadingIndicator />;

    const storeName = products[0]?.store_name || "Magazin";
    const location = products[0]?.location || "Locație indisponibilă";
    const donationsCount = products.filter(product => product.is_donation).length;
    const storeLogo = products[0]?.store_logo;
    const storeDescription = products[0]?.store_description;

    return (
        <main className={styles.store_page}>
            <button
                className={styles.btn_back_products}
                onClick={() => navigate("/")}
            >
                <ArrowLeft size={18} />
                <span>Înapoi la oferte</span>
            </button>
            <section className={styles.store_hero}>
                <div className={styles.store_hero__content}>
                    <div className={styles.store_hero__icon}>
                        {storeLogo ? (
                            <img
                                src={storeLogo.includes(API_URL) ? storeLogo : API_URL + storeLogo}
                                alt={storeName}
                                loading="lazy"
                                decoding="async"
                            />
                        ) : (
                            <Store size={38} />
                        )}
                    </div>

                    <div>
                        <span className={styles.store_hero__label}>
                            Produsele de la
                        </span>
                        <h2>{storeName}</h2>
                        {storeDescription && (
                            <p className={styles.store_hero__description}>
                                {storeDescription}
                            </p>
                        )}
                        <div className={styles.store_hero__meta}>
                            <span>
                                <MapPin size={20} color="var(--color-primary)" />
                                {location}
                            </span>
                            <span>
                                <Package size={20} color="var(--color-primary)" />
                                {products.length} produse disponibile
                            </span>
                            <span>
                                <Gift size={20} color="var(--color-primary)" />
                                {donationsCount} donații
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {products.length === 0 ? (
                <section className={styles.empty_state}>
                    <Store size={42} />
                    <h2>Momentan nu există produse disponibile</h2>
                    <p>
                        Acest vendor nu are produse active în acest moment.
                        Revino mai târziu sau explorează alte oferte.
                    </p>
                    <button onClick={() => navigate("/")}>
                        Vezi toate ofertele
                    </button>
                </section>
            ) : (
                <section className={styles.products_grid}>
                    {products.map(product => (
                        <HomeCard key={product.id} product={product} />
                    ))}
                </section>
            )}
        </main>
    );
}

export default StorePage;