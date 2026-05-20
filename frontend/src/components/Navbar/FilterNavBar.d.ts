import { ProductFilters } from '../../types/productFilters.ts';
import { Category } from '../../types/Category.ts';
import { ProductPublic } from '../../types/Product.ts';
type FilterProps = {
    filters: ProductFilters;
    setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
    categories: Category[];
    allProducts: ProductPublic[];
    isFilterDropdownOpen: boolean;
    setIsFilterDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOrderDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
declare function FilterNavbar({ filters, setFilters, categories, allProducts, isFilterDropdownOpen, setIsFilterDropdownOpen, setIsOrderDropdownOpen }: FilterProps): import("react").JSX.Element;
export default FilterNavbar;
//# sourceMappingURL=FilterNavBar.d.ts.map