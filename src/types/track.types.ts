export interface Job {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    assigned_to: string;

    assigned_technician?: {
        id: string;
        name: string;
        email: string;
    };

    track?: Track;
}

export interface TrackPoint {
    id?: string | number;
    lat: number;
    lng: number;
    speed?: number;
    battery?: number;
    accuracy?: number;
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

export interface JobLiveTrackProps {
    job: Job;
}
