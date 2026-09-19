import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const CustomTable = ({
  headers = [],
  data = [],
  defaultRowsPerPage = 10,
  className
}) => {
 // const {isLoading} = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const startIndex = (page - 1) * rowsPerPage;
  const currentRows = data.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handleRowsChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  return (
    <div className={`rounded-3xl overflow-hidden border bg-white border-gray-200 dark:bg-slate-900 dark:border-slate-700
    ${className}
    `}>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">

          {/* Header */}
          <thead className="text-left text-sm bg-gray-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="px-6 py-4">
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="text-xs text-gray-700 dark:text-gray-200">
            {isLoading
              ? Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-t border-gray-200 dark:border-slate-700"
                >
                  {headers.map((_, colIndex) => (
                    <td key={colIndex} className="px-6 py-5">
                      <div className="h-4 w-full rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
              : currentRows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-t border-gray-200 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800 transition"
                >
                  {headers.map((header, colIndex) => (
                    <td key={colIndex} className="px-6 py-5">
                      {header.render
                        ? header.render(row)
                        : row[header.key]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-4 border-t border-gray-200 dark:border-slate-700">

        {/* Rows Per Page */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">
            Rows per page
          </span>

          <select
            value={rowsPerPage}
            onChange={handleRowsChange}
            className="h-10 px-3 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 outline-none"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-4">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages || 1}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="w-10 h-10 rounded-xl border flex items-center justify-center disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={() =>
                setPage((p) =>
                  Math.min(p + 1, totalPages)
                )
              }
              disabled={page === totalPages || totalPages === 0}
              className="w-10 h-10 rounded-xl border flex items-center justify-center disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};