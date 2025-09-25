export interface Job {
    id: string;
    title: string;
    description: string;
    assigned_to: string;
}

export interface TrackPoint {
    lat: number;
    lng: number;
    recorded_at: string;
}

export interface Track {
    id: string;
    technician_id: string;
    job_id: string;
    started_at: string;
    ended_at?: string;
    points: TrackPoint[];
}
