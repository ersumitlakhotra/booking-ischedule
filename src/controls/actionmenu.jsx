import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { EllipsisVertical } from "lucide-react";
import { ButtonPermission } from "../auth/protectedButton.js";

export const ActionMenu = ({
    actions = [],
    width = "w-32",
    placement = "bottom-right",
}) => {
    const [open, setOpen] = useState(false);

    const buttonRef = useRef(null);
    const menuRef = useRef(null);

    const [position, setPosition] = useState({
        top: 0,
        left: 0,
    });

    const updatePosition = () => {
        if (!buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();

        const menuWidth =
            width === "w-32"
                ? 128
                : width === "w-40"
                    ? 160
                    : width === "w-48"
                        ? 192
                        : 160;

        let top = rect.bottom + 8;
        let left = rect.right - menuWidth;

        switch (placement) {
            case "bottom-left":
                left = rect.left;
                break;

            case "top-right":
                top = rect.top;
                left = rect.right - menuWidth;
                break;

            case "top-left":
                top = rect.top;
                left = rect.left;
                break;

            case "left":
                top = rect.top;
                left = rect.left - menuWidth - 8;
                break;

            case "right":
                top = rect.top;
                left = rect.right + 8;
                break;

            default:
                break;
        }

        setPosition({
            top,
            left,
        });
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    useEffect(() => {
        if (!open) return;

        updatePosition();

        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, true);

        return () => {
            window.removeEventListener(
                "resize",
                updatePosition
            );
            window.removeEventListener(
                "scroll",
                updatePosition,
                true
            );
        };
    }, [open, placement]);

    return (
        <>
            <div className="inline-block">
                <button
                    ref={buttonRef}
                    onClick={(e) => {
                        e.stopPropagation();

                        if (!open) {
                            updatePosition();
                        }

                        setOpen((prev) => !prev);
                    }}
                    className="
                        h-9
                        w-9
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        border
                        border-transparent
                        hover:border-slate-200
                        hover:bg-slate-100
                        transition-all
                        duration-200
                    "
                >
                    <EllipsisVertical size={18} />
                </button>
            </div>
            {open &&
                createPortal(
                    <div
                        ref={menuRef}
                        className={`
                            fixed
                            z-[9999]
                            ${width}
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            shadow-xl
                            shadow-slate-900/10
                            overflow-hidden
                            animate-in
                            fade-in
                            zoom-in-95
                            duration-150
                        `}
                        style={{
                            top:
                                placement.startsWith("top") &&
                                    menuRef.current
                                    ? position.top -
                                    menuRef.current.offsetHeight -
                                    8
                                    : position.top,
                            left: position.left,
                        }}
                    >
                        <div className="py-2">
                            {actions.map((action, index) => {
                                if (action.divider) {
                                    return (
                                        <div
                                            key={index}
                                            className="my-2 border-t border-slate-200"
                                        />
                                    );
                                }

                                const Icon = action.icon;

                                return (
                                    <ButtonPermission
                                        key={index}
                                        permission={action.permission}
                                    >
                                        <button
                                            disabled={action.disabled}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpen(false);
                                                action.onClick?.();
                                            }}
                                            className={`
                                                w-full
                                                flex
                                                items-center
                                                justify-between
                                                px-4
                                                py-2
                                                text-sm
                                                transition-colors

                                                ${action.danger
                                                    ? "text-red-600 hover:bg-red-50"
                                                    : "text-slate-700 hover:bg-slate-100"
                                                }

                                                ${action.disabled
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                                }
                                            `}
                                        >
                                            <div className="flex items-center gap-3 text-xs">
                                                {Icon && (
                                                    <Icon
                                                        size={18}
                                                        strokeWidth={2}
                                                    />
                                                )}

                                                <span className="font-medium">
                                                    {action.label}
                                                </span>
                                            </div>

                                            {action.shortcut && (
                                                <span className="text-xs text-slate-400">
                                                    {action.shortcut}
                                                </span>
                                            )}
                                        </button>
                                    </ButtonPermission>
                                );
                            })}
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
};