import {Search} from "lucide-react";

export const SearchInput = ({
  placeholder="Search...",
  className = "",
  ...props
}) => {
    return (
        <div className={`flex items-center rounded-xl px-4 h-12 w-full transition border border-gray-200 bg-white dark:bg-gray-800 dark:border-none
         ${className}`} >
            <Search size={18} className="text-gray-400" />
            <input
                type="text"
                {...props}
                placeholder={placeholder}
                className={`bg-transparent outline-none border-none w-full px-3 text-sm text-gray-700 dark:text-gray-100`}
            />
        </div>
    )
}