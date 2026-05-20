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
    Search,
    MapPin,
    X,
    LocateFixed,
    PackagePlus
} from 'lucide-react'

import { useState, useEffect } from 'react'
import { Category } from '../../types/Category.ts'
import publicApi from '../../apiPublic.ts'
import { ProductFilters } from '../../types/productFilters.ts'
import FilterNavbar from '../../components/Navbar/FilterNavBar.tsx'
import OrderByNavBar from '../../components/Navbar/OrderByNavBar.tsx'
import NotificationBell from '../../components/Navbar/NotificationBell.tsx'
import MapPicker from '../../components/Navbar/MapPicker.tsx'
import { ProductOrder } from '../../constants/productOrder.ts'
import { ProductPublic } from "../../types/Product.ts"

import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth.ts'
import { useCart } from '../../context/useCart.ts'
import { useDashboardTab } from '../../context/DashboardTabContext.tsx'
import { useWishlist } from '../../context/WishlistContext.tsx'
import AnimatedBackground from '../../styles/animatedBackground/AnimatedBackground.tsx'
import ConfirmModal from "../../components/ConfirmModal.tsx";

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
    const [showMap, setShowMap] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState({
        lat: filters.lat ?? 44.439663,
        lng: filters.lng ?? 26.096306
    })
    const [radius, setRadius] = useState(filters.radius ?? 5)

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
        location.pathname.startsWith('/products') ||
        location.pathname.startsWith('/forgot-password') ||
        location.pathname.startsWith('/reset-password')
    )
    const [mapMessage, setMapMessage] = useState("");
    const [mapMessageType, setMapMessageType] = useState<"success" | "error" | "">("");
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    const itemsCount =
        cart?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0

    useEffect(() => {
        publicApi.get<Category[]>('api/categories/')
            .then((res) => setCategories(res.data))
            .catch((err) => console.log(err))
    }, [])

    useEffect(() => {
        if (!mapMessage) return;

        const timer = setTimeout(() => {
            setMapMessage("");
            setMapMessageType("");
        }, 3500);

        return () => clearTimeout(timer);
    }, [mapMessage]);

    const handleUserClick = () => {
        if (!user) return navigate('/login')
        setOpenUserDropDown(prev => !prev)
    }

    const handleLogout = () => {
        logout();
        setOpenUserDropDown(false);
        setShowLogoutModal(false);
        navigate('/login');
    };

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

    const handleApplyMapFilter = () => {
        setFilters(prev => ({
            ...prev,
            lat: selectedLocation.lat,
            lng: selectedLocation.lng,
            radius: radius,
        }));

        setShowMap(false);
    };

    const handleClearMapFilter = () => {
        setFilters(prev => ({
            ...prev,
            lat: undefined,
            lng: undefined,
            radius: undefined,
        }));

        setSelectedLocation({
            lat: 44.429588,
            lng: 26.103854,
        });

        setRadius(5);
        setShowMap(false);
    };

    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            setMapMessage("Browserul nu suportă localizarea.");
            setMapMessageType("error");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                setSelectedLocation({ lat, lng });

                setFilters(prev => ({
                    ...prev,
                    lat,
                    lng,
                    radius,
                }));

                setMapMessage("Locația ta a fost detectată.");
                setMapMessageType("success");
            },
            () => {
                setMapMessage("Nu am putut accesa locația. Verifică permisiunile browserului.");
                setMapMessageType("error");
            }
        );
    };

    const handleAddProductPage = () => {
        setActiveTab("Adaugă produs");
        navigate("/dashboard");
        setOpenUserDropDown(false);
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFilters(prev => ({
                ...prev,
                search: searchValue || undefined
            }))
        }, 400)
        return () => clearTimeout(timeout)
    }, [searchValue, setFilters])



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
                    loading="lazy"
                    decoding="async"
                />
            </div>

            {/* Filter / Search */}


            <div className={`${styles.navbar_pages_filters_container} flex flex-col`}>
                <div className={styles.navbar_page_links_container}>
                    <div
                        onClick={() => navigate('/about')}
                        className={isActive('/about') ? styles.active_link : ''}
                    >
                        <span>Despre noi</span>
                    </div>

                    <div
                        onClick={() => navigate('/')}
                        className={
                            location.pathname === '/' || location.pathname.startsWith('/products')
                                ? styles.active_link
                                : ''
                        }
                    >
                        Oferte
                    </div>

                    <div
                        onClick={() => navigate('/contact')}
                        className={isActive('/contact') ? styles.active_link : ''}
                    >
                        Contact
                    </div>
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
                        <button
                            className={styles.map_filter_btn}
                            onClick={() => {
                                setShowMap(true);
                                setIsFilterDropdownOpen(false);
                                setIsOrderDropdownOpen(false);
                            }}
                        >
                            <MapPin size={18} />
                            <span>
                                {filters.lat && filters.lng ? `${filters.radius} km` : "Hartă"}
                            </span>
                        </button>
                    </div>
                }
            </div>






            {/* Icons */}
            <div className={`flex gap-4 justify-between items-center ${styles.icon_container}`}>

                {user?.role === "vendor" && (
                    <button
                        className={styles.add_product_nav_btn}
                        onClick={handleAddProductPage}
                    >
                        <PackagePlus size={18} />
                        <span>Adaugă produs</span>
                    </button>
                )}

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
                                    onClick={() => setShowLogoutModal(true)}
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
            {showMap && (
                <div className={styles.map_modal_overlay}>
                    <div className={styles.map_modal}>
                        <div className={styles.map_modal_header}>
                            <h3>Alege zona</h3>
                            <X
                                className={styles.map_modal_close}
                                onClick={() => setShowMap(false)}
                            />
                        </div>

                        {mapMessage && (
                            <div
                                className={`${styles.form_message} ${mapMessageType === "success" ? styles.success : styles.error
                                    }`}
                            >
                                {mapMessage}
                            </div>
                        )}

                        <MapPicker
                            initialLat={selectedLocation.lat}
                            initialLng={selectedLocation.lng}
                            products={allProducts}
                            radius={radius}
                            onCloseMap={() => setShowMap(false)}
                            onChange={(lat, lng) => {
                                setSelectedLocation({ lat, lng });
                            }}
                        />
                        <div className={styles.use_location_radius_container}>
                            <button
                                className={styles.use_location_btn}
                                onClick={handleUseMyLocation}
                            >
                                <LocateFixed size={22} />
                                <span>Folosește locația mea</span>

                            </button>


                            <div className={styles.radius_container}>
                                <label>Rază căutare</label>

                                <select
                                    value={radius}
                                    onChange={(e) => setRadius(Number(e.target.value))}
                                >
                                    <option value={1}>1 km</option>
                                    <option value={3}>3 km</option>
                                    <option value={5}>5 km</option>
                                    <option value={10}>10 km</option>
                                    <option value={20}>20 km</option>
                                </select>
                            </div>
                        </div>



                        <div className={styles.map_modal_actions}>
                            <button onClick={handleClearMapFilter}>
                                Șterge filtrul
                            </button>

                            <button onClick={handleApplyMapFilter}>
                                Aplică zona
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ConfirmModal
                open={showLogoutModal}
                title="Te deconectezi?"
                message="Ești sigur că vrei să ieși din cont?"
                confirmText="Deconectare"
                cancelText="Renunță"
                danger
                onCancel={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
            />
        </nav>
    )
}

export default Navbar
