import styles from './Navbar.module.scss'
import logo from '../../assets/images/logo_DONEAT_FIN-01.svg'
import { User, ShoppingCart, Wallet, Store, Heart, LayoutDashboard, LogOut, ShoppingBag, UserCog, Settings } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Category } from '../../types/Category.ts'
import publicApi from '../../apiPublic.ts'
import { ProductFilters } from '../../types/productFilters.ts'
import FilterNavbar from './FilterNavBar.tsx'
import OrderByNavBar from './OrderByNavBar.tsx'
import { ProductOrder } from '../../constants/productOrder.ts'
import { ProductPublic } from "../../types/Product.ts"
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth.ts'
import { useCart } from '../../context/useCart.ts'

type NavbarProps = {
    filters: ProductFilters;
    setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
    setOrderBy: (value: ProductOrder) => void;
    allProducts: ProductPublic[];
};



function Navbar({ filters, setFilters, setOrderBy, allProducts }: NavbarProps) {

    const [categories, setCategories] = useState<Category[]>([])
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)
    const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false)
    const [openUserDropDown, setOpenUserDropDown] = useState(false)
    const { user, logout } = useAuth()
    const { cart } = useCart()

    const navigate = useNavigate();
    const location = useLocation();
    const hideOverlay = !["/login", "/register", '/dashboard'].includes(location.pathname);

    const itemsCount = cart?.items.reduce((acc, item) => acc += item.quantity, 0) ?? 0

    useEffect(() => {
        publicApi.get<Category[]>('api/categories/')
            .then((res) => res.data)
            .then((data): void => setCategories(data))
            .catch((err) => alert(err))
    }, [])


    const handleUserClick = () => {
        if (!user) return navigate('/login')
        setOpenUserDropDown(prev => !prev)
    }

    const handleLogout = () => {
        logout();
        setOpenUserDropDown(false);
        navigate('/login')
    }

    const handleCartPage = () => navigate('/cart')


    return <nav className={`flex justify-between items-center ${styles.nav_container} relative`}>
        {/* Logo container */}
        <div className={`flex ${styles.logo_container}`}>
            <img src={logo} alt="Doneat logo" />
        </div>
        {/* Filter and search container */}
        {hideOverlay &&
            <div className={`flex justify-between items-center ${styles.search_filter_container}`}>
                <FilterNavbar
                    filters={filters}
                    setFilters={setFilters}
                    categories={categories}
                    allProducts={allProducts}
                    isFilterDropdownOpen={isFilterDropdownOpen}
                    setIsFilterDropdownOpen={setIsFilterDropdownOpen}
                    setIsOrderDropdownOpen={setIsOrderDropdownOpen} />
                {/* Order Container */}
                <OrderByNavBar
                    setOrderBy={setOrderBy}
                    isOrderDropdownOpen={isOrderDropdownOpen}
                    setIsOrderDropdownOpen={setIsOrderDropdownOpen}
                    setIsFilterDropdownOpen={setIsFilterDropdownOpen} />
                {/* Search container */}
                <div className={`${styles.search_container} flex flex-col`}>

                </div>
            </div>
        }
        {/* User icon and Cart Icon */}
        <div className={`flex gap-4 justify-between items-center ${styles.icon_container}`}>
            <div className="relative">
                <User
                    className="cursor-pointer"
                    onClick={handleUserClick}
                // fill='rgba(var(--color-primary-rgb), 0.3)'
                />
                <div className={`flex flex-col justify-between items-center ${styles.user_container}`}>
                    {user && (<div className={`flex justify-between items-center ${styles.user_container__name_role}`}>
                        <span>{user.username}</span>
                        <span>{user.role === 'buyer' ?
                            <Wallet
                                color='var(--color-light-red)'
                                size={16}
                            /> :
                            <Store
                                color='var(--color-light-red)'
                                size={16}
                            />}</span>
                    </div>)}

                    {user && openUserDropDown && (<div className={`flex flex-col justify-between ${styles.user_container__dropdown}`}>
                        <div
                            onClick={() => navigate('/dashboard')}
                            className={`${styles.user_wrapper} flex`}
                        >
                            <UserCog size={16} color='var(--color-secondary)' />
                            <span>Profilul meu</span>
                        </div>
                        <div
                            onClick={() => navigate('/dashboard')}
                            className={`${styles.user_wrapper} flex`}
                        >
                            <Settings size={16} color='var(--color-secondary)' />
                            <span>Setări cont</span>
                        </div>
                        {user.role === "vendor" &&
                            <div
                                onClick={() => navigate('/dashboard')}
                                className={`${styles.user_wrapper} flex`}
                            >
                                <LayoutDashboard size={16} color='var(--color-secondary)' />
                                <span>Panou de control</span>
                            </div>
                        }
                        {user.role === "buyer" &&

                            (<><div
                                onClick={() => navigate('/')}
                                className={`${styles.user_wrapper} flex whitespace-nowrap`}
                            >
                                <Heart size={16} color='var(--color-secondary)' />
                                <span>Produse favorite</span>
                            </div>
                                <div
                                    onClick={() => navigate('/')}
                                    className={`${styles.user_wrapper} flex whitespace-nowrap`}
                                >
                                    <ShoppingBag size={16} color='var(--color-secondary)' />
                                    <span>Comenzile mele</span>
                                </div></>)

                        }
                        <div
                            onClick={handleLogout}
                            className={`${styles.user_wrapper} flex whitespace-nowrap`}
                        >
                            <LogOut size={16} color='var(--color-secondary)' />
                            <span>Deconectare</span>
                        </div>
                    </div>)}

                </div>
            </div>
            <Heart className='cursor-pointer' />
            <div className={styles.cart_items_badge} onClick={handleCartPage}>
                <ShoppingCart className='cursor-pointer' />
                {itemsCount > 0 && <span>{itemsCount}</span>}
            </div>

        </div>

    </nav>
}

export default Navbar