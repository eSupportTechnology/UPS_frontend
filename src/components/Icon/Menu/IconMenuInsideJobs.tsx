import { FC } from 'react';

interface IconMenuInsideJobsProps {
    className?: string;
}

const IconMenuInsideJobs: FC<IconMenuInsideJobsProps> = ({ className }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path
                d="M3 13H1V11H3V13Z"
                fill="currentColor"
            />
            <path
                d="M6 13H4V11H6V13Z"
                fill="currentColor"
            />
            <path
                d="M8 17H6V15H8V17Z"
                fill="currentColor"
            />
            <path
                d="M11 17H9V15H11V17Z"
                fill="currentColor"
            />
            <path
                d="M14 17H12V15H14V17Z"
                fill="currentColor"
            />
            <path
                d="M17 13H15V11H17V13Z"
                fill="currentColor"
            />
            <path
                d="M20 13H18V11H20V13Z"
                fill="currentColor"
            />
            <path
                d="M23 13H21V11H23V13Z"
                fill="currentColor"
            />
            <path
                d="M8 10H2C1.44772 10 1 10.4477 1 11V13C1 13.5523 1.44772 14 2 14H8C8.55228 14 9 13.5523 9 13V11C9 10.4477 8.55228 10 8 10Z"
                opacity="0.5"
                fill="currentColor"
            />
            <path
                d="M22 10H16C15.4477 10 15 10.4477 15 11V13C15 13.5523 15.4477 14 16 14H22C22.5523 14 23 13.5523 23 13V11C23 10.4477 22.5523 10 22 10Z"
                opacity="0.5"
                fill="currentColor"
            />
            <path
                d="M11 16H5C4.44772 16 4 16.4477 4 17V19C4 19.5523 4.44772 20 5 20H11C11.5523 20 12 19.5523 12 19V17C12 16.4477 11.5523 16 11 16Z"
                opacity="0.5"
                fill="currentColor"
            />
        </svg>
    );
};

export default IconMenuInsideJobs;
