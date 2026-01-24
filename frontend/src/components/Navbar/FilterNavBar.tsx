import styles from './Navbar.module.css'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { ProductFilters } from '../../types/productFilters.ts'
import { Category } from '../../types/Category.ts'

type FilterProps = {
    filters: ProductFilters;
    setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
    categories: Category[];
};

function FilterNavbar({ filters, setFilters, categories }: FilterProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)


    const handleCategoryChange = (categoryId: number) => {
        setFilters(prev => {
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
            <div className={`${styles.filter_dropdown_container} flex justify-between`} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <span>
                    Categorie
                    {filters.category && filters.category.length > 0 && (
                        <div className={styles.filter_count}>
                            {filters.category.length}
                        </div>
                    )}
                </span>
                {isDropdownOpen ? <ChevronUp className={`${styles.dropdown_icon}`} /> : <ChevronDown className={`${styles.dropdown_icon}`} />}
            </div>
            {/* Dropdown checkbox container */}
            {
                isDropdownOpen &&
                <div className={`${styles.check_container} flex flex-col`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {categories.map(category => {
                        return (
                            <div key={category.id} className={`${styles.checkbox_wrapper}`}>
                                <input
                                    type="checkbox"
                                    id={`category_${category.id}`}
                                    value={category.name}
                                    checked={filters.category?.includes(category.id) ?? false}
                                    onChange={() => handleCategoryChange(category.id)}
                                    className={`${styles.custom_checkbox}`}
                                />
                                <label htmlFor={`category_${category.id}`}>{category.name}</label>
                            </div>
                        )
                    })}

                </div>
            }
        </div >
    )
}

export default FilterNavbar