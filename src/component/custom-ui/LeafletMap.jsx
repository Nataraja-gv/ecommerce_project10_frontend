"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export default function LeafletMap({
  center,
  selectedLocation,
  setSelectedLocation,
  fetchAddressFromLatLng,
}) {
  const LocationSelector = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setSelectedLocation([lat, lng]);
        fetchAddressFromLatLng(lat, lng);
      },
    });

    return selectedLocation ? (
      <Marker
        position={selectedLocation}
        draggable
        eventHandlers={{
          dragend: (e) => {
            const { lat, lng } = e.target.getLatLng();
            setSelectedLocation([lat, lng]);
            fetchAddressFromLatLng(lat, lng);
          },
        }}
      />
    ) : null;
  };

  return (
    <MapContainer
      center={selectedLocation || center}
      zoom={16}
      style={{ height: "260px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationSelector />
    </MapContainer>
  );
}
