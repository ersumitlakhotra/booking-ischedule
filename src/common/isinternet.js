import { useEffect, useState } from "react";
import { Modal } from "../controls";

function useNetworkStatus() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return isOnline;
}

const NetworkBanner = () => {
    const isOnline = useNetworkStatus();

    if (isOnline) return null;

    return (
        <Modal open={true} message={[]} messageType="error" children={       
                <div className="flex-1 overflow-y-auto px-8 py-4 mb-10 ">

                    <div className="flex items-center justify-center">
                        <div className="bg-slate-700 text-white rounded-2xl p-6 w-[300px] text-center shadow-xl">

                            {/* Icon */}
                            <div className="flex justify-center mb-4">
                                <div className="text-cyan-400 text-5xl">
                                    📡❌
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="text-lg font-semibold mb-2">Whoops</h2>

                            {/* Message */}
                            <p className="text-sm text-gray-200 mb-6">
                                No Internet connection found <br /><br />
                                Check your connection.
                            </p>

                        </div>
                    </div>
                </div>
        } />
    );
};

export default NetworkBanner;

