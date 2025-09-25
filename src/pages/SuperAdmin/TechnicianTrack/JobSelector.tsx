import React, { useEffect, useState } from "react";
import JobLiveTrack from "./JobLiveTrack";
import { Job } from '../../../types/track.types';
import { trackService } from '../../../services/trackService';

const JobSelector: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    useEffect(() => {
        const fetchJobs = async () => {
            const data = await trackService.getAllJobs();
            setJobs(data);
        };
        fetchJobs();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Select Job for Tracking</h1>
            <select
                className="border p-2 rounded"
                onChange={(e) => {
                    const job = jobs.find((j) => j.id === e.target.value);
                    setSelectedJob(job || null);
                }}
            >
                <option value="">-- Select a Job --</option>
                {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                        {job.title} ({job.status})
                    </option>
                ))}
            </select>

            {selectedJob && (
                <div className="mt-6">
                    <JobLiveTrack job={selectedJob} />
                </div>
            )}
        </div>
    );
};

export default JobSelector;
