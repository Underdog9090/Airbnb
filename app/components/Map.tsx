"use client";

import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap, useMapEvent, } from "react-leaflet";
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
  center?:L.LatLngExpression
  position?: L.LatLngExpression
  setPosition: (position: L.LatLngExpression) => void
}


const Map:React.FC<MapProps>= ({
  center,
  position,
  setPosition
}) => { 
    position = position || center;
    return (
    <MapContainer
    center={center ||  [51, -0.09]}
    zoom={center ? 10 : 1}
    scrollWheelZoom={false}
    className="h-[35vh] rounded-lg"
    
    >

    <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {position && ( <MapMarker position={position} setPosition={setPosition} />)}
    </MapContainer>
    


    );
};

const MapMarker:React.FC<{position: L.LatLngExpression, setPosition: (value: L.LatLngExpression) => void}> = ({position, setPosition}) => {
  useMapEvent("click", (e) => {
    console.log(e.latlng);
    setPosition([e.latlng.lat, e.latlng.lng]);
  });

  return (
    <Marker position={position} />
  )
}

export default Map;