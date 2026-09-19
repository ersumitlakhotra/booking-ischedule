export const Avatar=({
  name = "Sumit Kumar",
  size = "w-20 h-20",
  className = "",
  onClick
}) => {
  const initials = (name || "")
    .trim()
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      className={`
        ${size}
        rounded-full
        bg-cyan-400
        text-white
        flex
        items-center
        justify-center
        font-bold
        text-2xl
        select-none
        ${className}
      `}

      onClick={(e)=> {e.stopPropagation(); onClick?.(e);}}
    >
      {initials}
    </div>
  );
}