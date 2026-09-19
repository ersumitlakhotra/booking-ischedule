import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * @typedef {"error" | "warning" | "success"} MessageVariant
 */

/**
 * @param {Object} props
 * @param {MessageVariant} [props.messageType]
 */
export const Modal = ({
    open,
    children,
    className = "",
    message = [],
    messageType = "error",
}) => {
    if (!open) return null;

    const styles = {
        error: "bg-red-50 border-red-200 text-red-700",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
        success: "bg-green-50 border-green-200 text-green-700",
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 20 }}
                    transition={{ duration: 0.25 }}
                    className={`w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${className}`}
                >
                    <AnimatePresence>
                        {message.length > 0 && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className={`border-b px-6 py-4 ${styles[messageType]}`}
                            >
                                <h3 className="font-semibold mb-2">
                                    Please correct the following:
                                </h3>

                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    {message.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {children}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};