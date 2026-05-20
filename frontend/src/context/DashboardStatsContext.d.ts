export interface DashboardStats {
    totalOrders?: number;
    productsCount?: number;
    sales?: number;
    store: {
        id: number;
        name: string;
        logo: string;
        description: string;
        latitude: number;
        longitude: number;
    } | null;
}
interface DashboardStatsContextType {
    stats: DashboardStats;
    setStats: React.Dispatch<React.SetStateAction<DashboardStats>>;
    refreshDashboardStats: () => Promise<void>;
}
export declare const DashboardStatsContext: import("react").Context<DashboardStatsContextType | null>;
export declare const useDashboardStats: () => DashboardStatsContextType;
export {};
//# sourceMappingURL=DashboardStatsContext.d.ts.map