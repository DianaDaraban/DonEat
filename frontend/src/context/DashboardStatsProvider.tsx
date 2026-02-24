import { useState, ReactNode } from "react"
import { DashboardStats } from "./DashboardStatsContext.tsx"
import { DashboardStatsContext } from "./DashboardStatsContext.tsx"
import api from "../api.ts"

export const DashboardStatsProvider = ({ children }: { children: ReactNode }) => {
    const [stats, setStats] = useState<DashboardStats>({
        totalOrders: 0,
        productsCount: 0,
        sales: 0,
        store: null
    })

    const refreshDashboardStats = async () => {
        try {
            const res = await api.get("/api/vendor/dashboard/");
            console.log(res)
            setStats(prev => ({
                ...prev,
                totalOrders: res.data.total_orders,
                sales: res.data.total_sales,
                store: res.data.store ?? null,
            }));

            if (res.data.store === undefined) {
                const storeRes = await api.get("/api/accounts/store/me/");
                console.log(storeRes)
                setStats(prev => ({ ...prev, store: storeRes.data }));
            }

        } catch (error) {
            console.error("Eroare la refresh stats:", error);
        }
    };

    return (
        <DashboardStatsContext.Provider value={{ stats, setStats, refreshDashboardStats }}>
            {children}
        </DashboardStatsContext.Provider>
    )
}