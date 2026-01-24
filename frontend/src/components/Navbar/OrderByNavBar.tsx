import styles from './Navbar.module.css'
import { useState } from 'react'
import { ArrowDownUp } from 'lucide-react'
import { ORDER_LIST, ProductOrder } from '../../constants/productOrder.ts'

type OrderByProps = {
    orderBy: ProductOrder;
    setOrderBy: (value: ProductOrder) => void;
}

function OrderByNavBar({ orderBy, setOrderBy }: OrderByProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    return (
        <div className={`${styles.order_container} flex flex-col`}>
            {/* Dropdown header */}
            <div
                className={`${styles.order_dropdown_container} flex justify-between`}
                onClick={() => setIsDropdownOpen(prev => !prev)}
            >
                <span>Ordonează</span>
                <ArrowDownUp className={styles.dropdown_icon} />
            </div>

            {/* Dropdown content */}
            {isDropdownOpen && (
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
                                    setIsDropdownOpen(prev => !prev);
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
