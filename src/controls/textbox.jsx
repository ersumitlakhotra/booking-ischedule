import { useState } from "react";

/**
 * @param {Object} props
 * @param {string} props.label
 * @param {any} [props.icon]
 * @param {boolean} [props.required]
 * @param {boolean} [props.disabled]
 */
export const Textbox = ({
  type = "text",
  label,
  value,
  setValue,
  placeholder = "",
  required = false,
  disabled = false,
  helperText = "",
  error = "",
  icon: Icon,
  iconClick,
  className = "",
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 flex items-center gap-1 text-sm font-semibold text-gray-700">
          {label}
          {required && (
            <span className="text-red-500">*</span>
          )}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ${iconClick && 'cursor-pointer'}`}
            onClick={iconClick}
          />
        )}

        <input
          type={type}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          style={{ fontSize: 16 }}
          className={`
            w-full rounded-xl border bg-gray-50 py-2.5 transition-all duration-200
            ${Icon ? "pl-10 pr-4" : "px-4"}
            
            ${
              disabled
                ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                : "border-gray-300 text-gray-800"
            }

            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : "focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            }

            outline-none
            ${className}
          `}
        />
      </div>

      {(helperText || error) && (
        <p
          className={`mt-2 text-xs ${
            error ? "text-red-500" : "text-gray-500"
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};
