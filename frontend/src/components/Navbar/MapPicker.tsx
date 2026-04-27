import { useState, useEffect } from "react";
import styles from './../../pages/navbar/Navbar.module.scss'
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
    Circle,
    useMap
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { ProductPublic } from "../../types/Product.ts";
import { useNavigate } from "react-router-dom";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const userLocationIcon = L.divIcon({
    className: "",
    html: `
        <div style="
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #e63946;
            border: 3px solid white;
            box-shadow: 0 0 0 5px rgba(230, 57, 70, 0.25);
        "></div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
});

const MapContainerAny = MapContainer as any;
const TileLayerAny = TileLayer as any;
const PopupAny = Popup as any;
const CircleAny = Circle as any;
const MarkerAny = Marker as any;

type MapProps = {
    initialLat?: number;
    initialLng?: number;
    radius?: number;
    products: ProductPublic[];
    onCloseMap: () => void;
    onChange: (lat: number, lng: number) => void;
};

function MapClickHandler({
    setPosition,
    onChange,
}: {
    setPosition: React.Dispatch<React.SetStateAction<[number, number]>>;
    onChange: (lat: number, lng: number) => void;
}) {
    useMapEvents({
        click(e: any) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            onChange(lat, lng);
        },
    });

    return null;
}


function StorePopupContent({
    product,
    products,
    onCloseMap,
}: {
    product: ProductPublic;
    products: ProductPublic[];
    onCloseMap: () => void;
}) {
    const navigate = useNavigate();

    const count = products.reduce((acc, elem) => {
        return elem.owner === product.owner ? acc + 1 : acc;
    }, 0);

    return (
        <div className={styles.popup}>
            <div className={styles.popup_header}>
                <span>{product.store_name}</span>
            </div>

            <div className={styles.popup_body}>
                <span className={styles.popup_body__count}>
                    {count}
                </span>
                <span> produse disponibile</span>
            </div>

            <button
                className={styles.popup_button}
                onClick={() => {
                    onCloseMap();
                    navigate(`/store/${product.owner}`)
                }}
            >
                Vezi produsele →
            </button>
        </div>
    );
}

function MapPicker({
    initialLat = 44.429588,
    initialLng = 26.103854,
    products,
    onChange,
    radius,
    onCloseMap
}: MapProps) {

    const [position, setPosition] = useState<[number, number]>([
        initialLat,
        initialLng,
    ]);

    useEffect(() => {
        setPosition([initialLat, initialLng]);
    }, [initialLat, initialLng]);


    const uniqueStores = Array.from(
        new Map(
            products
                .filter(p => p.store_latitude && p.store_longitude)
                .map(p => [
                    `${p.store_latitude}-${p.store_longitude}`,
                    p
                ])
        ).values()
    );


    return (
        <div style={{ width: "100%", height: "360px" }}>
            <MapContainerAny
                center={position}
                zoom={13}
                style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "1rem",
                }}
            >
                <TileLayerAny
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <RecenterMap position={position} />

                <MarkerAny
                    position={position}
                    radius={8}
                    icon={userLocationIcon}
                    draggable={true}
                    eventHandlers={{
                        dragend: (e: any) => {
                            const marker = e.target;
                            const latlng = marker.getLatLng();

                            setPosition([latlng.lat, latlng.lng]);
                            onChange(latlng.lat, latlng.lng);
                        },
                    }}
                />

                {radius && (
                    <CircleAny
                        center={position}
                        radius={radius * 1000}
                    />
                )}

                {uniqueStores.map(product => (
                    <MarkerAny
                        radius={8}
                        key={`${product.store_latitude}-${product.store_longitude}`}
                        position={[
                            Number(product.store_latitude),
                            Number(product.store_longitude),
                        ]}
                    >
                        <PopupAny>
                            <StorePopupContent product={product} products={products} onCloseMap={onCloseMap} />
                        </PopupAny>
                    </MarkerAny>
                ))}

                <MapClickHandler setPosition={setPosition} onChange={onChange} />
            </MapContainerAny>
        </div>
    );
}

function RecenterMap({ position }: { position: [number, number] }) {
    const map = useMap();

    useEffect(() => {
        map.setView(position, map.getZoom());
    }, [map, position]);

    return null;
}

export default MapPicker;