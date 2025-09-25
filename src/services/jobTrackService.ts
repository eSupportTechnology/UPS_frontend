import api from '../config/api.config';
export const jobTrackService = {
    async getTrack(trackId: string) {
        const res = await api.get(`/tracks/${trackId}`);
        return res.data;
    }
};
