export const DateTime = ({
  type = "time", // "date" | "time"
  label,
  sublabel,
  value,
  setValue,
  placeholder = "",
  required = false,
  disabled = false,
  helperText = "",
  error,
  min,
  max,
  className = "",
  classLabel= ""
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className={`mb-2 flex items-center gap-1 text-sm font-semibold text-gray-700 ${classLabel}`}>
          {label}
          {type === "date" && (
            <span className="text-xs font-normal text-gray-500">{`(mm/dd/yyyy)`}</span>
          )}
          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      <input
        type={type}
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        className={`
          w-full rounded-xl border border-gray-300 bg-white
          px-4 py-2.5 text-sm text-gray-700
          outline-none transition-all duration-200
          focus:border-blue-500 focus:ring-4 focus:ring-blue-100
          disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400
          ${className}
        `}
      />

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