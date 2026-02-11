import styles from './Navbar.module.scss'
import { ArrowDownUp } from 'lucide-react'
import { ORDER_LIST, ProductOrder } from '../../constants/productOrder.ts'

type OrderByProps = {

    setOrderBy: (value: ProductOrder) => void;
    setIsFilterDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isOrderDropdownOpen: boolean;
    setIsOrderDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function OrderByNavBar({  setOrderBy, setIsFilterDropdownOpen, isOrderDropdownOpen, setIsOrderDropdownOpen }: OrderByProps) {

    return (
        <div className={`${styles.order_container} flex flex-col`}>
            {/* Dropdown header */}
            <div
                className={`${styles.order_dropdown_container} flex justify-between`}
                onClick={() => {
                    setIsFilterDropdownOpen(false)
                    setIsOrderDropdownOpen(prev => !prev)
                }}
            >
                <span>Ordonează</span>
                <ArrowDownUp className={styles.dropdown_icon} />
            </div>

            {/* Dropdown content */}
            {isOrderDropdownOpen && (
                <div
                    className={`${styles.radio_container} flex flex-col`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {ORDER_LIST.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.value}
                                className={styles.radio_wrapper}
                                onClick={() => {
                                    setOrderBy(item.value);
                                    setIsOrderDropdownOpen(prev => !prev);
                                    setIsFilterDropdownOpen(false)
                                }}
                            >
                                <Icon size={16} className={styles.icon} />
                                <span>{item.label}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    )
}

export default OrderByNavBar
