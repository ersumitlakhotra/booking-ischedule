import { useState } from "react";
import { createPortal } from "react-dom";
import { Avatar } from "./avatar.jsx";
import { ImageOff } from "lucide-react";

export const Image = ({
  src,
  name = "Sumit Kumar",
  alt = "",
  className = "border-4 border-white shadow-xl",
  width = "w-20",
  height = "h-20",
  rounded = "rounded-full",
  preview = true,
  previewClassName = "",
  avatar = true,
  offimage=true,
  onClick
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = (e) => {
    if (!preview || !src) return;

    e.stopPropagation();
    setOpen(true);
  };

  return (
    <>
      {/* Avatar or Image */}
      {src ? (
        <img
          src={src}
          alt={alt}
          onClick={(e) => { e.stopPropagation(); preview ? handleOpen?.(e) : onClick?.(e) }}  // onClick?.(e);
          className={`
            ${width}
            ${height}
            ${rounded}
            ${className}
            object-cover
            ${preview ? "cursor-zoom-in hover:scale-105" : ""}
            transition-transform duration-200 cursor-pointer
          `}
        />
      ) : offimage &&(
        !avatar ?
            <div
              className={`
        ${width}
        ${height}
        ${rounded}
        ${className}
        bg-gray-100
        flex items-center justify-center
      `}
            >
              <ImageOff size={36} className="text-gray-400" />
            </div>
          :
          <Avatar
            name={name}
            size={`${width} ${height}`}
            className={`
            ${rounded}
            ${className}
            cursor-pointer
            hover:scale-105
            transition-transform duration-200
          `}
            onClick={onClick}
          />
      )}

      {/* Preview */}
      {preview &&
        src &&
        open &&
        createPortal(
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-6"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              className="absolute top-6 right-6 text-white text-5xl leading-none hover:text-gray-300"
            >
              ×
            </button>

            <img
              src={src}
              alt={alt}
              onClick={(e) => e.stopPropagation()}
              className={`
                max-w-[95vw]
                max-h-[95vh]
                object-contain
                rounded-xl
                shadow-2xl
                animate-scale
                ${previewClassName}
              `}
            />
          </div>,
          document.body
        )}
    </>
  );
};