import React, { useRef, useEffect, useState } from 'react';
import { GoogleMap as GMap, Marker, Polyline, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api';
import { TechnicianLocation } from '../../types/technicianTrack.types';

interface Props {
    technicians: {
        technician_id: string;
        technician_name: string;
        lat: number;
        lng: number;
        status: string;
        is_online: boolean;
    }[];
    path?: { lat: number; lng: number }[];
    height?: string;
    className?: string;
}


const GoogleMap: React.FC<Props> = ({ technicians, path = [], height = '500px', className }) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY as string,
    });
    const mapRef = useRef<google.maps.Map | null>(null);
    const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
    const [showDirections, setShowDirections] = useState(false);

    const mapStyles = [
        {
            featureType: 'administrative',
            elementType: 'geometry',
            stylers: [{ visibility: 'off' }],
        },
        {
            featureType: 'poi',
            stylers: [{ visibility: 'off' }],
        },
        {
            featureType: 'road',
            elementType: 'labels.icon',
            stylers: [{ visibility: 'off' }],
        },
        {
            featureType: 'transit',
            stylers: [{ visibility: 'off' }],
        },
    ];

    const mapOptions = {
        styles: mapStyles,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        gestureHandling: 'greedy' as const,
        mapTypeId: 'roadmap' as const,
    };

    useEffect(() => {
        if (mapRef.current && path.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            path.forEach((p) => bounds.extend(p));
            setTimeout(() => {
                mapRef.current?.fitBounds(bounds, {
                    top: 50,
                    bottom: 50,
                    left: 50,
                    right: 50,
                });
            }, 300);
        }
    }, [path]);

    const calculateDirections = async () => {
        if (!window.google || path.length < 2) return;

        const directionsService = new window.google.maps.DirectionsService();

        try {
            const waypoints = path.slice(1, -1).map((point) => ({
                location: new window.google.maps.LatLng(point.lat, point.lng),
                stopover: false,
            }));
            const limitedWaypoints = waypoints.length > 23 ? waypoints.filter((_, index) => index % Math.ceil(waypoints.length / 23) === 0).slice(0, 23) : waypoints;
            const result = await directionsService.route({
                origin: new window.google.maps.LatLng(path[0].lat, path[0].lng),
                destination: new window.google.maps.LatLng(path[path.length - 1].lat, path[path.length - 1].lng),
                waypoints: limitedWaypoints,
                travelMode: window.google.maps.TravelMode.DRIVING,
                optimizeWaypoints: false,
                avoidHighways: false,
                avoidTolls: false,
            });

            setDirectionsResponse(result);
            setShowDirections(true);
        } catch (error) {
            console.warn('Could not calculate directions, falling back to polyline:', error);
            setShowDirections(false);
        }
    };
    useEffect(() => {
        if (path.length > 1) {
            calculateDirections();
        }
    }, [path]);

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center bg-gray-100 rounded" style={{ height }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading map...</p>
                </div>
            </div>
        );
    }

    const defaultCenter = path.length > 0 ? path[0] : { lat: 6.9271, lng: 79.8612 };

    return (
        <div className="relative">
            <GMap
                mapContainerStyle={{ width: '100%', height }}
                zoom={15}
                center={defaultCenter}
                onLoad={(map) => {
                    mapRef.current = map;
                }}
                mapContainerClassName={className}
                options={mapOptions}
            >
                {technicians.map((tech) => (
                    <Marker
                        key={tech.technician_id}
                        position={{ lat: tech.lat, lng: tech.lng }}
                        icon={{
                            url:
                                'data:image/svg+xml;charset=UTF-8,' +
                                encodeURIComponent(`
                                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="16" cy="16" r="12" fill="#3B82F6" stroke="white" stroke-width="3"/>
                                    <circle cx="16" cy="16" r="4" fill="white"/>
                                </svg>
                            `),
                            scaledSize: new window.google.maps.Size(32, 32),
                            anchor: new window.google.maps.Point(16, 16),
                        }}
                        title={`${tech.technician_name} - Current Location`}
                        zIndex={1000}
                    />
                ))}

                {path.length > 0 && (
                    <Marker
                        position={path[0]}
                        icon={{
                            url:
                                'data:image/svg+xml;charset=UTF-8,' +
                                encodeURIComponent(`
                                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="20" cy="20" r="16" fill="#10B981" stroke="white" stroke-width="3"/>
                                    <text x="20" y="26" font-family="Arial" font-size="14" fill="white" text-anchor="middle" font-weight="bold">S</text>
                                </svg>
                            `),
                            scaledSize: new window.google.maps.Size(40, 40),
                            anchor: new window.google.maps.Point(20, 20),
                        }}
                        title="Start Point"
                        zIndex={999}
                    />
                )}

                {path.length > 1 && (
                    <Marker
                        position={path[path.length - 1]}
                        icon={{
                            url:
                                'data:image/svg+xml;charset=UTF-8,' +
                                encodeURIComponent(`
                                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="20" cy="20" r="16" fill="#EF4444" stroke="white" stroke-width="3"/>
                                    <text x="20" y="26" font-family="Arial" font-size="14" fill="white" text-anchor="middle" font-weight="bold">E</text>
                                </svg>
                            `),
                            scaledSize: new window.google.maps.Size(40, 40),
                            anchor: new window.google.maps.Point(20, 20),
                        }}
                        title="End Point / Current Position"
                        zIndex={998}
                    />
                )}

                {path.length > 2 &&
                    path.slice(1, -1).map((point, index) => {
                        if (index % 3 !== 0) return null;

                        return (
                            <Marker
                                key={`waypoint-${index}`}
                                position={point}
                                icon={{
                                    url:
                                        'data:image/svg+xml;charset=UTF-8,' +
                                        encodeURIComponent(`
                                    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="8" cy="8" r="6" fill="#6B7280" stroke="white" stroke-width="2"/>
                                        <circle cx="8" cy="8" r="2" fill="white"/>
                                    </svg>
                                `),
                                    scaledSize: new window.google.maps.Size(16, 16),
                                    anchor: new window.google.maps.Point(8, 8),
                                }}
                                zIndex={500}
                            />
                        );
                    })}
                {showDirections && directionsResponse ? (
                    <DirectionsRenderer
                        directions={directionsResponse}
                        options={{
                            suppressMarkers: true,
                            polylineOptions: {
                                strokeColor: '#3B82F6',
                                strokeOpacity: 0.8,
                                strokeWeight: 6,
                                zIndex: 100,
                            },
                        }}
                    />
                ) : (
                    path.length > 1 && (
                        <Polyline
                            path={path}
                            options={{
                                strokeColor: '#3B82F6',
                                strokeOpacity: 0.8,
                                strokeWeight: 4,
                                zIndex: 100,
                                icons: [
                                    {
                                        icon: {
                                            path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                                            scale: 3,
                                            strokeColor: '#3B82F6',
                                            fillColor: '#3B82F6',
                                            fillOpacity: 1,
                                        },
                                        offset: '100%',
                                        repeat: '20px',
                                    },
                                ],
                            }}
                        />
                    )
                )}
            </GMap>

            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 space-y-2">
                <button
                    onClick={() => {
                        if (mapRef.current && path.length > 0) {
                            const bounds = new window.google.maps.LatLngBounds();
                            path.forEach((p) => bounds.extend(p));
                            mapRef.current.fitBounds(bounds);
                        }
                    }}
                    className="w-full px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    title="Fit to route"
                >
                    Fit Route
                </button>

                <button
                    onClick={() => setShowDirections(!showDirections)}
                    className={`w-full px-3 py-1 text-xs rounded transition-colors ${showDirections ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    title={showDirections ? 'Show GPS path' : 'Show road directions'}
                >
                    {showDirections ? 'GPS Path' : 'Roads'}
                </button>
            </div>

            {path.length > 0 && (
                <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
                    <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-gray-600">Start</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-600">Current</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-gray-600">End</span>
                        </div>
                        <div className="text-gray-500">{path.length} points tracked</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GoogleMap;
