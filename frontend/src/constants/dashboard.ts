export const DASHBOARD_TABS = {
    vendor: ['Rezumat', 'Adaugă produs', 'Produsele mele', 'Comenzi', 'Profilul meu', 'Setări'],
    buyer: ['Profilul meu', 'Comenzile mele', 'Produse favorite', 'Setări'],
};

export function getInitialTab(role?: string) {
    if (role === 'vendor') return 'Rezumat';
    return 'Profilul meu';
}