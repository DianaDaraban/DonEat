import styles from './Navbar.module.css'
import logo from '../../assets/images/logo_DONEAT_FIN-01.svg'
import { User, ShoppingCart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Category } from '../../types/Category.ts'
import publicApi from '../../apiPublic.ts'
import { ProductFilters } from '../../types/productFilters.ts'
import FilterNavbar from './FilterNavBar.tsx'
import OrderByNavBar from './OrderByNavBar.tsx'
import { ProductOrder } from '../../constants/productOrder.ts'

type NavbarProps = {
    filters: ProductFilters;
    setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
    orderBy: ProductOrder;
    setOrderBy: (value: ProductOrder) => void;
};

function Navbar({ filters, setFilters, orderBy, setOrderBy }: NavbarProps) {

    const [categories, setCategories] = useState<Category[]>([])


    const getCategories = (): void => {
        publicApi.get<Category[]>('api/categories/')
            .then((res) => res.data)
            .then((data): void => { setCategories(data); console.log(data) })
            .catch((err) => alert(err))
    }


    useEffect(() => {
        getCategories()
    }, [])


console.log(orderBy)

    return <nav className={`flex justify-between items-center ${styles.nav_container}`}>
        {/* Logo container */}
        <div className={`flex ${styles.logo_container}`}>
            <img src={logo} alt="Doneat logo" />
        </div>
        {/* Filter and search container */}
        <div className={`flex justify-between items-center ${styles.search_filter_container}`}>
            <FilterNavbar filters={filters} setFilters={setFilters} categories={categories} />
            {/* Order Container */}
            <OrderByNavBar orderBy={orderBy} setOrderBy={setOrderBy} />
            {/* Search container */}
            <div className={`${styles.search_container} flex flex-col`}>

            </div>
        </div>
        {/* User icon and Cart Icon */}
        <div className={`flex gap-4 justify-between items-center ${styles.icon_container}`}>
            <User className="w-6 h-6 text-gray-700" />
            <ShoppingCart className="w-6 h-6 text-green-600" />
        </div>

    </nav>
}

export default Navbar