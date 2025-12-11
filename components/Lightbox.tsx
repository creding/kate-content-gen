import React, { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Button, cn } from "./ui";

interface LightboxProps {
  images: { src: string; label: string }[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}) => {
  const currentImage = images[currentIndex];
  const hasMultiple = images.length > 1;

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && hasMultiple) onNext();
      if (e.key === "ArrowLeft" && hasMultiple) onPrev();
    },
    [onClose, onNext, onPrev, hasMultiple]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  const handleDownload = async () => {
    try {
      const response = await fetch(currentImage.src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${currentImage.label
        .toLowerCase()
        .replace(/\s/g, "-")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Fixed top-right controls */}
      <div className="fixed top-6 right-6 z-20 flex items-center gap-3">
        <button
          onClick={handleDownload}
          className="w-10 h-10 rounded-full bg-card hover:bg-card/90 flex items-center justify-center transition-colors shadow-lg"
          title="Download"
        >
          <Download className="w-4 h-4 text-foreground" />
        </button>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 flex items-center justify-center transition-colors"
          title="Close (Esc)"
        >
          <X className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center max-w-[90vw] max-h-[90vh]">
        {/* Image label */}
        <div className="absolute -top-10 left-0 right-0 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <span className="text-primary-foreground/80 text-sm font-medium">
              {currentImage.label}
            </span>
            {hasMultiple && (
              <span className="text-primary-foreground/50 text-sm">
                ({currentIndex + 1} / {images.length})
              </span>
            )}
          </div>
        </div>

        {/* Image */}
        <img
          src={currentImage.src}
          alt={currentImage.label}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
        />

        {/* Navigation arrows */}
        {hasMultiple && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-primary-foreground" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-primary-foreground" />
            </button>
          </>
        )}

        {/* Dots indicator */}
        {hasMultiple && (
          <div className="absolute -bottom-10 flex items-center gap-2">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  idx === currentIndex
                    ? "bg-primary-foreground"
                    : "bg-primary-foreground/30"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Lightbox;
