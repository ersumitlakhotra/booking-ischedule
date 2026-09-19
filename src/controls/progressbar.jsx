import React from "react";

export const ProgressBar=({
  progress = 0,
  active = false,
  height = "h-2",
  className = "",
  showLabels = false,
  startLabel = 0,
  endLabel = 100,
  currentValue,
  minValue,
  warningPercentage = 20,
  enableStockStatus = false,
})=> {
  const percentage = Math.min(Math.max(progress, 0), 100);

  const getColor = () => {
    if (enableStockStatus && currentValue !== undefined && minValue !== undefined) {
      if (currentValue <= minValue) {
        return "bg-red-500";
      }

      if (currentValue <= minValue + 5) {
        return "bg-yellow-500";
      }
    }

    return active ? "bg-white" : "bg-sky-600";
  };

  return (
    <div className="w-full">
      {showLabels && (
        <div className="mb-1 flex justify-between text-xs text-gray-500">
          <span>{startLabel}</span>
          <span>{endLabel}</span>
        </div>
      )}

      <div
        className={`
          overflow-hidden rounded-full
          ${height}
          ${active ? "bg-white/20" : "bg-gray-200"}
          ${className}
        `}
      >
        <div
          className={`
            h-full rounded-full transition-all duration-300
            ${getColor()}
          `}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}