import { FC } from 'react';

interface IconMenuInventoryProps {
    className?: string;
}

const IconMenuInventory: FC<IconMenuInventoryProps> = ({ className }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 6C3 4.89543 3.89543 4 5 4H9C10.1046 4 11 4.89543 11 6V10C11 11.1046 10.1046 12 9 12H5C3.89543 12 3 11.1046 3 10V6ZM5 6V10H9V6H5Z"
                fill="currentColor"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13 6C13 4.89543 13.8954 4 15 4H19C20.1046 4 21 4.89543 21 6V10C21 11.1046 20.1046 12 19 12H15C13.8954 12 13 11.1046 13 10V6ZM15 6V10H19V6H15Z"
                fill="currentColor"
            />
            <path
                opacity="0.5"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 14C3 12.8954 3.89543 12 5 12H9C10.1046 12 11 12.8954 11 14V18C11 19.1046 10.1046 20 9 20H5C3.89543 20 3 19.1046 3 18V14ZM5 14V18H9V14H5Z"
                fill="currentColor"
            />
            <path
                opacity="0.5"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13 14C13 12.8954 13.8954 12 15 12H19C20.1046 12 21 12.8954 21 14V18C21 19.1046 20.1046 20 19 20H15C13.8954 20 13 19.1046 13 18V14ZM15 14V18H19V14H15Z"
                fill="currentColor"
            />
            <circle cx="7" cy="8" r="1" fill="currentColor" />
            <circle cx="17" cy="8" r="1" fill="currentColor" />
            <circle cx="7" cy="16" r="1" fill="currentColor" />
            <circle cx="17" cy="16" r="1" fill="currentColor" />
        </svg>
    );
};

export default IconMenuInventory;
