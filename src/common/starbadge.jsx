const getBadgeStyle = (name) => {
  const badgeName = name ===''?'default': name;
  switch (badgeName.toLowerCase()) {
    case "bronze":
      return {
        gradient: "from-amber-700 to-amber-500",
        border: "border-amber-600",
        glow: "shadow-amber-500/40",
      };
    case "silver":
      return {
        gradient: "from-gray-400 to-gray-200",
        border: "border-gray-400",
        glow: "shadow-gray-400/40",
      };
    case "gold":
      return {
        gradient: "from-yellow-400 to-yellow-200",
        border: "border-yellow-400",
        glow: "shadow-yellow-400/50",
      };
    case "platinum":
      return {
        gradient: "from-blue-400 to-blue-200",
        border: "border-blue-400",
        glow: "shadow-blue-400/40",
      };
    default:
      return {
        gradient: "from-blue-400 to-blue-200",
        border: "border-blue-400",
        glow: "shadow-blue-400/40",
      };
  }
};

const sizeClasses = {
  xs: {
    outer: "w-8 h-8",
    inner: "w-5 h-5",
    star: "text-xs",
    text: "text-[4px]",
    border: "border-2",
  },  
  sm: {
    outer: "w-11 h-11",
    inner: "w-7 h-7",
    star: "text-sm",
    text: "text-[6px]",
    border: "border-2",
  },
  md: {
    outer: "w-24 h-24",
    inner: "w-16 h-16",
    star: "text-3xl",
    text: "text-sm",
    border: "border-4",
  },
  lg: {
    outer: "w-32 h-32",
    inner: "w-20 h-20",
    star: "text-5xl",
    text: "text-base",
    border: "border-4",
  },
};

export const StarBadge = ({ name, size = "md" }) => {
  const style = getBadgeStyle(name);
  const s = sizeClasses[size] || sizeClasses.md;
  const initial = name.charAt(0).toUpperCase();

  return (
    name !=='' && <div className="flex items-center justify-center">
      {/* Outer Circle */}
      <div
        className={`relative ${s.outer} rounded-full ${s.border} ${style.border} flex items-center justify-center ${style.glow} shadow-lg`}
      >
        {/* Inner Circle */}
        <div
          className={`${s.inner} rounded-full bg-gradient-to-br ${style.gradient} flex items-center justify-center relative`}
        >
          {/* Star */}
          <div className={`text-white ${s.star} drop-shadow-md`}>
            ★
          </div>

          {/* Initial */}
          <span className={`absolute text-white font-bold ${s.text}`}>
            {initial}
          </span>
        </div>
      </div>
    </div>
  );
};

