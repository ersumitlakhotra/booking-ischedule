import { useEffect, useMemo, useRef, useState } from "react";
import { SearchInput } from "./index.jsx";
import { ButtonPermission } from "../auth/protectedButton.js";

export const Select = ({
  label,
  icon: Icon,
  options = [],
  value,
  onChange,
  helperText = "",
  error = "",
  placeholder = "Select",
  placement = "bottom", // "bottom" | "top"
  isSearch = true,
  isAdd = false,
  isMulti = false,
  addLabel = "Add New",
  onAddClick,
  maxVisibleItems = 10,
  itemHeight = 40,
  style,
  Permission = "",
  className = "",
  required=false,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const ref = useRef(null);

  const selected = useMemo(() => {
    if (isMulti) {
      return value || [];
    }

    return options.find((o) => o.value === value);
  }, [options, value, isMulti]);

  const filtered = useMemo(() => {
    let list = options;

    if (isMulti) {
      const selectedIds = (value || []).map((item) => item.value);

      list = list.filter(
        (o) => !selectedIds.includes(o.value)
      );
    }

    if (!search) return list;

    return list.filter((o) =>
      (o.search || o.label || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [options, search, value, isMulti]);

  const dropdownHeight =
    Math.min(filtered.length, maxVisibleItems) * itemHeight;

  const dropdownPosition =
    placement === "top"
      ? "bottom-full -mb-5"
      : "top-full mt-2";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className={`relative w-full ${className}`}
      style={style}
      {...props}
    >
      {/* Label */}
      
      {label && (
        <label className="mb-2 flex items-center gap-1 text-sm font-semibold text-gray-700">
          {label}
          {required && (
            <span className="text-red-500">*</span>
          )}
        </label>
      )}
      {/* Trigger */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-12 w-full cursor-pointer items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {Icon && <Icon size={18} className="text-slate-400 shrink-0" />}

          {isMulti ? (
            selected.length ? (
              <div className="flex flex-wrap gap-2">
                {selected.map((item) => (
                  <div
                    key={item.value}
                    className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm dark:bg-slate-700"
                  >
                    <span>{item.label}</span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();

                        onChange(
                          value.filter((v) => v.value !== item.value)
                        );
                      }}
                      className="text-gray-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-slate-400">{placeholder}</span>
            )
          ) : (
            <span
              className={`truncate ${selected
                ? "text-slate-900 dark:text-white"
                : "text-slate-400"
                }`}
            >
              {selected ? selected.label : placeholder}
            </span>
          )}
        </div>

        <span
          className={`text-gray-400 text-xs transition-transform duration-200 ${open ? "rotate-180" : ""
            }`}
        >
          ▼
        </span>
      </div>
      {(helperText || error) && (
        <p
          className={`mt-1 text-xs ${error ? "text-red-500" : "text-gray-500"
            }`}
        >
          {error || helperText}
        </p>
      )}

      {/* Dropdown */}
      {open && (
        <div className={`absolute left-0 right-0 z-[80] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800 ${dropdownPosition}`}>
          {/* Search */}
          {isSearch && (
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
            />
          )}

          {/* Add Button */}
          <ButtonPermission permission={`${Permission}.Create`} children={
            isAdd && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddClick?.();
                }}
                className="w-full border-b border-gray-200 px-4 py-3 text-left text-sm font-medium transition hover:bg-gray-100 dark:border-slate-700 dark:hover:bg-slate-700"
              >
                + {addLabel}
              </button>
            )} />

          {/* Options */}
          <div
            className="overflow-y-auto"
            style={{
              maxHeight: `${dropdownHeight}px`,
            }}
          >
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <div
                  key={item.value ?? item.id}
                  onClick={() => {
                    if (isMulti) {
                      onChange([
                        ...(value || []),
                        item
                      ]);

                      setSearch("");
                    } else {
                      onChange(item.value);
                      setOpen(false);
                      setSearch("");
                    }
                  }}
                  className={`flex h-10 cursor-pointer items-center px-4 text-sm transition hover:bg-gray-100 dark:hover:bg-slate-700 
                    ${isMulti
                      ? (value || []).some((v) => v.value === item.value)
                        ? "bg-gray-100 font-medium dark:bg-slate-700"
                        : ""
                      : value === item.value
                        ? "bg-gray-100 font-medium dark:bg-slate-700"
                        : ""
                    }`}
                >
                  {item.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-400">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};