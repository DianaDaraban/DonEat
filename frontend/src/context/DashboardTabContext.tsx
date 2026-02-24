import { createContext, useContext } from 'react'


type DashboardTabContextType = {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const DashboardTabContext = createContext<DashboardTabContextType | undefined>(undefined)



export const useDashboardTab = () => {
    const context = useContext(DashboardTabContext);
    if (!context) throw new Error('useDashboardTab must be used within DashboardTabProvider');
    return context;
}
