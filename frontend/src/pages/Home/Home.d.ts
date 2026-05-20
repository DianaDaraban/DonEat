import { ProductPublic } from "../../types/Product.ts";
import { ProductOrder } from "../../constants/productOrder.ts";
type HomeProps = {
    products: ProductPublic[];
    orderBy: ProductOrder;
};
declare function Home({ products, orderBy }: HomeProps): import("react").JSX.Element;
export default Home;
//# sourceMappingURL=Home.d.ts.map