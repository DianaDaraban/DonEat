import { createContext, useContext } from "react";

export interface DashboardStats {
    totalOrders?: number;
    productsCount?: number;
    sales?: number;
    store: {
        id: number;
        name: string;
        logo: string;
        description: string;
    } | null;
}

interface DashboardStatsContextType {
    stats: DashboardStats;
    setStats: React.Dispatch<React.SetStateAction<DashboardStats>>;
    refreshDashboardStats: () => Promise<void>;
}

export const DashboardStatsContext = createContext<DashboardStatsContextType | null>(null)

export const useDashboardStats = () => {
    const context = useContext(DashboardStatsContext)
    if (!context) throw new Error('useDashboardStats must be used within a DashboardProvider')

    return context
}
