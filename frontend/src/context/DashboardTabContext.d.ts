type DashboardTabContextType = {
    activeTab: string;
    setActiveTab: (tab: string) => void;
};
export declare const DashboardTabContext: import("react").Context<DashboardTabContextType | undefined>;
export declare const useDashboardTab: () => DashboardTabContextType;
export {};
//# sourceMappingURL=DashboardTabContext.d.ts.map