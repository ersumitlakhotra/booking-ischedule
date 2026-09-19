import { useState } from "react";

export const TabsButton = ({
    tabs = [],
    defaultActive = 0,
    onChange,
}) => {
    const [activeIndex, setActiveIndex] = useState(defaultActive);

    const handleClick = (tab, index) => {
        setActiveIndex(index);

        if (onChange) {
            onChange(tab, index);
        }
    };

    return (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {tabs.map((tab, index) => {
                const active = activeIndex === tab.id;

                return (
                    <button
                        key={tab.label}
                        onClick={() => handleClick(tab, tab.id)}
                        className={`flex items-center gap-2 px-5 py-2 rounded-xl border transition whitespace-nowrap ${
                            active
                                ? "bg-cyan-500 text-white font-semibold dark:bg-white dark:text-black dark:border-white"
                                : "bg-white border-gray-200 text-gray-600  hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                    >
                        {/* label */}
                        <span>{tab.label}</span>

                        {/* count badge at end */}
                        {tab.count !== undefined && (
                            <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                    active
                                        ? "bg-white text-black"
                                        : "bg-gray-300 text-gray-700"
                                }`}
                            >
                                {tab.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};