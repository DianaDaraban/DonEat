export interface ProductFilters {
    category?: number[];
    priceMax?: number;
    minQuantity?: number;
    availableUntil?: string;
    location?: object;
    maxDistanceKm?: number;
    search?: string;
}