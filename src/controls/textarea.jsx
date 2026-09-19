import { useState } from "react";

/**
 * @param {Object} props
 * @param {string} props.label
 * @param {boolean} [props.required]
 * @param {boolean} [props.disabled]
 * @param {number} [props.rows]
 */
export const Textarea = ({
    label,
    required = false,
    disabled = false,
    rows = 6,
    className = "",
    value = "",
    setValue,
    onBlur,
    helperText = "",
    error = "",
    icon: Icon,
    ...props
}) => {
    const [touched, setTouched] = useState(false);

    const showError =
        required &&
        touched &&
        (!value || value.toString().trim() === "");

    const errorMessage = `${label} is required`;

    return (
        <div className="w-full">
            {/* Label */}
            {label && (
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 block">
                    {label}

                    {required && (
                        <span className="text-red-500 ml-1">*</span>
                    )}
                </label>
            )}

            {/* Textarea */}
            <textarea
                {...props}
                rows={rows}
                value={value}
                disabled={disabled}
                onChange={(e) => setValue(e.target.value)}
                onBlur={(e) => {
                    setTouched(true);

                    if (onBlur) {
                        onBlur(e);
                    }
                }}
                className={`
            w-full rounded-xl border bg-gray-50 py-2.5 transition-all duration-200
            ${Icon ? "pl-10 pr-4" : "px-4"}
            
            ${disabled
                        ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                        : "border-gray-300 text-gray-800"
                    }

            ${error
                        ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                        : "focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    }

            outline-none
            ${className}
          `}
            />

            {/* Error */}
            {showError && (
                <p className="text-xs text-red-500 mt-1">
                    {errorMessage}
                </p>
            )}
        </div>
    );
}
