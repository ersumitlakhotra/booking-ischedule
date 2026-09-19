/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.color]
 */
export const Tags = ({
    title,
    color,
    dot = false,
    className = "",
    size = 'md'
}) => {
    const colors = {
        green: {
            wrapper: "bg-green-50 text-green-700 border-green-200",
            dot: "bg-green-500",
        },
        yellow: {
            wrapper: "bg-yellow-50 text-yellow-700 border-yellow-200",
            dot: "bg-yellow-500",
        },
        red: {
            wrapper: "bg-red-50 text-red-700 border-red-200",
            dot: "bg-red-500",
        },
        purple: {
            wrapper: "bg-purple-50 text-purple-700 border-purple-200",
            dot: "bg-purple-500",
        },
        gray: {
            wrapper: "bg-gray-50 text-gray-700 border-gray-200",
            dot: "bg-gray-500",
        },
        violet: {
            wrapper: "bg-violet-50 text-violet-700 border-violet-200",
            dot: "bg-violet-500",
        },
    };
    const sizeStyles = {
        xs: "px-2 py-0.5 text-[10px] rounded-md gap-1",
        sm: "px-3 py-1 text-[11px] rounded-lg gap-1.5",
        md: "px-4 py-2 text-xs rounded-xl gap-2",
    };

const currentSize = sizeStyles[size] || sizeStyles.md;

    const statusColors = {
        Open: colors.green,
        Active: colors.green,
        InStock: colors.green,
        Purchase: colors.green,
        Working: colors.green,
        Completed: colors.green,
        Paid: colors.green,
        Delivered:colors.green,

        Paused: colors.yellow,
        Usage: colors.yellow,
        Pending: colors.yellow,

        Closed: colors.red,
        Inactive: colors.red,
        NotPosted: colors.red,
        OutStock: colors.red,
        Sell: colors.red,
        DayOff: colors.red,
        Absent: colors.red,
        Rejected: colors.red,
        Cancelled: colors.red,
        NoShow: colors.red,
        Unpaid: colors.red,

        Posted: colors.purple,
        Leave:colors.purple,
        Received:colors.purple,

        Awaiting:colors.gray,
    };

    // Use explicit color if provided, otherwise use title
    const current =
        color
            ? colors[color] || colors.green
            : statusColors[title] || colors.green;

    return (
           <span
        className={`inline-flex items-center font-semibold border ${current.wrapper} ${currentSize} ${className}`}
    >
            {dot && (
                <span className={`w-2 h-2 rounded-full ${current.dot}`} />
            )}
            {title}
        </span>
    );
};