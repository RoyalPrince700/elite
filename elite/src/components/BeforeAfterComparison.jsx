import React, { useState, useRef, useCallback, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const BeforeAfterComparison = ({ beforeImage, afterImage, altText }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const positionRef = useRef(50); // Keep immediate position reference for instant updates

  const updateSliderPosition = useCallback((clientX) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));

    // Update ref immediately for instant visual feedback
    positionRef.current = clampedPercentage;

    // Only update state if there's a meaningful change to avoid unnecessary re-renders
    setSliderPosition(prev => {
      if (Math.abs(prev - clampedPercentage) > 0.1) {
        return clampedPercentage;
      }
      return prev;
    });
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    e.preventDefault();
    // Update immediately without animation frame delay
    updateSliderPosition(e.clientX);
  }, [isDragging, updateSliderPosition]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;

    e.preventDefault();
    // Update immediately without animation frame delay
    updateSliderPosition(e.touches[0].clientX);
  }, [isDragging, updateSliderPosition]);

  const handleMouseDown = useCallback((e) => {
    // Only prevent default when actually starting to drag
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleTouchStart = useCallback((e) => {
    // Only prevent default when actually starting to drag
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDragging) {
        handleMouseMove(e);
      }
    };

    const handleGlobalTouchMove = (e) => {
      if (isDragging) {
        handleTouchMove(e);
      }
    };

    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };

    const handleGlobalTouchEnd = () => {
      handleTouchEnd();
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove, { passive: false });
      document.addEventListener("touchmove", handleGlobalTouchMove, { passive: false });
      document.addEventListener("mouseup", handleGlobalMouseUp);
      document.addEventListener("touchend", handleGlobalTouchEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("touchmove", handleGlobalTouchMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("touchend", handleGlobalTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleMouseUp, handleTouchEnd]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-full h-[calc(100vw*9/7)] sm:h-[calc(100vw*9/7)] md:h-96 lg:h-[450px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white z-10 select-none"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{ touchAction: isDragging ? 'none' : 'auto' }}
    >
      {/* After Image */}
      <img
        src={afterImage}
        alt={`${altText} - After`}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Before Image with clip-path */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 ${100 - positionRef.current}% 0 0)`,
          willChange: isDragging ? 'clip-path' : 'auto'
        }}
      >
        <img
          src={beforeImage}
          alt={`${altText} - Before`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Slider Control with Enhanced Visual Feedback */}
      <div
        className={`absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center transition-all duration-200 ${
          isDragging
            ? "shadow-[0_0_20px_8px_rgba(59,130,246,0.8)] scale-125 bg-blue-400"
            : "hover:shadow-[0_0_10px_3px_rgba(59,130,246,0.4)] hover:bg-blue-200"
        }`}
        style={{
          left: `${positionRef.current}%`,
          willChange: isDragging ? 'left' : 'auto'
        }}
      >
        <div
          className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-xl flex items-center justify-center border-2 transition-all duration-200 ${
            isDragging
              ? "border-blue-500 shadow-2xl scale-110"
              : "border-gray-300 hover:border-blue-400 hover:shadow-2xl"
          }`}
        >
          <div className="flex items-center gap-0.5">
            <FiChevronLeft className={`text-lg transition-colors duration-200 ${isDragging ? "text-blue-600" : "text-gray-700"}`} />
            <FiChevronRight className={`text-lg transition-colors duration-200 ${isDragging ? "text-blue-600" : "text-gray-700"}`} />
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-blue-800/90 text-white px-3 py-1.5 rounded-md text-sm font-medium">
        Before
      </div>
      <div className="absolute top-4 right-4 bg-amber-600/90 text-white px-3 py-1.5 rounded-md text-sm font-medium">
        After
      </div>

      {/* Dynamic Instruction text */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className={`inline-block px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
          isDragging
            ? "text-blue-600 bg-white/95 shadow-lg scale-105"
            : "text-white bg-black/60 hover:bg-black/70"
        }`}>
          {isDragging ? "Dragging..." : "Drag to compare"}
        </p>
      </div>
    </div>
  );
};

export default BeforeAfterComparison;