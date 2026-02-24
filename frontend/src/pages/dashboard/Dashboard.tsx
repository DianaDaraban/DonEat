import { useAuth } from "../../context/useAuth.ts";
import { useDashboardTab } from '../../context/DashboardTabContext.tsx'

import OverviewTab from "../../components/Dashboard/Tabs/OverviewTab.tsx";
import AddProductTab from "../../components/Dashboard/Tabs/AddProductTab.tsx";
import MyProductsTab from "../../components/Dashboard/Tabs/MyProductsTab.tsx";
import OrdersTab from "../../components/Dashboard/Tabs/OrdersTab.tsx";
import SettingsTab from "../../components/Dashboard/Tabs/SettingsTab.tsx";
import ProfileTab from "../../components/Dashboard/Tabs/ProfileTab.tsx";

import styles from "./Dashboard.module.scss";
import { DashboardStatsProvider } from "../../context/DashboardStatsProvider.tsx";

function Dashboard() {
    const { user } = useAuth();
    const { activeTab, setActiveTab } = useDashboardTab();

    const TABS_BY_ROLE: Record<
        string,
        { label: string; component: React.ReactNode }[]
    > = {
        vendor: [
            { label: "Rezumat", component: <OverviewTab /> },
            { label: "Adaugă produs", component: <AddProductTab /> },
            { label: "Produsele mele", component: <MyProductsTab /> },
            { label: "Comenzi", component: <OrdersTab /> },
            { label: "Profilul meu", component: <ProfileTab /> },
            { label: "Setări", component: <SettingsTab /> },
        ],
        buyer: [
            { label: "Profilul meu", component: <ProfileTab /> },
            { label: "Comenzile mele", component: <OrdersTab /> },
            { label: "Setări", component: <SettingsTab /> },
        ],
    };

    const roleTabs =
        user?.role === "vendor"
            ? TABS_BY_ROLE.vendor
            : TABS_BY_ROLE.buyer;

    const currentTab = roleTabs.find((tab) => tab.label === activeTab) || roleTabs[0];

    return (
        <DashboardStatsProvider>
            <div className={`${styles.dashboard} flex`}>
                {/* Sidebar */}
                <aside className={`${styles.sidebar} flex flex-col gap-2`}>
                    <h2 className={styles.sidebar__title}>Panou de control</h2>

                    {roleTabs.map((tab) => (
                        <button
                            key={tab.label}
                            className={`${styles.sidebar__btn} ${activeTab === tab.label
                                ? styles["sidebar__btn--active"]
                                : ""
                                }`}
                            onClick={() => setActiveTab(tab.label)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </aside>

                {/* Content */}
                <main className={`${styles.content} flex-1`}>
                    <div className={styles.content__wrapper}>
                        {currentTab.component}
                    </div>
                </main>
            </div>
        </DashboardStatsProvider>
    );
}

export default Dashboard;
