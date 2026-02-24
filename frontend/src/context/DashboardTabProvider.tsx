import { useAuth } from './useAuth.ts'
import { useState, ReactNode } from 'react'
import { DashboardTabContext } from './DashboardTabContext.tsx'


export const DashboardTabProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();

    const initialTab = user?.role === 'vendor' ? 'Rezumat' : 'Profilul meu';
    const [activeTab, setActiveTab] = useState<string>(initialTab || 'Profilul meu');

    return (
        <DashboardTabContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </DashboardTabContext.Provider>
    );
}