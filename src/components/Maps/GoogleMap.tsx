import React from "react";
import { GoogleMap as GMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";
import type { TechnicianLocation } from "../../types/track.types";

interface Props {
    technicians: TechnicianLocation[];
    selectedTechnician?: TechnicianLocation | null;
    path?: { lat: number; lng: number }[];
    onTechnicianClick?: (tech: TechnicianLocation) => void;
    height?: string;
    className?: string;
}

const GoogleMap: React.FC<Props> = ({ technicians, selectedTechnician, path = [], onTechnicianClick, height = "500px", className }) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY as string,
    });


    if (!isLoaded) return <p>Loading Map...</p>;

    const center = selectedTechnician
        ? { lat: selectedTechnician.lat, lng: selectedTechnician.lng }
        : technicians[0]
            ? { lat: technicians[0].lat, lng: technicians[0].lng }
            : { lat: 7.8731, lng: 80.7718 };

    return (
        <GMap mapContainerStyle={{ width: "100%", height }} zoom={12} center={center} className={className}>
            {technicians.map((tech) => (
                <Marker
                    key={tech.technician_id}
                    position={{ lat: tech.lat, lng: tech.lng }}
                    onClick={() => onTechnicianClick?.(tech)}
                    label={tech.technician_name}
                />
            ))}
            {path.length > 0 && <Polyline path={path} options={{ strokeColor: "#2563eb", strokeWeight: 4 }} />}
        </GMap>
    );
};

export default GoogleMap;
