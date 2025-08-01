import { FC } from 'react';

interface IconMenuBranchProps {
    className?: string;
}

const IconMenuBranch: FC<IconMenuBranchProps> = ({ className }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2 3C2 2.44772 2.44772 2 3 2H21C21.5523 2 22 2.44772 22 3V8C22 8.55228 21.5523 9 21 9H3C2.44772 9 2 8.55228 2 8V3ZM4 4V7H20V4H4Z"
                fill="currentColor"
            />
            <path
                opacity="0.5"
                d="M2 12C2 11.4477 2.44772 11 3 11H21C21.5523 11 22 11.4477 22 12V21C22 21.5523 21.5523 22 21 22H3C2.44772 22 2 21.5523 2 21V12ZM4 13V20H20V13H4Z"
                fill="currentColor"
            />
            <path d="M6 15H10V17H6V15Z" fill="currentColor" />
            <path d="M14 15H18V17H14V15Z" fill="currentColor" />
            <path d="M6 18H10V19H6V18Z" fill="currentColor" />
            <path d="M14 18H18V19H14V18Z" fill="currentColor" />
            <circle cx="12" cy="5.5" r="1" fill="currentColor" />
        </svg>
    );
};

export default IconMenuBranch;
