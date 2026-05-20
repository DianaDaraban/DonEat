import { ProductFilters } from '../../types/productFilters.ts';
import { ProductOrder } from '../../constants/productOrder.ts';
import { ProductPublic } from "../../types/Product.ts";
type NavbarProps = {
    filters: ProductFilters;
    setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
    setOrderBy: (value: ProductOrder) => void;
    allProducts: ProductPublic[];
};
declare function Navbar({ filters, setFilters, setOrderBy, allProducts }: NavbarProps): import("react").JSX.Element;
export default Navbar;
//# sourceMappingURL=Navbar.d.ts.map