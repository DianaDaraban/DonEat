import { useState } from "react"
import OverviewTab from "../../components/Dashboard/Tabs/OverviewTab.tsx"
import AddProductTab from "../../components/Dashboard/Tabs/AddProductTab.tsx"
import MyProductsTab from "../../components/Dashboard/Tabs/MyProductsTab.tsx"
import OrdersTab from "../../components/Dashboard/Tabs/OrdersTab.tsx"
import VendorSettingsTab from "../../components/Dashboard/Tabs/VendorSettingsTab.tsx"
import styles from './Dashboard.module.scss'

const TABS = ['overview', 'add', 'products', 'orders', 'settings'] as const
type Tab = typeof TABS[number]


function Dashboard() {
    const [activeTab, setActiveTab] = useState<Tab>("overview")



    return (
        <div className={`${styles.dashboard} flex`}>
            <aside className={`${styles.sidebar} flex flex-col gap-2`}>
                <h2 className={styles.sidebar__title}>Dashboard</h2>

                <button
                    className={`${styles.sidebar__btn} ${activeTab === 'overview' ? styles['sidebar__btn--active'] : ''}`}
                    onClick={() => setActiveTab("overview")}
                >
                    Overview
                </button>

                <button
                    className={`${styles.sidebar__btn} ${activeTab === 'add' ? styles['sidebar__btn--active'] : ''}`}
                    onClick={() => setActiveTab("add")}
                >
                    Add product
                </button>

                <button
                    className={`${styles.sidebar__btn} ${activeTab === 'products' ? styles['sidebar__btn--active'] : ''}`}
                    onClick={() => setActiveTab("products")}
                >
                    My products
                </button>

                <button
                    className={`${styles.sidebar__btn} ${activeTab === 'orders' ? styles['sidebar__btn--active'] : ''}`}
                    onClick={() => setActiveTab("orders")}
                >
                    Orders
                </button>

                <button
                    className={`${styles.sidebar__btn} ${activeTab === 'settings' ? styles['sidebar__btn--active'] : ''}`}
                    onClick={() => setActiveTab("settings")}
                >
                    Settings
                </button>
            </aside>

            <main className={`${styles.content} flex-1`}>
                <div className={styles.content__wrapper}>
                    {activeTab === "overview" && <OverviewTab />}
                    {activeTab === "add" && <AddProductTab />}
                    {activeTab === "products" && <MyProductsTab />}
                    {activeTab === "orders" && <OrdersTab />}
                    {activeTab === "settings" && <VendorSettingsTab />}
                </div>
            </main>
        </div>
    )
}
export default Dashboard