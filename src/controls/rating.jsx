import { useState } from "react";

export const Rating=({
  value = 0,
  onChange,
  max = 5,
  disabled = false,
  size = 28,
})=> {
  const [hover, setHover] = useState(0);

  const displayValue = hover || value;

  const getStarFill = (index) => {
    if (displayValue >= index) return "100%";
    if (displayValue >= index - 0.5) return "50%";
    return "0%";
  };

  return (
    <div className="flex items-center gap-1 select-none">
      {Array.from({ length: max }).map((_, i) => {
        const star = i + 1;

        return (
          <div
            key={star}
            className={`relative ${disabled ? "" : "cursor-pointer"}`}
            style={{ width: size, height: size }}
            onMouseLeave={() => !disabled && setHover(0)}
          >
            {/* Left Half */}
            <div
              className="absolute left-0 top-0 w-1/2 h-full z-20"
              onMouseEnter={() => !disabled && setHover(star - 0.5)}
              onClick={() => !disabled && onChange?.(star - 0.5)}
            />

            {/* Right Half */}
            <div
              className="absolute right-0 top-0 w-1/2 h-full z-20"
              onMouseEnter={() => !disabled && setHover(star)}
              onClick={() => !disabled && onChange?.(star)}
            />

            {/* Empty Star */}
            <svg
              viewBox="0 0 24 24"
              className="absolute inset-0 text-gray-300"
              fill="currentColor"
            >
              <path d="M12 17.3l6.18 3.7-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>

            {/* Filled Star */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: getStarFill(star) }}
            >
              <svg
                viewBox="0 0 24 24"
                className="text-yellow-400"
                fill="currentColor"
              >
                <path d="M12 17.3l6.18 3.7-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}