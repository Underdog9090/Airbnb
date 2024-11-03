"use client";

import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMapEvent, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

//@ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x.src,
    iconUrl: markerIcon.src,
    shadowUrl: markerShadow.src,
});

interface MapProps {
    center?: L.LatLngExpression;
    position?: L.LatLngExpression;
    setPosition: (position: L.LatLngExpression) => void;
}

const Map: React.FC<MapProps> = ({
    center,
    position,
    setPosition,
}) => {
    const effectivePosition = position || center || [51, -0.09];

    return (
        <MapContainer
            center={center || effectivePosition}
            zoom={center ? 10 : 1}
            scrollWheelZoom={false}
            className="h-[35vh] rounded-lg"
        >
            {/* This component updates the map's view when center changes */}
            {center && <MapCenter center={center} />}

            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {effectivePosition && (
                <MapMarker position={effectivePosition} setPosition={setPosition} />
            )}
        </MapContainer>
    );
};

// Component to center the map on new coordinates
const MapCenter: React.FC<{ center: L.LatLngExpression }> = ({ center }) => {
    const map = useMap();
    map.setView(center);  // Update map view to the center location
    return null;
};

const MapMarker: React.FC<{ position: L.LatLngExpression; setPosition: (value: L.LatLngExpression) => void; }> = ({ position, setPosition }) => {
    useMapEvent("click", (e) => {
        console.log(e.latlng);
        setPosition([e.latlng.lat, e.latlng.lng]);
    });

    return (
        <Marker position={position} />
    );
};

export default Map;
