import React from "react";

/**
 * @typedef {"primary" | "secondary" | "dotted" | "danger" | "default" | "orange"} ButtonVariant
 * @typedef {"left" | "right"} IconPlacement
 * @typedef {"circle" | "square"} ButtonShape
 */

/**
 * @param {Object} props
 * @param {ButtonVariant} [props.variant]
 * @param {ButtonShape} [props.shape]
 * @param {any} [props.icon]
 * @param {IconPlacement} [props.iconPlacement]
 * @param {string} [props.label]
 * @param {Function} [props.onClick]
 * @param {string} [props.className]
 * @param {boolean} [props.disabled]
 */

export const Button = ({
  variant = "primary",
  shape = "square",
  icon: Icon,
  iconPlacement = 'left',
  iconProps,
  label,
  tooltip,
  onClick,
  className = "",
  disabled = false
}) => {
  const variants = {
    primary:
      "bg-cyan-500 hover:bg-cyan-600 text-white shadow-md",
    secondary:
      "border bg-white border-gray-200 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 hover:border-cyan-300",
    noborder:
      "bg-white text-gray-500 hover:text-cyan-600 hover:bg-cyan-50",     
    danger:
      "bg-red-500  hover:bg-red-600   text-white shadow-md",
    orange:
      "bg-orange-400 hover:bg-orange-500 text-white shadow-md",
    dotted:
      "border border-dashed border-gray-700 rounded-3xl py-4 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-950/30 transition-colors",
    default:
      "rounded-xl dark:hover:bg-slate-800 flex items-center justify-center transition ",
  };

  const shapes = {
    circle:
      "rounded-full",
    square:
      " rounded-xl",
  };

  return (    
      <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
        disabled={disabled}
        className={`p-3  flex items-center gap-1 justify-center transition duration-200 relative group
        ${variants[variant]}
        ${disabled && "opacity-50 cursor-not-allowed"}       
        ${label && "px-5"}
        ${shapes[shape]}
        ${className}
      `}
      >
        {Icon && iconPlacement === 'left' && <Icon size={20} {...iconProps} />}
        {label && <span className="text-sm font-medium">{label}</span>}
        {Icon && iconPlacement === 'right' && <Icon size={20} {...iconProps} />}
        {tooltip && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 text-white dark:bg-white dark:text-gray-800 text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            {tooltip}
          </div>
        )}
      </button>
  );
};