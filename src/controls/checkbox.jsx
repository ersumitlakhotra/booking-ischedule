import React from "react";

export const Checkbox=({
    label = "",
    description = "",
    checked = false,
    setChecked,
    disabled = false,
    error = "",
    className = "",
    size = "md", // sm | md | lg
})=> {
    const sizes = {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
    };

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <label
                className={`flex items-start gap-3 ${
                    disabled
                        ? "cursor-not-allowed opacity-60"
                        : "cursor-pointer"
                }`}
            >
                <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={(e) => setChecked?.(e.target.checked)}
                    className={`
                        ${sizes[size]}
                        mt-0.5 rounded border-gray-300
                        text-blue-600
                        focus:ring-2 focus:ring-blue-200
                    `}
                />

                <div className="flex flex-col">
                    {label && (
                        <span className="text-sm font-medium text-gray-800">
                            {label}
                        </span>
                    )}

                    {description && (
                        <span className="text-xs text-gray-500">
                            {description}
                        </span>
                    )}
                </div>
            </label>

            {error && (
                <span className="ml-8 text-xs text-red-500">
                    {error}
                </span>
            )}
        </div>
    );
}