import { useState } from "react";
/**
 * @typedef {"top" | "bottom" | "left" | "right"} ButtonPlacement
 */

/**
 * @param {Object} props
 * @param {ButtonPlacement} [props.placement]
 */
export const Tooltip=({
  children,
  title,
  placement = "top",
})=> {
  const [visible, setVisible] = useState(false);

  const placements = {
    top: {
      tooltip:
        "bottom-full left-1/2 -translate-x-1/2 mb-2",
      arrow:
        "top-full left-1/2 -translate-x-1/2 border-t-gray-900 border-l-transparent border-r-transparent border-b-transparent",
    },
    bottom: {
      tooltip:
        "top-full left-1/2 -translate-x-1/2 mt-2",
      arrow:
        "bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 border-l-transparent border-r-transparent border-t-transparent",
    },
    left: {
      tooltip:
        "right-full top-1/2 -translate-y-1/2 mr-2",
      arrow:
        "left-full top-1/2 -translate-y-1/2 border-l-gray-900 border-t-transparent border-b-transparent border-r-transparent",
    },
    right: {
      tooltip:
        "left-full top-1/2 -translate-y-1/2 ml-2",
      arrow:
        "right-full top-1/2 -translate-y-1/2 border-r-gray-900 border-t-transparent border-b-transparent border-l-transparent",
    },
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}

      <div
        className={`
          absolute z-50
          ${placements[placement].tooltip}
          px-3 py-1.5
          text-xs text-white
          bg-gray-900
          rounded-md
          shadow-lg
          whitespace-nowrap
          transition-all duration-200
          pointer-events-none
          ${
            visible
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95"
          }
        `}
      >
        {title}

        <div
          className={`
            absolute w-0 h-0
            border-[6px]
            ${placements[placement].arrow}
          `}
        />
      </div>
    </div>
  );
}