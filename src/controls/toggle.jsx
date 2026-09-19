import React from "react";

/**
 * @typedef {"primary" | "success" | "danger" | "default"} ToggleVariant
 */

/**
 * @param {Object} props
 * @param {boolean} [props.value]
 * @param {Function} [props.onChange]
 * @param {string} [props.label]
 * @param {string} [props.onLabel]
 * @param {string} [props.offLabel]
 * @param {ToggleVariant} [props.variant]
 * @param {boolean} [props.disabled]
 * @param {string} [props.className]
 */

export const Toggle = ({
  value = false,
  onChange,
  label,
  onLabel = "ON",
  offLabel = "OFF",
  variant = "primary",
  disabled = false,
  className = "",
}) => {

  const variants = {
    primary: {
      on: "bg-cyan-500",
      dot: "bg-white",
    },
    success: {
      on: "bg-emerald-500",
      dot: "bg-white",
    },
    danger: {
      on: "bg-rose-500",
      dot: "bg-white",
    },
    default: {
      on: "bg-gray-700 dark:bg-gray-500",
      dot: "bg-white",
    },
  };

  const currentVariant = variants[variant] || variants.primary;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      
      {label && (
        <span className="text-xs  text-gray-500 ">
          {label}
        </span>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={value}
        disabled={disabled}
        onClick={() => onChange?.(!value)}
        className={`
          relative flex h-7 w-14 items-center rounded-full
          p-1 transition-all duration-200 ease-in-out
          focus:outline-none
          ${value
            ? currentVariant.on
            : "bg-gray-200 dark:bg-slate-700"
          }
          ${disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer"
          }
        `}
      >
        {/* Toggle Circle */}
        <span
          className={`
            flex h-5 w-5 items-center justify-center
            rounded-full shadow-sm
            transition-transform duration-200 ease-in-out
            ${currentVariant.dot}
            ${value ? "translate-x-7" : "translate-x-0"}
          `}
        />

        {/* Text */}
        <span
          className={`
            absolute text-[9px] font-bold
            transition-opacity duration-200
            ${value
              ? "left-2 text-white opacity-100"
              : "right-2 text-gray-500 opacity-100 dark:text-gray-400"
            }
          `}
        >
          {value ? onLabel : offLabel}
        </span>
      </button>
    </div>
  );
};