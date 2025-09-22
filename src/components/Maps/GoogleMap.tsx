import React, { useEffect, useRef, useState } from 'react';
import type { TechnicianLocation } from '../../types/technicianTrack.types';

interface GoogleMapProps {
    technicians: TechnicianLocation[];
    selectedTechnician?: TechnicianLocation | null;
    onTechnicianClick?: (technician: TechnicianLocation) => void;
    height?: string;
    className?: string;
}

declare global {
    interface Window {
        google: any;
        initMap: () => void;
        gm_authFailure?: () => void;
    }
}

const GoogleMap: React.FC<GoogleMapProps> = ({
    technicians,
    selectedTechnician,
    onTechnicianClick,
    height = '400px',
    className = '',
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const infoWindowRef = useRef<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string>('');

    // Default center (Colombo, Sri Lanka)
    const defaultCenter = {
        lat: 6.9271,
        lng: 79.8612
    };

    const loadGoogleMaps = () => {

        // Check if Google Maps is already loaded
        if (window.google && window.google.maps && window.google.maps.Map) {
            setIsLoaded(true);
            return;
        }

        // Check if script is already being loaded or exists
        const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
        if (existingScript) {
            // Script already exists, wait for it to load
            const checkInterval = setInterval(() => {
                if (window.google && window.google.maps && window.google.maps.Map) {
                    setIsLoaded(true);
                    clearInterval(checkInterval);
                }
            }, 100);

            // Give up after 5 seconds and fallback
            setTimeout(() => {
                clearInterval(checkInterval);
                if (!isLoaded) {
                    setError('Google Maps API timed out - using static map');
                }
            }, 5000);
            return;
        }

        // Check if API key is available
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            setError('Google Maps API key not configured');
            return;
        }


        // Set up global error handler before loading
        if (!window.gm_authFailure) {
            window.gm_authFailure = () => {
                setError('Google Maps API authentication failed');
            };
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.id = 'google-maps-script';

        script.onload = () => {
            // Wait a moment for Google Maps to fully initialize
            setTimeout(() => {
                if (window.google && window.google.maps && window.google.maps.Map) {
                    setIsLoaded(true);
                } else {
                    setError('Google Maps API incomplete - using static map');
                }
            }, 500);
        };

        script.onerror = () => {
            setError('Google Maps script failed to load - using static map');
        };

        document.head.appendChild(script);
    };

    const initializeMap = () => {

        // Comprehensive validation before attempting initialization
        if (!window.google || !window.google.maps || !window.google.maps.Map) {
            setError('Google Maps API not properly loaded');
            return;
        }

        if (!mapRef.current) {
            return;
        }

        const element = mapRef.current;

        // Ensure the element is properly attached to DOM and has dimensions
        if (!(element instanceof HTMLElement) ||
            !element.isConnected ||
            element.offsetWidth === 0 ||
            element.offsetHeight === 0) {
            return;
        }

        // Test Google Maps API functionality before proceeding
        try {
            // Try creating a simple LatLng to test API availability
            const testLatLng = new window.google.maps.LatLng(6.9271, 79.8612);
        } catch (apiTest) {
            setError('Google Maps API test failed - using static map');
            return;
        }

        try {
            // Calculate center based on technicians or use default
            let center = defaultCenter;
            const validTechnicians = technicians.filter(tech =>
                tech && typeof tech.latitude === 'number' && typeof tech.longitude === 'number'
            );

            if (validTechnicians.length > 0) {
                try {
                    const bounds = new window.google.maps.LatLngBounds();
                    validTechnicians.forEach(tech => {
                        bounds.extend(new window.google.maps.LatLng(tech.latitude, tech.longitude));
                    });

                    if (!bounds.isEmpty()) {
                        const centerPoint = bounds.getCenter();
                        if (centerPoint && typeof centerPoint.lat === 'function' && typeof centerPoint.lng === 'function') {
                            center = { lat: centerPoint.lat(), lng: centerPoint.lng() };
                        }
                    }
                } catch (boundsError) {
                }
            }

            // Create map with error handling
            let map: any;

            try {
                map = new window.google.maps.Map(element, {
                    zoom: technicians.length > 0 ? 12 : 11,
                    center: center,
                    mapTypeId: window.google.maps.MapTypeId.ROADMAP,
                    mapTypeControl: true,
                    streetViewControl: true,
                    fullscreenControl: true,
                    zoomControl: true,
                    gestureHandling: 'auto',
                });
            } catch (mapCreationError: any) {
                if (mapCreationError.message && mapCreationError.message.includes('ApiNotActivatedMapError')) {
                    setError('Google Maps API not activated - using static map');
                } else {
                    setError('Failed to create map - using static map');
                }
                return;
            }

            mapInstanceRef.current = map;

            // Create info window
            try {
                infoWindowRef.current = new window.google.maps.InfoWindow();
            } catch (infoWindowError) {
            }

            // Wait for map to be fully ready before adding markers
            const setupMarkers = () => {
                try {
                    addMarkers();

                    // Auto-fit bounds if we have multiple technicians
                    if (validTechnicians.length > 1) {
                        try {
                            const bounds = new window.google.maps.LatLngBounds();
                            validTechnicians.forEach(tech => {
                                bounds.extend(new window.google.maps.LatLng(tech.latitude, tech.longitude));
                            });
                            map.fitBounds(bounds);
                        } catch (fitBoundsError) {
                        }
                    }
                } catch (markerError) {
                }
            };

            // Use multiple fallback methods to ensure markers are added when ready
            if (window.google.maps.event) {
                window.google.maps.event.addListenerOnce(map, 'idle', setupMarkers);
                // Also add with a timeout as fallback
                setTimeout(setupMarkers, 1000);
            } else {
                // Fallback if event system isn't available
                setTimeout(setupMarkers, 1500);
            }

        } catch (error) {
            setError('Failed to initialize map. The service may be temporarily unavailable.');
        }
    };

    const getMarkerIcon = (technician: TechnicianLocation) => {
        let color = '#6B7280'; // gray for offline
        if (technician.is_online) {
            switch (technician.status) {
                case 'active':
                    color = '#10B981'; // green
                    break;
                case 'idle':
                    color = '#F59E0B'; // yellow
                    break;
                default:
                    color = '#6B7280'; // gray
            }
        }

        return {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
            scale: 8,
        };
    };

    const addMarkers = () => {
        if (!mapInstanceRef.current || !window.google || !window.google.maps) {
            return;
        }

        try {
            // Clear existing markers
            markersRef.current.forEach(marker => {
                if (marker && typeof marker.setMap === 'function') {
                    marker.setMap(null);
                }
            });
            markersRef.current = [];

            const validTechniciansForMarkers = technicians.filter(tech =>
                tech && typeof tech.latitude === 'number' && typeof tech.longitude === 'number'
            );

            validTechniciansForMarkers.forEach(technician => {
                try {
                    const marker = new window.google.maps.Marker({
                        position: { lat: technician.latitude, lng: technician.longitude },
                        map: mapInstanceRef.current,
                        title: technician.technician_name,
                        icon: getMarkerIcon(technician),
                        animation: technician.id === selectedTechnician?.id ? window.google.maps.Animation.BOUNCE : null,
                    });

            // Create info window content
            const infoContent = `
                <div style="padding: 8px; max-width: 250px;">
                    <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1F2937;">${technician.technician_name}</h3>
                    <p style="margin: 4px 0; color: #6B7280; font-size: 14px;">${technician.email}</p>
                    ${technician.phone ? `<p style="margin: 4px 0; color: #6B7280; font-size: 14px;">${technician.phone}</p>` : ''}
                    <div style="margin: 8px 0;">
                        <span style="display: inline-block; padding: 2px 8px; background-color: ${technician.is_online
                            ? technician.status === 'active' ? '#D1FAE5' : '#FEF3C7'
                            : '#F3F4F6'}; color: ${technician.is_online
                            ? technician.status === 'active' ? '#065F46' : '#92400E'
                            : '#374151'}; border-radius: 12px; font-size: 12px; font-weight: 500;">
                            ${technician.is_online
                                ? technician.status === 'active' ? 'Active' : 'Idle'
                                : 'Offline'}
                        </span>
                    </div>
                    ${technician.current_ticket_id ? `
                        <div style="margin: 8px 0; padding: 8px; background-color: #EBF8FF; border-radius: 6px;">
                            <p style="margin: 0; font-size: 12px; color: #2563EB; font-weight: 500;">Current Ticket: #${technician.current_ticket_id}</p>
                            <p style="margin: 2px 0 0 0; font-size: 12px; color: #1E40AF;">${technician.current_ticket_title}</p>
                        </div>
                    ` : ''}
                    <p style="margin: 4px 0 0 0; font-size: 11px; color: #9CA3AF;">
                        Last updated: ${new Date(technician.last_updated).toLocaleString()}
                    </p>
                </div>
            `;

            // Add click listener
            marker.addListener('click', () => {
                infoWindowRef.current.setContent(infoContent);
                infoWindowRef.current.open(mapInstanceRef.current, marker);

                if (onTechnicianClick) {
                    onTechnicianClick(technician);
                }
            });

                    markersRef.current.push(marker);
                } catch (markerError) {
                }
            });
        } catch (error) {
        }

        // Auto-select first technician if none selected
        if (selectedTechnician && markersRef.current.length > 0) {
            try {
                const selectedMarker = markersRef.current.find(marker =>
                    marker && typeof marker.getTitle === 'function' &&
                    marker.getTitle() === selectedTechnician.technician_name
                );
                if (selectedMarker && typeof selectedMarker.setAnimation === 'function') {
                    selectedMarker.setAnimation(window.google.maps.Animation.BOUNCE);
                    setTimeout(() => {
                        if (selectedMarker && typeof selectedMarker.setAnimation === 'function') {
                            selectedMarker.setAnimation(null);
                        }
                    }, 2000);
                }
            } catch (selectionError) {
            }
        }
    };

    const centerOnTechnician = (technician: TechnicianLocation) => {
        if (!mapInstanceRef.current) return;

        const position = { lat: technician.latitude, lng: technician.longitude };
        mapInstanceRef.current.setCenter(position);
        mapInstanceRef.current.setZoom(15);

        // Find and animate the marker
        const marker = markersRef.current.find(m => m.getTitle() === technician.technician_name);
        if (marker) {
            marker.setAnimation(window.google.maps.Animation.BOUNCE);
            setTimeout(() => {
                marker.setAnimation(null);
            }, 2000);
        }
    };

    useEffect(() => {
        loadGoogleMaps();

        // Cleanup function
        return () => {
            // Clear any existing markers
            if (markersRef.current) {
                markersRef.current.forEach(marker => {
                    if (marker && typeof marker.setMap === 'function') {
                        marker.setMap(null);
                    }
                });
                markersRef.current = [];
            }

            // Close info window
            if (infoWindowRef.current && typeof infoWindowRef.current.close === 'function') {
                infoWindowRef.current.close();
            }
        };
    }, []);

    useEffect(() => {
        if (isLoaded && technicians.length > 0 && !error) {
            // Use a longer, single delay to ensure everything is ready
            const timer = setTimeout(() => {
                // Only attempt initialization once to avoid repeated errors
                if (mapRef.current &&
                    mapRef.current instanceof HTMLElement &&
                    mapRef.current.isConnected &&
                    mapRef.current.offsetWidth > 0 &&
                    mapRef.current.offsetHeight > 0) {
                    initializeMap();
                } else {
                    setError('Map container not ready. Showing location list instead.');
                }
            }, 1000); // Longer single delay
            return () => clearTimeout(timer);
        }
    }, [isLoaded, technicians, error]);

    useEffect(() => {
        if (selectedTechnician && isLoaded) {
            centerOnTechnician(selectedTechnician);
        }
    }, [selectedTechnician, isLoaded]);

    if (error) {
        return (
            <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`} style={{ height }}>
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L5.05 4.05zM4.636 15.364A9 9 0 1015.364 4.636 9 9 0 004.636 15.364z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Map service unavailable</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Please check your internet connection</p>
                </div>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`} style={{ height }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Loading map...</p>
                </div>
            </div>
        );
    }

    if (technicians.length === 0) {
        return (
            <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`} style={{ height }}>
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 10a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">No technicians found</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 ${className}`}>
            <div ref={mapRef} style={{ height, width: '100%' }} />
        </div>
    );
};

export default GoogleMap;