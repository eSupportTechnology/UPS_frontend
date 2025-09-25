import type { Job, Track } from "../types/track.types";
import api from '../config/api.config';

export const trackService = {
    async getAllJobs(): Promise<Job[]> {
        const res = await api.get("/all-tickets");
        if (Array.isArray(res.data)) {
            return res.data;
        } else if (res.data?.data && Array.isArray(res.data.data)) {
            return res.data.data;
        } else if (res.data?.jobs && Array.isArray(res.data.jobs)) {
            return res.data.jobs;
        }
        return [];
    },

    async getTrack(trackId: string): Promise<Track> {
        const res = await api.get(`/tracks/${trackId}`);
        return res.data;
    },

    async startTrack(jobId: string): Promise<Track> {
        const res = await api.post("/tracks/start", { job_id: jobId });
        return res.data;
    },

    async endTrack(trackId: string): Promise<Track> {
        const res = await api.post(`/tracks/${trackId}/end`);
        return res.data;
    },
};
