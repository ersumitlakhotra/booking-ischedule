import { motion } from "framer-motion";

/**
 * @param {Object} props
 * @param {{ id: number, label: string, icon: any }[]} props.steps
 * @param {number} props.currentStep
 * @param {(step: number) => void} props.onChange
 * @param {boolean} [props.allowSkip]
 */
export const Steps = ({
    steps = [],
    currentStep = 1,
    onChange,
    allowSkip = true,
}) => {
    const totalSteps = steps.length;

    const progress =
        totalSteps === 1
            ? 100
            : ((currentStep - 1) / (totalSteps - 1)) * 100;

    const handleClick = (stepId) => {
        if (!onChange) return;

        // If already on last step, disable all clicks
        //if (currentStep === steps.length) return;

        // Prevent clicking directly on last step
        //if (stepId === steps.length) return;

        // Normal behavior
        if (allowSkip || stepId <= currentStep) {
            onChange(stepId);
        }
    };

    return (
            <div className="relative flex items-center justify-between">

                {/* TRACK */}
                <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-200 dark:bg-slate-700" />

                {/* PROGRESS */}
                <motion.div
                    className="absolute top-5 left-0 h-[2px] bg-cyan-500"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                />

                {/* STEPS */}
                {steps.map((item) => {
                    const active = currentStep >= item.id;
                    const isCurrent = currentStep === item.id;
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.id}
                            onClick={() => handleClick(item.id)}
                            className={`relative z-10 flex flex-col items-center flex-1 ${onChange && "cursor-pointer"}`}
                        >
                            <div
                                className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all
                                ${
                                    active
                                        ? "bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                                        : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-slate-400"
                                }
                                ${isCurrent ? "ring-2 ring-cyan-400" : ""}
                                hover:scale-105`}
                            >
                                <Icon size={18} />
                            </div>

                            <span
                                className={`mt-3 text-xs font-semibold
                                ${
                                    active
                                        ? "text-cyan-500"
                                        : "text-slate-400"
                                }`}
                            >
                                {item.label}
                            </span>
                        </div>
                    );
                })}
            </div>
    );
};