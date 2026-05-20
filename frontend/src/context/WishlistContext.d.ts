interface WishlistContextType {
    wishlist: number[];
    toggleWishlist: (productId: number) => Promise<void>;
    loading: boolean;
}
export declare const WishlistContext: import("react").Context<WishlistContextType | null>;
export declare const useWishlist: () => WishlistContextType;
export {};
//# sourceMappingURL=WishlistContext.d.ts.map