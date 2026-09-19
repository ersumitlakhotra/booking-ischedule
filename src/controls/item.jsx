import { useState } from "react";

/**
 * @param {Object} props
 * @param {string} props.label
 * @param {boolean} [props.required]
 */
export const Item = ({
  label,
  required = false,
  input,
  helperText = "",
  error = "",
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
       

        {input}
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
