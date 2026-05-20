import { ProductOrder } from '../../constants/productOrder.ts';
type OrderByProps = {
    setOrderBy: (value: ProductOrder) => void;
    setIsFilterDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isOrderDropdownOpen: boolean;
    setIsOrderDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
declare function OrderByNavBar({ setOrderBy, setIsFilterDropdownOpen, isOrderDropdownOpen, setIsOrderDropdownOpen }: OrderByProps): import("react").JSX.Element;
export default OrderByNavBar;
//# sourceMappingURL=OrderByNavBar.d.ts.map