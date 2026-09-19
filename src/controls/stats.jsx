import { ChevronRight } from "lucide-react";

const colorStyles = {
  sky: {
    accent: "bg-sky-500",
    icon: "bg-sky-100 text-sky-600",
    trend: "bg-sky-50 text-sky-700",
    bg: "bg-sky-600",
  },
  green: {
    accent: "bg-green-500",
    bg: "bg-green-600",
    icon: "bg-green-100 text-green-600",
    trend: "bg-green-50 text-green-700",
  },
  amber: {
    accent: "bg-amber-500",
    bg: "bg-amber-500",
    icon: "bg-amber-100 text-amber-600",
    trend: "bg-amber-50 text-amber-700",
  },
  red: {
    accent: "bg-red-500",
    bg: "bg-red-600",
    icon: "bg-red-100 text-red-600",
    trend: "bg-red-50 text-red-700",
  },
  gray: {
    accent: "bg-gray-500",
    bg: "bg-gray-700",
    icon: "bg-gray-100 text-gray-600",
    trend: "bg-gray-100 text-gray-700",
  },
  violet: {
    accent: "bg-violet-500",
    bg: "bg-violet-700",
    icon: "bg-violet-100 text-violet-600",
    trend: "bg-violet-100 text-violet-700",
  },
};

export const Stats = ({
  title,
  value,
  description,
  icon: Icon,
  color = "sky",
  cursor_pointer=true,
  active = false,
  onClick,
}) => {
  const c = colorStyles[color];

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border border-gray-200 bg-white ${cursor_pointer && 'cursor-pointer'} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
    >

      {/* Animated Background */}
      <div
    className={`
        absolute inset-0 z-0 origin-top-left
        transition-transform duration-700 ease-in-out
        ${c.bg}
        ${active ? "scale-100" : "scale-0"}
    `}
 />

      {/* Content */}
      <div className="relative z-10 p-6">

        <div className="flex justify-between">

          <div>

            <p className={`text-sm font-medium transition-colors duration-300 ${active ? "text-white/80" : "text-gray-500"
              }`}>
              {title}
            </p>

            <h2 className={`mt-2 text-4xl font-bold transition-colors duration-300 ${active ? "text-white" : "text-gray-900"
              }`}>
              {value}
            </h2>

            {description && (
              <p className={`mt-2 text-sm transition-colors duration-300 ${active ? "text-white/80" : "text-gray-500"
                }`}>
                {description}
              </p>
            )}

          </div>

          <div
            className={`
                    flex h-14 w-14 items-center justify-center rounded-2xl
                    transition-all duration-500
                    ${active
                ? "bg-white/20 text-white"
                : c.icon
              }
                `}
          >
            {Icon && <Icon size={28} />}
          </div>

        </div>

      </div>

    </div>
  );
}