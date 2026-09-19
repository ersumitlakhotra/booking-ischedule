import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { EllipsisVertical } from "lucide-react";

export const ModalPortal = ({
    width = "w-32",
    placement = "bottom-right",
    trigger,
    children,
    offset = 8,
}) => {

    const [open, setOpen] = useState(false);

    const buttonRef = useRef(null);
    const menuRef = useRef(null);

    const [position, setPosition] = useState({
        top: 0,
        left: 0,
    });


    // ----------------------------------------
    // Calculate menu position
    // ----------------------------------------
    const updatePosition = () => {

        if (!buttonRef.current || !menuRef.current) return;

        const button = buttonRef.current.getBoundingClientRect();
        const menu = menuRef.current.getBoundingClientRect();

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let top = 0;
        let left = 0;


        // ----------------------------------------
        // Requested placement
        // ----------------------------------------

        switch (placement) {

            case "bottom-left":
                top = button.bottom + offset;
                left = button.left;
                break;


            case "bottom-right":
                top = button.bottom + offset;
                left = button.right - menu.width;
                break;


            case "top-left":
                top = button.top - menu.height - offset;
                left = button.left;
                break;


            case "top-right":
                top = button.top - menu.height - offset;
                left = button.right - menu.width;
                break;


            case "left":
                top = button.top;
                left = button.left - menu.width - offset;
                break;


            case "right":
                top = button.top;
                left = button.right + offset;
                break;


            default:
                top = button.bottom + offset;
                left = button.right - menu.width;
                break;
        }


        // ----------------------------------------
        // Keep menu inside horizontal viewport
        // ----------------------------------------

        const padding = 8;

        if (left + menu.width > viewportWidth - padding) {
            left = viewportWidth - menu.width - padding;
        }

        if (left < padding) {
            left = padding;
        }


        // ----------------------------------------
        // Keep menu inside vertical viewport
        // ----------------------------------------

        if (top + menu.height > viewportHeight - padding) {

            // Try opening above the button
            const topPosition =
                button.top - menu.height - offset;

            if (topPosition >= padding) {
                top = topPosition;
            } else {
                top = viewportHeight - menu.height - padding;
            }
        }


        if (top < padding) {
            top = padding;
        }


        setPosition({
            top,
            left,
        });
    };


    // ----------------------------------------
    // Close when clicking outside
    // ----------------------------------------
    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };


        const handleEscape = (event) => {

            if (event.key === "Escape") {
                setOpen(false);
            }
        };


        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        document.addEventListener(
            "keydown",
            handleEscape
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };

    }, []);


    // ----------------------------------------
    // Position menu after it is rendered
    // ----------------------------------------
    useEffect(() => {

        if (!open) return;


        const positionMenu = () => {
            requestAnimationFrame(() => {
                updatePosition();
            });
        };


        positionMenu();


        window.addEventListener(
            "resize",
            positionMenu
        );

        window.addEventListener(
            "scroll",
            positionMenu,
            true
        );


        return () => {

            window.removeEventListener(
                "resize",
                positionMenu
            );

            window.removeEventListener(
                "scroll",
                positionMenu,
                true
            );
        };

    }, [open, placement, width]);


    // ----------------------------------------
    // Trigger click
    // ----------------------------------------
    const handleClick = (event) => {

        event.stopPropagation();

        setOpen((previous) => !previous);
    };


    return (
        <>
            {/* Trigger */}
            <div className="inline-block">

                {trigger ? (

                    trigger({
                        ref: buttonRef,
                        onClick: handleClick,
                    })

                ) : (

                    <button
                        ref={buttonRef}
                        onClick={handleClick}
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

                )}

            </div>


            {/* Portal Menu */}
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
                            top: position.top,
                            left: position.left,
                        }}
                    >

                        <div className="py-2">
                            {children}
                        </div>

                    </div>,

                    document.body
                )}
        </>
    );
};