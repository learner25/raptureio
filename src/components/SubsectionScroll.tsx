import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SubsectionScrollProps {
  sections: {
    title: string;
    description: string;
  }[];
  activeIndex: number;
  onSectionChange?: (index: number) => void;
  className?: string;
}

export default function SubsectionScroll({
  sections,
  activeIndex,
  onSectionChange,
  className = "",
}: SubsectionScrollProps) {
  const [currentIndex, setCurrentIndex] = useState(activeIndex || 0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update internal state when prop changes
  useEffect(() => {
    setCurrentIndex(activeIndex);
  }, [activeIndex]);

  // Handle mouse wheel events
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (
        containerRef.current &&
        containerRef.current.contains(e.target as Node)
      ) {
        e.preventDefault();
        const direction = e.deltaY > 0 ? 1 : -1;
        const newIndex = currentIndex + direction;
        if (newIndex >= 0 && newIndex < sections.length) {
          setCurrentIndex(newIndex);
          if (onSectionChange) {
            onSectionChange(newIndex);
          }
        }
      }
    };

    // Add event listener
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel as EventListener, {
        passive: false,
      });
    }

    // Clean up
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel as EventListener);
      }
    };
  }, [currentIndex, sections.length, onSectionChange]);

  const handleSectionChange = (index: number) => {
    if (index >= 0 && index < sections.length) {
      setCurrentIndex(index);
      if (onSectionChange) {
        onSectionChange(index);
      }
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Navigation indicators */}
      <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
        {sections.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${index === currentIndex ? "bg-white h-4" : "bg-white/40"}`}
            onClick={() => handleSectionChange(index)}
          />
        ))}
      </div>

      {/* Content */}
      <div className="overflow-hidden h-full">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full transition-all duration-700 ${
              index === currentIndex
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8 pointer-events-none"
            }`}
          >
            <h2 className="text-2xl font-bold mb-2 text-white">
              {section.title}
            </h2>
            <p className="text-sm text-white/90">{section.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
