const Loader = () => {
    return (
        <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
            <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                <circle cx="32" cy="32" r="28" fill="none" stroke="#1e4d8b" strokeWidth="4" strokeDasharray="87.96" strokeDashoffset="87.96" strokeLinecap="round">
                    <animate attributeName="stroke-dashoffset" values="87.96;0;87.96" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="32" cy="32" r="20" fill="none" stroke="#5cb85c" strokeWidth="3" strokeDasharray="62.83" strokeDashoffset="62.83" strokeLinecap="round">
                    <animate attributeName="stroke-dashoffset" values="62.83;0;62.83" dur="1.5s" repeatCount="indefinite" />
                </circle>

                <g transform="translate(32,32)">
                    <path fill="#1e4d8b" d="M-6,-8 L6,-8 L2,0 L8,0 L-8,10 L-2,2 L-6,2 Z">
                        <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="4s" repeatCount="indefinite" />
                    </path>
                </g>
            </svg>
        </div>
    );
};

export default Loader;
