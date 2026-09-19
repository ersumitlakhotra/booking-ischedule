const colors = {
  green: "bg-green-500",
  red: "bg-red-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-500",
  purple: "bg-purple-500",
  violet: "bg-violet-500",
  orange: "bg-orange-500",
  pink: "bg-pink-500",
  gray: "bg-gray-400",
  sky: "bg-sky-400",
};

export const Badge=({
  text,
  color = "green",
  className = "",
}) => {
  return (
    <span className={`inline-flex items-center gap-2 text-sm  text-gray-700 ${className}`} >
      <span className={`h-2.5 w-2.5 rounded-full ${colors[color] || colors.green}`} />
      {text}
    </span>
  );
}

export const TopBadge = ({
  text,
  isVisible = true,
  color = "green",
  className = "",
}) => {
  return (
    isVisible && <span
      className={`
                absolute -top-0.5 right-1
                w-[10px] h-[10px]
                flex items-center justify-center
                rounded-full
               ${colors[color] || colors.green}
                text-white
                text-[9px]
                font-semibold
                border-2 border-white
                ${className}
            `}
    >
      {text}
    </span>  
  );
}