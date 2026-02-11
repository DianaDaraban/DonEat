
import { ProductPublic } from "../../types/Product.ts"
import styles from './Home.module.scss'
import { ProductOrder } from "../../constants/productOrder.ts";
import HomeCard from "../../components/HomeComponents/HomeCard.tsx";


type HomeProps = {
    products: ProductPublic[];
    orderBy: ProductOrder;
};

function Home({ products, orderBy }: HomeProps) {


    const sortedProducts = [...products].sort((a, b) => {
        switch (orderBy) {
            case 'newest':
                return (
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                );

            case 'price_asc':
                return (Number(a.price) || 0) - (Number(b.price) || 0)

            case 'price_desc':
                return (Number(b.price) || 0) - (Number(a.price) || 0)

            case 'expires_soon':
                return (
                    new Date(a.expires_at).getTime() -
                    new Date(b.expires_at).getTime()
                );

            case 'quantity_desc':
                return b.quantity - a.quantity

            default:
                return 0
        }

    })


    return (
        <div className={styles.cards_container}>
            {sortedProducts.map((product, index) => (
                <HomeCard key={index} product={product} />
            ))}
        </div>
    );

}
export default Home