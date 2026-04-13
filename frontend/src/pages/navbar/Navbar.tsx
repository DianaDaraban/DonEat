import styles from './Navbar.module.scss'
import logo from '../../assets/images/logo_DONEAT_FIN-01.svg'
import {
    User,
    ShoppingCart,
    Wallet,
    Store,
    Heart,
    LayoutDashboard,
    LogOut,
    ShoppingBag,
    UserCog,
    Settings,
    Search
} from 'lucide-react'

import { useState, useEffect } from 'react'
import { Category } from '../../types/Category.ts'
import publicApi from '../../apiPublic.ts'
import { ProductFilters } from '../../types/productFilters.ts'
import FilterNavbar from '../../components/Navbar/FilterNavBar.tsx'
import OrderByNavBar from '../../components/Navbar/OrderByNavBar.tsx'
import NotificationBell from '../../components/Navbar/NotificationBell.tsx'
import { ProductOrder } from '../../constants/productOrder.ts'
import { ProductPublic } from "../../types/Product.ts"

import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth.ts'
import { useCart } from '../../context/useCart.ts'
import { useDashboardTab } from '../../context/DashboardTabContext.tsx'
import { useWishlist } from '../../context/WishlistContext.tsx'
import AnimatedBackground from '../../styles/animatedBackground/AnimatedBackground.tsx'

type NavbarProps = {
    filters: ProductFilters
    setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>
    setOrderBy: (value: ProductOrder) => void
    allProducts: ProductPublic[]
}

function Navbar({ filters, setFilters, setOrderBy, allProducts }: NavbarProps) {

    const [categories, setCategories] = useState<Category[]>([])
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)
    const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false)
    const [openUserDropDown, setOpenUserDropDown] = useState(false)
    const [searchValue, setSearchValue] = useState('')

    const { user, logout } = useAuth()
    const { cart } = useCart()
    const { setActiveTab } = useDashboardTab()
    const { wishlist } = useWishlist()
    const navigate = useNavigate()
    const location = useLocation()
    const hideOverlay = !(
        location.pathname === '/login' ||
        location.pathname === '/register' ||
        location.pathname.startsWith('/dashboard') ||
        location.pathname.startsWith('/orders') ||
        location.pathname.startsWith('/wishlist') ||
        location.pathname.startsWith('/cart') ||
        location.pathname.startsWith('/about') ||
        location.pathname.startsWith('/contact') ||
        location.pathname.startsWith('/products')
    )

    const itemsCount =
        cart?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0

    useEffect(() => {
        publicApi.get<Category[]>('api/categories/')
            .then((res) => setCategories(res.data))
            .catch((err) => console.log(err))
    }, [])

    const handleUserClick = () => {
        if (!user) return navigate('/login')
        setOpenUserDropDown(prev => !prev)
    }

    const handleLogout = () => {
        logout()
        setOpenUserDropDown(false)
        navigate('/login')
    }

    const handleCartPage = () => {
        if (!user) {
            navigate('/login')
        } else {
            navigate('/cart')
            setOpenUserDropDown(false)
        }
    }

    const handleDashboardTab = (tabLabel: string) => {
        setActiveTab(tabLabel)
        navigate('/dashboard')
        setOpenUserDropDown(false)
    }

    const handleWishlistPage = () => {
        if (!user) {
            navigate('/login')
        } else {
            navigate('/wishlist')
        }
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value

        setSearchValue(value)
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFilters(prev => ({
                ...prev,
                search: searchValue || undefined
            }))
        }, 400)
        return () => clearTimeout(timeout)
    }, [searchValue, setFilters])
    console.log(user)
    return (
        <nav className={`flex justify-between items-center ${styles.nav_container}`}>
            <AnimatedBackground />
            {/* Logo */}
            <div className={`flex ${styles.logo_container}`}>
                <img
                    src={logo}
                    alt="Doneat logo"
                    onClick={() => navigate('/')}
                    className="cursor-pointer"
                />
            </div>

            {/* Filter / Search */}


            <div className={`${styles.navbar_pages_filters_container} flex flex-col`}>
                <div className={styles.navbar_page_links_container}>
                    <div onClick={() => navigate('/about')}>
                        <span>Despre proiect</span>
                    </div>
                    <div onClick={() => navigate('/')}>Oferte</div>
                    <div onClick={() => navigate('/contact')}>Contact</div>
                </div>
                {hideOverlay &&
                    <div className={`flex justify-between items-center ${styles.search_filter_container}`}>

                        <FilterNavbar
                            filters={filters}
                            setFilters={setFilters}
                            categories={categories}
                            allProducts={allProducts}
                            isFilterDropdownOpen={isFilterDropdownOpen}
                            setIsFilterDropdownOpen={setIsFilterDropdownOpen}
                            setIsOrderDropdownOpen={setIsOrderDropdownOpen}
                        />

                        <OrderByNavBar
                            setOrderBy={setOrderBy}
                            isOrderDropdownOpen={isOrderDropdownOpen}
                            setIsOrderDropdownOpen={setIsOrderDropdownOpen}
                            setIsFilterDropdownOpen={setIsFilterDropdownOpen}
                        />

                        <div className={`${styles.search_container}`} >
                            <input
                                type="text"
                                placeholder="Caută produse..."
                                value={searchValue}
                                onFocus={() => {
                                    setIsFilterDropdownOpen(false)
                                    setIsOrderDropdownOpen(false)
                                }}
                                onChange={(e) => handleSearchChange(e)}
                            />
                            <Search size={22} color='var(--color-text)' />
                        </div>
                    </div>
                }
            </div>






            {/* Icons */}
            <div className={`flex gap-4 justify-between items-center ${styles.icon_container}`}>

                {/* User */}
                <div className="relative">
                    <User
                        className="cursor-pointer"
                        onClick={handleUserClick}
                    />

                    <div className={`flex flex-col justify-between items-center ${styles.user_container}`}>

                        {user && (
                            <div className={`flex justify-between items-center ${styles.user_container__name_role}`}>
                                <span>{user.first_name} {user.last_name}</span>
                                <span>
                                    {user.role === 'buyer' ? (
                                        <Wallet color='var(--color-light-red)' size={16} />
                                    ) : (
                                        <Store color='var(--color-light-red)' size={16} />
                                    )}
                                </span>
                            </div>
                        )}

                        {user && openUserDropDown && (
                            <div className={`flex flex-col justify-between ${styles.user_container__dropdown}`}>

                                <div
                                    onClick={() => handleDashboardTab('Profilul meu')}
                                    className={`${styles.user_wrapper} flex`}
                                >
                                    <UserCog size={16} color='var(--color-secondary)' />
                                    <span>Profilul meu</span>
                                </div>

                                <div
                                    onClick={() => handleDashboardTab('Setări')}
                                    className={`${styles.user_wrapper} flex`}
                                >
                                    <Settings size={16} color='var(--color-secondary)' />
                                    <span>Setări cont</span>
                                </div>

                                <div
                                    onClick={() =>
                                        handleDashboardTab(
                                            user.role === "vendor" ? 'Comenzi' : 'Comenzile mele'
                                        )
                                    }
                                    className={`${styles.user_wrapper} flex whitespace-nowrap`}
                                >
                                    <ShoppingBag size={16} color='var(--color-secondary)' />
                                    <span>
                                        {user.role === "vendor" ? 'Comenzi' : 'Comenzile mele'}
                                    </span>
                                </div>

                                {user.role === "vendor" && (
                                    <div
                                        onClick={() => handleDashboardTab('Rezumat')}
                                        className={`${styles.user_wrapper} flex`}
                                    >
                                        <LayoutDashboard size={16} color='var(--color-secondary)' />
                                        <span>Rezumat</span>
                                    </div>
                                )}

                                <div
                                    onClick={handleLogout}
                                    className={`${styles.user_wrapper} flex whitespace-nowrap`}
                                >
                                    <LogOut size={16} color='var(--color-secondary)' />
                                    <span>Deconectare</span>
                                </div>

                            </div>
                        )}

                    </div>
                </div>

                {user && <NotificationBell />}

                {/* Wishlist icon simplu */}
                <div
                    className={styles.cart_items_badge}
                    onClick={handleWishlistPage}
                >
                    <Heart className="cursor-pointer" fill={`${wishlist?.length > 0 ? 'rgba(var(--color-light-red-rgb), 0.75)' : 'transparent'}`} />
                    {wishlist?.length > 0 && <span>{wishlist.length}</span>}
                </div>
                {/* Cart */}
                <div
                    className={styles.cart_items_badge}
                    onClick={handleCartPage}
                >
                    <ShoppingCart className="cursor-pointer" />
                    {itemsCount > 0 && <span>{itemsCount}</span>}
                </div>

            </div>
        </nav>
    )
}

export default Navbar
