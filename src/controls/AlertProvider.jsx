import {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    CheckCircle2,
    CircleAlert,
    TriangleAlert,
    Info,
    X,
} from "lucide-react";

const AlertContext = createContext(null);

const positions = {
    "top-left": "top-5 left-5",
    "top-center": "top-5 left-1/2 -translate-x-1/2",
    "top-right": "top-5 right-5",

    "bottom-left": "bottom-5 left-5",
    "bottom-center": "bottom-5 left-1/2 -translate-x-1/2",
    "bottom-right": "bottom-5 right-5",
};

const variants = {
    success: {
        icon: CheckCircle2,
        bgClass: "bg-green-50",
        textClass: "text-green-800",
        iconClass: "text-green-600",
        borderClass: "border-green-200",
        progressClass: "bg-green-500",
    },
    error: {
        icon: CircleAlert,
        bgClass: "bg-red-50",
        textClass: "text-red-800",
        iconClass: "text-red-600",
        borderClass: "border-red-200",
        progressClass: "bg-red-500",
    },
    warning: {
        icon: TriangleAlert,
        bgClass: "bg-amber-50",
        textClass: "text-amber-800",
        iconClass: "text-amber-600",
        borderClass: "border-amber-200",
        progressClass: "bg-amber-500",
    },
    info: {
        icon: Info,
        bgClass: "bg-blue-50",
        textClass: "text-blue-800",
        iconClass: "text-blue-600",
        borderClass: "border-blue-200",
        progressClass: "bg-blue-500",
    },
};

export const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);
    const timers = useRef({});

    const removeAlert = useCallback((id) => {
        clearTimeout(timers.current[id]);

        setAlerts((prev) =>
            prev.filter((alert) => alert.id !== id)
        );

        delete timers.current[id];
    }, []);

    const showAlert = useCallback(
        ({
            type = "success",
            message = "",
            duration = 4000,
            position = "top-center",
        }) => {
            const id =
                Date.now() + Math.random();

            const alert = {
                id,
                type,
                message,
                duration,
                position,
            };

            setAlerts((prev) => [...prev, alert]);

            timers.current[id] = setTimeout(() => {
                removeAlert(id);
            }, duration);
        },
        [removeAlert]
    );

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}

            {Object.keys(positions).map((position) => {
                const positionAlerts = alerts.filter(
                    (alert) =>
                        alert.position === position
                );

                const isTop =
                    position.startsWith("top");

                return (
                    <div
                        key={position}
                        className={`fixed z-[9999] flex flex-col gap-3 ${positions[position]}`}
                    >
                        <AnimatePresence>
                            {positionAlerts.map(
                                (alert) => {
                                    const current =
                                        variants[
                                        alert.type
                                        ] ||
                                        variants.success;

                                    const Icon =
                                        current.icon;

                                    return (
                                        <motion.div
                                            key={
                                                alert.id
                                            }
                                            layout
                                            initial={{
                                                opacity: 0,
                                                y: isTop
                                                    ? -60
                                                    : 60,
                                                scale:
                                                    0.95,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                scale: 1,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                y: isTop
                                                    ? -60
                                                    : 60,
                                                scale:
                                                    0.95,
                                            }}
                                            transition={{
                                                duration:
                                                    0.25,
                                            }}
                                        >
                                            <div
                                                className={`
        relative
        overflow-hidden
        min-w-[360px]
        max-w-md
        rounded-xl
        shadow-lg
        px-4
        py-4
        ${current.bgClass}
        ${current.borderClass}
    `}
                                            >

                                                <div className="flex items-start gap-3">
                                                    <Icon
                                                        size={
                                                            22
                                                        }
                                                        className={`mt-0.5 flex-shrink-0 ${current.iconClass}`}
                                                    />

                                                    <div className="flex-1">
                                                        <p
                                                            className={`text-sm font-medium break-words ${current.textClass}`}
                                                        >
                                                            {
                                                                alert.message
                                                            }
                                                        </p>
                                                    </div>

                                                    <button
                                                        onClick={() =>
                                                            removeAlert(
                                                                alert.id
                                                            )
                                                        }
                                                        className="opacity-60 hover:opacity-100 transition"
                                                    >
                                                        <X
                                                            size={
                                                                18
                                                            }
                                                        />
                                                    </button>
                                                </div>

                                                <motion.div
                                                    initial={{
                                                        width: "100%",
                                                    }}
                                                    animate={{
                                                        width: "0%",
                                                    }}
                                                    transition={{
                                                        duration:
                                                            alert.duration /
                                                            1000,
                                                        ease: "linear",
                                                    }}
                                                    className={`absolute bottom-0 left-0 h-[3px] ${current.progressClass}`}
                                                />
                                            </div>
                                        </motion.div>
                                    );
                                }
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context =
        useContext(AlertContext);

    if (!context) {
        throw new Error(
            "useAlert must be used within AlertProvider"
        );
    }

    return context;
};