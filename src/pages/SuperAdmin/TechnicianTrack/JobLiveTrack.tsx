import React, { useEffect, useState } from 'react';
import { Job, Track } from '../../../types/track.types';
import { trackService } from '../../../services/trackService';
import echo from '../../../utils/echo';
import GoogleMap from '../../../components/Maps/GoogleMap';
import { MapPin, Navigation, Clock, Battery, Route, Activity } from 'lucide-react';

interface Props {
    job: Job;
}

const JobLiveTrack: React.FC<Props> = ({ job }) => {
    const [track, setTrack] = useState<Track | null>(null);
    const [path, setPath] = useState<{ lat: number; lng: number }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const calculateStats = () => {
        if (!track?.points || track.points.length === 0) return null;

        const points = track.points;
        const totalDistance = calculateTotalDistance(points);
        const duration = calculateDuration();
        const avgSpeed = points.reduce((sum, p) => sum + (p.speed || 0), 0) / points.length;
        const maxSpeed = Math.max(...points.map((p) => p.speed || 0));

        return {
            totalDistance: totalDistance.toFixed(2),
            duration,
            avgSpeed: avgSpeed.toFixed(1),
            maxSpeed: maxSpeed.toFixed(1),
            totalPoints: points.length,
            currentBattery: points[points.length - 1]?.battery || 0,
            accuracy: points[points.length - 1]?.accuracy || 0,
            lastUpdate: points[points.length - 1]?.recorded_at || '',
        };
    };

    const calculateTotalDistance = (points: any[]) => {
        let distance = 0;
        for (let i = 1; i < points.length; i++) {
            distance += getDistanceBetweenPoints(parseFloat(points[i - 1].lat), parseFloat(points[i - 1].lng), parseFloat(points[i].lat), parseFloat(points[i].lng));
        }
        return distance;
    };

    const getDistanceBetweenPoints = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const calculateDuration = () => {
        if (!track?.points || track.points.length < 2) return '0m';
        const start = new Date(track.started_at);
        const end = track.ended_at ? new Date(track.ended_at) : new Date();
        const diffMs = end.getTime() - start.getTime();
        const minutes = Math.floor(diffMs / 60000);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        }
        return `${minutes}m`;
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            setError(null);
            try {
                let trackData: Track;
                try {
                    trackData = await trackService.getTrackByJob(job.id);
                } catch {
                    trackData = await trackService.startTrack(job.id);
                }
                setTrack(trackData);

                if (trackData.points && trackData.points.length > 0) {
                    const polyPoints = trackData.points
                        .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime())
                        .map((p) => ({
                            lat: Number(p.lat),
                            lng: Number(p.lng),
                        }));

                    console.log('Path points:', polyPoints);
                    setPath(polyPoints);
                }
            } catch (err) {
                console.error('Error loading track:', err);
                setError('Failed to load tracking data');
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, [job.id]);

    useEffect(() => {
        if (!track) return;

        const channelName = `tech.${track.technician_id}`;
        const channel = echo.channel(channelName);

        channel.listen('.TechnicianLocationUpdated', (e: any) => {
            console.log('New location update:', e);
            const newPoint = { lat: parseFloat(e.point.lat), lng: parseFloat(e.point.lng) };
            setPath((prev) => [...prev, newPoint]);
            setTrack((prevTrack) => {
                if (!prevTrack) return prevTrack;
                return {
                    ...prevTrack,
                    points: [...(prevTrack.points || []), e.point],
                };
            });
        });

        return () => {
            echo.leaveChannel(channelName);
        };
    }, [track]);

    const stats = calculateStats();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading tracking data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center">
                    <div className="text-red-600">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error Loading Track</h3>
                        <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                            <Route className="w-6 h-6 mr-2 text-blue-600" />
                            {job.title}
                        </h2>
                        <p className="text-gray-600 mt-1">Live tracking in progress</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${track?.ended_at ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700'}`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${track?.ended_at ? 'bg-gray-400' : 'bg-green-400 animate-pulse'}`}></div>
                            {track?.ended_at ? 'Completed' : 'Live'}
                        </div>
                    </div>
                </div>
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Distance</p>
                                    <p className="text-2xl font-bold text-blue-900">{stats.totalDistance}</p>
                                    <p className="text-xs text-blue-700">kilometers</p>
                                </div>
                                <Route className="w-8 h-8 text-blue-500" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Duration</p>
                                    <p className="text-2xl font-bold text-green-900">{stats.duration}</p>
                                    <p className="text-xs text-green-700">elapsed time</p>
                                </div>
                                <Clock className="w-8 h-8 text-green-500" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Avg Speed</p>
                                    <p className="text-2xl font-bold text-purple-900">{stats.avgSpeed}</p>
                                    <p className="text-xs text-purple-700">km/h</p>
                                </div>
                                <Navigation className="w-8 h-8 text-purple-500" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-orange-600 uppercase tracking-wide">Battery</p>
                                    <p className="text-2xl font-bold text-orange-900">{stats.currentBattery}%</p>
                                    <p className="text-xs text-orange-700">remaining</p>
                                </div>
                                <Battery className="w-8 h-8 text-orange-500" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        <div className="p-4 border-b bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                                Route Visualization
                            </h3>
                        </div>
                        {track ? (
                            <GoogleMap
                                technicians={
                                    path.length > 0
                                        ? [
                                              {
                                                  technician_id: track.technician_id,
                                                  technician_name: 'Technician',
                                                  lat: path[path.length - 1].lat,
                                                  lng: path[path.length - 1].lng,
                                                  status: 'active',
                                                  is_online: true,
                                              },
                                          ]
                                        : []
                                }
                                path={path}
                                height="500px"
                            />
                        ) : (
                            <div className="h-96 flex items-center justify-center text-gray-500">No tracking data available</div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Activity className="w-5 h-5 mr-2 text-blue-600" />
                            Trip Details
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Started</span>
                                <span className="text-sm font-medium text-gray-900">{track?.started_at ? formatTime(track.started_at) : 'N/A'}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Status</span>
                                <span className={`text-sm font-medium ${track?.ended_at ? 'text-gray-600' : 'text-green-600'}`}>{track?.ended_at ? 'Completed' : 'In Progress'}</span>
                            </div>
                            {stats && (
                                <>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <span className="text-sm text-gray-600">Total Points</span>
                                        <span className="text-sm font-medium text-gray-900">{stats.totalPoints}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <span className="text-sm text-gray-600">Max Speed</span>
                                        <span className="text-sm font-medium text-gray-900">{stats.maxSpeed} km/h</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <span className="text-sm text-gray-600">GPS Accuracy</span>
                                        <span className="text-sm font-medium text-gray-900">{stats.accuracy}m</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-sm text-gray-600">Last Update</span>
                                        <span className="text-sm font-medium text-gray-900">{stats.lastUpdate ? formatTime(stats.lastUpdate) : 'N/A'}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {track?.points && track.points.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                                Recent Activity
                            </h3>
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                {track.points
                                    .slice(-5)
                                    .reverse()
                                    .map((point, index) => (
                                        <div key={point.id || index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-600">{formatTime(point.recorded_at)}</p>
                                                <p className="text-sm text-gray-900">
                                                    Speed: {point.speed || 0} km/h • Battery: {point.battery || 0}%
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobLiveTrack;
