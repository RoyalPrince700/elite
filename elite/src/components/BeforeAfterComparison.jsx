import React, { useState, useRef, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const BeforeAfterComparison = ({ beforeImage, afterImage, altText }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMove = (clientX) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      const clampedPercentage = Math.max(0, Math.min(100, percentage));

      setSliderPosition(clampedPercentage);
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchend", handleTouchEnd);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-full h-[calc(100vw*9/7)] sm:h-[calc(100vw*9/7)] md:h-96 lg:h-[450px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white z-10"
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
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
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt={`${altText} - Before`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Slider Control with Glow Effect */}
      <div
        className={`absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center transition-all duration-300 ${
          isDragging ? "shadow-[0_0_15px_5px_rgba(59,130,246,0.7)] scale-110" : ""
        }`}
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center border border-gray-200">
          <FiChevronLeft className="text-gray-700 text-lg" />
          <FiChevronRight className="text-gray-700 text-lg" />
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-blue-800/90 text-white px-3 py-1.5 rounded-md text-sm font-medium">
        Before
      </div>
      <div className="absolute top-4 right-4 bg-amber-600/90 text-white px-3 py-1.5 rounded-md text-sm font-medium">
        After
      </div>

      {/* Instruction text */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-white bg-black/40 inline-block px-3 py-1 rounded-full text-xs font-medium">
          Drag to compare
        </p>
      </div>
    </div>
  );
};

export default BeforeAfterComparison;