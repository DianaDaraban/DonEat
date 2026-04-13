import { useAuth } from "../../context/useAuth.ts";
import { useDashboardTab } from '../../context/DashboardTabContext.tsx'
import { LayoutDashboard, PackagePlus, Boxes, ScanBarcode, UserRoundPen, Settings2, Bell } from 'lucide-react'
import OverviewTab from "../../components/Dashboard/Tabs/OverviewTab.tsx";
import AddProductTab from "../../components/Dashboard/Tabs/AddProductTab.tsx";
import MyProductsTab from "../../components/Dashboard/Tabs/MyProductsTab.tsx";
import OrdersTab from "../../components/Dashboard/Tabs/OrdersTab.tsx";
import SettingsTab from "../../components/Dashboard/Tabs/SettingsTab.tsx";
import ProfileTab from "../../components/Dashboard/Tabs/ProfileTab.tsx";
import NotificationsTab from '../../components/Dashboard/Tabs/NotificationsTab.tsx'

import styles from "./Dashboard.module.scss";
import { DashboardStatsProvider } from "../../context/DashboardStatsProvider.tsx";
import AnimatedBackground from "../../styles/animatedBackground/AnimatedBackground.tsx";

function Dashboard() {
    const { user } = useAuth();
    const { activeTab, setActiveTab } = useDashboardTab();

    const TABS_BY_ROLE: Record<
        string,
        { label: string; component: React.ReactNode; icon: React.ReactNode }[]
    > = {
        vendor: [
            {
                label: "Rezumat",
                component: <OverviewTab />,
                icon: <LayoutDashboard color='var(--color-primary)' size={20} />
            },
            {
                label: "Adaugă produs",
                component: <AddProductTab />,
                icon: <PackagePlus color='var(--color-primary)' size={20} />
            },
            {
                label: "Produsele mele",
                component: <MyProductsTab />,
                icon: <Boxes color='var(--color-primary)' size={20} />
            },
            {
                label: "Comenzi",
                component: <OrdersTab />,
                icon: <ScanBarcode color='var(--color-primary)' size={20} />
            },
            {
                label: "Profilul meu",
                component: <ProfileTab />,
                icon: <UserRoundPen color='var(--color-primary)' size={20} />
            },
            {
                label: "Notificări",
                component: <NotificationsTab />,
                icon: <Bell color='var(--color-primary)' size={20} />
            },
            {
                label: "Setări",
                component: <SettingsTab />,
                icon: <Settings2 color='var(--color-primary)' size={20} />
            },
        ],
        buyer: [
            {
                label: "Profilul meu",
                component: <ProfileTab />,
                icon: <UserRoundPen color='var(--color-primary)' size={20} />
            },
            {
                label: "Comenzile mele",
                component: <OrdersTab />,
                icon: <ScanBarcode color='var(--color-primary)' size={20} />
            },
            {
                label: "Notificări",
                component: <NotificationsTab />,
                icon: <Bell color='var(--color-primary)' size={20} />
            },
            {
                label: "Setări",
                component: <SettingsTab />,
                icon: <Settings2 color='var(--color-primary)' size={20} />
            },
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
                            <span>{tab.icon} </span>
                            <span>{tab.label}</span>
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
