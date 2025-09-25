import React, { useEffect, useState } from "react";
import { Job, Track } from '../../../types/track.types';
import { trackService } from '../../../services/trackService';
import echo from '../../../utils/echo';
import GoogleMap from '../../../components/Maps/GoogleMap';

interface Props {
    job: Job;
}

const JobLiveTrack: React.FC<Props> = ({ job }) => {
    const [track, setTrack] = useState<Track | null>(null);
    const [path, setPath] = useState<{ lat: number; lng: number }[]>([]);

    // Load or create a track
    useEffect(() => {
        const init = async () => {
            try {
                let trackData: Track;
                try {
                    trackData = await trackService.getTrack(job.id);
                } catch {
                    trackData = await trackService.startTrack(job.id);
                }
                setTrack(trackData);

                if (trackData.points && trackData.points.length > 0) {
                    setPath(
                        trackData.points.map((p) => ({
                            lat: +p.lat,
                            lng: +p.lng,
                        }))
                    );
                }
            } catch (err) {
                console.error("Error loading track:", err);
            }
        };

        init();
    }, [job.id]);

    // Subscribe to live updates
    useEffect(() => {
        if (!track) return;

        const channelName = `tech.${track.technician_id}`;
        const channel = echo.channel(channelName);

        channel.listen(".TechnicianLocationUpdated", (e: any) => {
            setPath((prev) => [
                ...prev,
                { lat: parseFloat(e.point.lat), lng: parseFloat(e.point.lng) },
            ]);
        });

        return () => {
            echo.leaveChannel(channelName);
        };
    }, [track]);

    return (
        <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">
                Tracking Job: {job.title}
            </h2>
            {track ? (
                <GoogleMap
                    technicians={
                        path.length > 0
                            ? [
                                {
                                    technician_id: track.technician_id,
                                    technician_name: "Technician",
                                    lat: path[path.length - 1].lat,
                                    lng: path[path.length - 1].lng,
                                    status: "active",
                                    is_online: true,
                                },
                            ]
                            : []
                    }
                    selectedTechnician={null}
                    path={path}
                />
            ) : (
                <p>Loading track...</p>
            )}
        </div>
    );
};

export default JobLiveTrack;
