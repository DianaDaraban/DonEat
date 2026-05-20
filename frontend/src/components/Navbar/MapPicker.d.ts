import "leaflet/dist/leaflet.css";
import { ProductPublic } from "../../types/Product.ts";
type MapProps = {
    initialLat?: number;
    initialLng?: number;
    radius?: number;
    products: ProductPublic[];
    onCloseMap: () => void;
    onChange: (lat: number, lng: number) => void;
};
declare function MapPicker({ initialLat, initialLng, products, onChange, radius, onCloseMap }: MapProps): import("react").JSX.Element;
export default MapPicker;
//# sourceMappingURL=MapPicker.d.ts.map