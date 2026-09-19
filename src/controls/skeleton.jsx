export const Skeleton = ({ rows = 5, height = "h-4" }) => {
  return (
    <div className="w-full space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className={`relative w-full overflow-hidden rounded-md bg-gray-200 ${height}`}
        >
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        </div>
      ))}
    </div>
  );
};
