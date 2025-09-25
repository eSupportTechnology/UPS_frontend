import type { Job, Track } from "../types/track.types";
import api from '../config/api.config';

export const trackService = {
    async getAllJobs(): Promise<Job[]> {
        const res = await api.get("/jobs");
        if (Array.isArray(res.data)) {
            return res.data;
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

    async getTrackByJob(jobId: string): Promise<Track> {
        const res = await api.get(`/jobs/${jobId}/track`);
        return res.data;
    }

};
