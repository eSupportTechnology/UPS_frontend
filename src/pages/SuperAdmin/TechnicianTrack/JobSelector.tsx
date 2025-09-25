import React, { useEffect, useState } from "react";
import { Job } from '../../../types/track.types';
import { trackService } from '../../../services/trackService';
import JobLiveTrack from './JobLiveTrack';

const JobSelector: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const jobList = await trackService.getAllJobs();
                setJobs(jobList);
            } catch (err) {
                console.error("Error fetching jobs:", err);
                setJobs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Select Job for Tracking</h1>

            {loading ? (
                <p>Loading jobs...</p>
            ) : (
                <select
                    className="border p-2 rounded"
                    onChange={(e) => {
                        const job = jobs.find((j) => j.id === e.target.value);
                        setSelectedJob(job || null);
                    }}
                >
                    <option value="">-- Select a Job --</option>
                    {Array.isArray(jobs) && jobs.length > 0 ? (
                        jobs.map((job) => (
                            <option key={job.id} value={job.id}>
                                {job.title}
                            </option>
                        ))
                    ) : (
                        <option disabled>No jobs available</option>
                    )}
                </select>
            )}

            {selectedJob && (
                <div className="mt-6">
                    <JobLiveTrack job={selectedJob} />
                </div>
            )}
        </div>
    );
};

export default JobSelector;
