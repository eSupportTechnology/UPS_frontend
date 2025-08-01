import { FC } from 'react';

interface IconMenuContractProps {
    className?: string;
}

const IconMenuContract: FC<IconMenuContractProps> = ({ className }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 2C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8.41421C20 8.149 19.8946 7.89464 19.7071 7.70711L15.2929 3.29289C15.1054 3.10536 14.851 3 14.5858 3H6ZM6 4H14V8C14 8.55228 14.4477 9 15 9H18V20H6V4Z"
                fill="currentColor"
            />
            <path
                opacity="0.5"
                d="M15 3.5V8H19.5L15 3.5Z"
                fill="currentColor"
            />
            <path
                d="M8 12H16V13H8V12Z"
                fill="currentColor"
            />
            <path
                d="M8 14H16V15H8V14Z"
                fill="currentColor"
            />
            <path
                d="M8 16H13V17H8V16Z"
                fill="currentColor"
            />
            <path
                opacity="0.7"
                d="M8 18H11V19H8V18Z"
                fill="currentColor"
            />
            <circle
                cx="15.5"
                cy="17.5"
                r="1.5"
                fill="currentColor"
            />
            <path
                d="M14.5 18.5L15.5 19.5L17.5 17.5"
                stroke="white"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    );
};

export default IconMenuContract;
