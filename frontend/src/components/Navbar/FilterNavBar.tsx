import styles from './Navbar.module.scss'
import { useState, useEffect, useMemo } from 'react'
import { SlidersHorizontal, ChevronUp, ChevronDown, X } from 'lucide-react'
import { ProductFilters } from '../../types/productFilters.ts'
import { Category } from '../../types/Category.ts'
import { ProductPublic } from '../../types/Product.ts'
import ResetFilterBtn from './ResetFilterBtn.tsx'
type FilterProps = {
    filters: ProductFilters;
    setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
    categories: Category[];
    allProducts: ProductPublic[];
    isFilterDropdownOpen: boolean;
    setIsFilterDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOrderDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

interface Locality {
    nume: string;
    tip: "oras" | "sat";
    localitate?: Locality[];
}

interface Municipality {
    nume: string;
    localitate: Locality[];
    oras: Locality[];
    municipiu: Locality[];
}


type Judet = {
    nume: string;
    municipiu?: unknown[];
    oras?: unknown[];
    comuna?: unknown[];
};

const getInitialFilters = (maxPrice?: number): ProductFilters => ({
    category: undefined,
    priceMax: maxPrice,
    minQuantity: 1,
    availableUntil: undefined,
    location: undefined,
    maxDistanceKm: undefined,
});


function FilterNavbar({ filters, setFilters, categories, allProducts, isFilterDropdownOpen, setIsFilterDropdownOpen, setIsOrderDropdownOpen }: FilterProps) {

    const [isCountyDropdownOpen, setIsCountyDropdownOpen] = useState(false)
    const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false)
    const [localities, setLocalities] = useState<Locality[]>([])
    const [counties, setCounties] = useState<string[]>([])
    const [selectedCounty, setSelectedCounty] = useState<string | null>(null)
    const [selectedCity, setSelectedCity] = useState('')
    const [selectedPrice, setSelectedPrice] = useState(filters.priceMax || 0)
    const [toDate, setToDate] = useState<string>('');
    const [toTime, setToTime] = useState<string>('');
    const [localFilters, setLocalFilters] = useState<ProductFilters>(() => getInitialFilters(undefined));





    useEffect(() => {
        const extractLocalities = (localities: Locality[]): string[] => {
            let result: string[] = [];
            for (const loc of localities) {
                if (loc.tip === "oras") {
                    result.push(loc.nume);
                }

                if (loc.localitate?.length) {
                    result = result.concat(extractLocalities(loc.localitate));
                }
            }
            return result;
        };



        const fetchCounties = async () => {
            const res = await fetch('https://orase.peviitor.ro/');
            const data = await res.json();
            setCounties(data.judet.map((el: Judet) => el.nume));

            if (!selectedCounty) return

            if (selectedCounty) {
                const county = data.judet.filter((el: Judet) => el.nume === selectedCounty)

                if (county) {
                    const localities = county.map((m: Municipality) => {
                        if (m) {
                            const cities = m.oras.map(el => extractLocalities(el.localitate || []))

                            const localities = m.municipiu.map(el => extractLocalities(el.localitate || []))

                            return [...cities, ...localities]
                        }
                    }
                    ).flat();
                    setLocalities(localities.flat());
                }

            }
        };


        fetchCounties();
    }, [selectedCounty]);

    const maxPrice = useMemo(() => {
        return allProducts.reduce((acc, p) => Math.max(acc, Number(p.price)), 0);
    }, [allProducts]);


    const handleCategoryChange = (categoryId: number) => {
        setLocalFilters(prev => {
            const currentCategories = prev.category || [];
            const newCategories = currentCategories.includes(categoryId)
                ? currentCategories.filter(id => id !== categoryId)
                : [...currentCategories, categoryId];
            return { ...prev, category: newCategories };
        });
    };



    return (
        <div className={`${styles.filter_container} flex flex-col`}>
            {/* Dropdown container */}
            {/* Dropdown container */}
            {/* Dropdown container */}
            <div
                className={`${styles.filter_container__dropdown_container} flex justify-between items-center`}
                onClick={() => {
                    setIsFilterDropdownOpen(prev => {
                        const newState = !prev;

                        setIsOrderDropdownOpen(false)

                        if (!prev) {
                            const initial = filters.priceMax !== undefined
                                ? { ...filters }
                                : getInitialFilters(maxPrice);

                            setLocalFilters(initial);
                            setSelectedPrice(initial.priceMax || maxPrice);
                        }

                        return newState;
                    });
                }}
            >
                <span>
                    Filtrează
                    {filters.category && filters.category.length > 0 && (
                        <div className={`${styles.filter_count}`}>
                            {filters.category.length}
                        </div>
                    )}
                </span>
                <SlidersHorizontal className={`${styles.filter_container__dropdown_icon}`} />
            </div>

            {/* Dropdown checkbox container */}
            {/* Dropdown checkbox container */}
            {/* Dropdown checkbox container */}
            <div className={`${styles.dropdown_container} ${isFilterDropdownOpen ? styles.open : styles.closed} flex flex-col`}>
                {/* CATEGORIES FILTER SECTION */}
                <span >Selectează categoriile:</span>
                <div className={`${styles.dropdown_container__categories_main_container} flex justify-between`}>
                    <div className={`${styles.dropdown_container__categories_container} grid grid-cols-3 grid-rows-3`} onClick={(e) => e.stopPropagation()}>

                        {categories.map(category => {
                            return (
                                <div key={category.id} className={`${styles.checkbox_wrapper}`}>
                                    <input
                                        type="checkbox"
                                        id={`category_${category.id}`}
                                        value={category.name}
                                        checked={localFilters.category?.includes(category.id) ?? false}
                                        onChange={() => handleCategoryChange(category.id)}
                                        className={`${styles.custom_checkbox}`}
                                    />
                                    <label htmlFor={`category_${category.id}`}>{category.name}</label>
                                </div>
                            )
                        })}

                    </div>
                    <ResetFilterBtn resetFunc={() => setLocalFilters(prev => {
                        return { ...prev, category: [] };
                    })} />
                </div>


                {/* LOCATION FILTER SECTION */}
                <div className={`${styles.filter_container__main_location_container} flex justify-between`}>
                    <div className={`${styles.filter_container__county_main_container}flex flex-col`}>
                        <div
                            className={`${styles.filter_container__dropdown_location_container} flex justify-between items-center`}
                            onClick={() => {
                                setIsCountyDropdownOpen((prev) => !prev)
                            }}
                            style={{ backgroundColor: selectedCounty ? 'rgba(255,255,255, 0.7)' : 'rgba(var(--color-grey-rgb), .25)' }}
                        >
                            <span>{selectedCounty ? `${selectedCounty.charAt(0).toUpperCase()}${selectedCounty.slice(1).toLowerCase()}` : 'Selectează judetul'}</span>
                            {isCountyDropdownOpen ? <ChevronUp /> : <ChevronDown />}
                        </div>

                        {isCountyDropdownOpen && <div
                            className={`${styles.dropdown_container__counties_container}  ${styles.check_container} flex flex-col `}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {counties.map((item) => {
                                return (
                                    <div
                                        key={item}
                                        className={styles.radio_wrapper}
                                        onClick={() => {
                                            setSelectedCity('');
                                            setSelectedCounty(item);
                                            setIsCountyDropdownOpen((prev) => !prev)
                                        }}
                                    >
                                        <span>{item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}</span>
                                    </div>
                                );
                            })}
                        </div>}
                    </div>
                    <div
                        className={`${styles.filter_container__city_main_container}flex flex-col`}
                    >
                        <div
                            className={`${styles.filter_container__dropdown_location_container} flex justify-between`}
                            onClick={() => {
                                setIsCityDropdownOpen((prev) => !prev)
                            }}
                            style={{ backgroundColor: selectedCity ? 'rgba(255,255,255, 0.7)' : 'rgba(var(--color-grey-rgb), .25)' }}
                        >
                            <span>{selectedCity ? `${selectedCity.charAt(0).toUpperCase()}${selectedCity.slice(1).toLowerCase()}` : 'Selectează localitatea'}</span>
                            {isCityDropdownOpen ? <ChevronUp /> : <ChevronDown />}
                        </div>

                        {isCityDropdownOpen && <div
                            className={`${styles.dropdown_container__counties_container} ${styles.check_container} flex flex-col`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {selectedCounty ? localities.map((item) => {
                                return (
                                    <div
                                        key={item}
                                        className={styles.radio_wrapper}
                                        onClick={() => {
                                            setSelectedCity(item);
                                            setIsCityDropdownOpen((prev) => !prev)
                                            setLocalFilters(prev => {
                                                return { ...prev, location: { county: selectedCounty, city: item } };
                                            })
                                        }}
                                    >
                                        <span>{item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}</span>
                                    </div>
                                );
                            }) : <span>Selectează judetul.</span>}
                        </div>}
                    </div>
                    <ResetFilterBtn resetFunc={() => {
                        setSelectedCity('');
                        setSelectedCounty('');
                    }} />
                </div>

                {localFilters.priceMax !== undefined && <div className={`${styles.dropdown_container__price_container} flex justify-between items-center`}>
                    <div className='flex items-center' style={{ gap: '0.5rem', marginRight: '2rem' }}>
                        <span>Limită preț</span>
                        <span className={`${styles.filter_container__price_selection} flex items-center justify-center`}>{selectedPrice} lei</span>
                    </div>

                    <div className='flex items-center'>
                        <span className='flex items-center' style={{ width: '3rem', paddingRight: '0.5rem' }}>0 lei</span>

                        <input
                            type="range"
                            min={0}
                            max={maxPrice}
                            step={.5}
                            value={selectedPrice}
                            onChange={(e) => {
                                setSelectedPrice(Number(e.target.value))
                                setLocalFilters(prev => {
                                    return { ...prev, priceMax: Number(e.target.value) };
                                })
                            }}
                            style={{
                                background: `linear-gradient(to right, rgba(var(--color-primary-rgb), 0.5) 0%, rgba(var(--color-secondary-rgb), 0.5) ${(selectedPrice / maxPrice) * 100}%, rgba(var(--color-grey-rgb), 0.3) ${(selectedPrice / maxPrice) * 100}%, rgba(var(--color-grey-rgb), 0.3) 100%)`
                            }}
                        />

                        <span className='flex items-center' style={{ width: '3rem', paddingLeft: '0.5rem' }}>{maxPrice} lei</span>

                    </div>
                    <ResetFilterBtn resetFunc={() => setFilters(prev => {
                        setSelectedPrice(maxPrice)
                        return { ...prev, priceMax: maxPrice };
                    })} />
                </div>}
                <div className={`${styles.dropdown_container__pick_date_container} flex justify-between`}>

                    <div className={`${styles.dropdown_container__date_time_field} flex`}>
                        <label>Valabil până la</label>
                        <div className='flex flex-col' style={{ gap: '0.5rem' }}>
                            <input
                                type="date"
                                className={styles.dropdown_container__date_time_input}
                                value={toDate}
                                onChange={(e) => {
                                    setToDate(e.target.value);
                                    setLocalFilters(prev => ({
                                        ...prev,
                                        availableUntil: e.target.value
                                            ? `${e.target.value}T${toTime || '23:59'}`
                                            : undefined
                                    }));
                                }}
                            />

                            <input
                                type="time"
                                className={styles.dropdown_container__date_time_input}
                                value={toTime}
                                onChange={(e) => {
                                    setToTime(e.target.value);
                                    setLocalFilters(prev => ({
                                        ...prev,
                                        availableUntil: toDate
                                            ? `${toDate}T${e.target.value}`
                                            : undefined
                                    }));
                                }}
                            />

                        </div>
                    </div>
                    <ResetFilterBtn
                        resetFunc={() => {
                            setToDate('');
                            setToTime('');
                            setLocalFilters(prev => ({ ...prev, availableUntil: undefined }));
                        }}
                    />
                </div>
                <div className={`${styles.dropdown_container__quantity_container} flex justify-between`}>
                    <div>
                        <span>Cantitate minimă</span>
                        <input
                            type="number"
                            value={localFilters.minQuantity}
                            min={1}
                            onChange={(e) => setLocalFilters(prev => {
                                return { ...prev, minQuantity: (Number(e.target.value)) };
                            })}

                        />
                    </div>
                    <ResetFilterBtn resetFunc={() => setLocalFilters(prev => {
                        return { ...prev, minQuantity: 1 };
                    })} />
                </div>
                <div className={`${styles.dropdown_container__filter_button_container} flex justify-between`}>
                    <button
                        onClick={() => {
                            setFilters(getInitialFilters(maxPrice));
                            setLocalFilters(getInitialFilters(maxPrice));
                            setSelectedPrice(maxPrice);
                            setIsFilterDropdownOpen(false);
                        }}
                        className={`${styles.dropdown_container__cancel_filter_button} flex justify-between items-center`}
                    >
                        <X />
                        <span>
                            Renunță
                        </span>
                    </button>
                    <button
                        onClick={() => {
                            setFilters(localFilters);
                            setIsFilterDropdownOpen(false);
                        }}
                        className={`${styles.dropdown_container__filter_button} flex justify-between items-center`}
                    >
                        <SlidersHorizontal />
                        <span>Filtrează</span>
                    </button>
                </div>


            </div>
        </div >
    )
}

export default FilterNavbar