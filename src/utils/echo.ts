// Pusher/Echo disabled
declare global {
    interface Window {
        Echo: any;
    }
}

// Mock Echo object with no-op methods
const echo = {
    channel: () => ({ listen: () => {} }),
    private: () => ({ listen: () => {} }),
    subscribe: () => ({ listen: () => {} }),
};

export default echo;
