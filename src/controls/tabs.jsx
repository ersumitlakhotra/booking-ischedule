import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Tabs = ({
  tabs = [],
  className = "",
  activeTab: controlledActiveTab,
  onTabChange,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(
    tabs[0]?.id || ""
  );

  // Use external activeTab when provided,
  // otherwise use internal state
  const activeTab =
    controlledActiveTab !== undefined
      ? controlledActiveTab
      : internalActiveTab;

  // If tabs change and current tab no longer exists,
  // select the first available tab
  useEffect(() => {
    if (!tabs.length) return;

    const exists = tabs.some((tab) => tab.id === activeTab);

    if (!exists) {
      const firstTab = tabs[0]?.id || "";

      if (controlledActiveTab === undefined) {
        setInternalActiveTab(firstTab);
      }

      onTabChange?.(firstTab);
    }
  }, [tabs, activeTab, controlledActiveTab, onTabChange]);

  const activeContent = tabs.find((tab) => tab.id === activeTab);

  const variants = {
    alert: "border border-orange-500 bg-orange-100 text-orange-500",
    danger: "border border-rose-500 bg-rose-100 text-rose-500",
    default: "bg-sky-100 text-sky-800",
  };

  const handleTabChange = (id) => {
    // Update internal state only when uncontrolled
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(id);
    }

    // Notify parent
    onTabChange?.(id);
  };

  return (
    <div className="w-full">
      {/* Tabs Header */}
      <div className="relative border-b border-gray-200 dark:border-gray-500">
        <div className="flex items-center gap-6 overflow-x-auto">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`relative flex items-center gap-2 whitespace-nowrap px-1 pb-4 pt-1 text-sm transition-all duration-200 ${
                  active
                    ? "font-semibold text-sky-500"
                    : "text-gray-600 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {/* Left Icon */}
                {tab.icon && (
                  <tab.icon
                    size={16}
                    className={active ? "text-sky-500" : ""}
                  />
                )}

                {/* Label */}
                <span>{tab.label}</span>

                {/* Right Badge */}
                {tab.badge !== undefined && (
                  <span
                    className={`rounded-full px-2 py-[2px] text-xs ${
                      (tab.varient || "default") === "default"
                        ? active
                          ? variants[tab.varient || "default"]
                          : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        : variants[tab.varient] || variants.default
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}

                {/* Animated Underline */}
                {active && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-sky-500"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="relative mt-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.22,
              ease: "easeOut",
            }}
            className={`w-full rounded-2xl py-4 ${className}`}
          >
            {activeContent?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};