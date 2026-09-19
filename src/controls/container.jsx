/**
 * @typedef {"circle" | "square" | "rounded"} Shape
 */

/**
 * @param {Object} props
 * @param {Shape} [props.shape]
 */
export const Container = ({
    className = "",
    shape = 'rounded',
    marginTop=true,
    children,
}) => {
    const shapes = {
        circle:
            "rounded-full",
        square:
            "rounded-none",
        rounded:
            " rounded-3xl",
    };
    return (
        <div
            className={`w-full  mx-auto bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors duration-300
            ${shapes[shape]}
            ${marginTop && 'mt-6'}
            ${className}`}
        >
            {children}
        </div>
    );
};