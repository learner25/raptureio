import { useRef, useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const items = [
  "Fomosphere",
  "Cuboid",
  "Halo",
  "Helius",
  "Midus",
  "Pompus",
  "Animated",
];

export default function ScrollMenu() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scrollAmount = 200;
      container.scrollLeft += e.deltaY > 0 ? scrollAmount : -scrollAmount;
    };

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const itemWidth = containerWidth / 3;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setActiveIndex(newIndex);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleItemClick = (index: number) => {
    setActiveIndex(index);
    const section = document.querySelector(
      `#section-${items[index].toLowerCase()}`,
    );
    section?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBackClick = () => {
    if (activeIndex > 0) {
      handleItemClick(activeIndex - 1);
    }
  };

  return (
    <div className="relative">
      {activeIndex > 0 && (
        <button
          onClick={handleBackClick}
          className="absolute -left-16 top-1/2 -translate-y-1/2 text-white hover:scale-110 transition-transform"
        >
          <ArrowLeft size={32} />
        </button>
      )}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto scrollbar-hide scroll-smooth"
      >
        <div className="flex items-center min-w-max px-[40vw]">
          {items.map((item, index) => (
            <div
              key={item}
              className="w-[20vw] flex items-center justify-center"
              onClick={() => handleItemClick(index)}
            >
              <span
                className={`font-bold text-white cursor-pointer transition-all duration-300
                  ${index === 0 && activeIndex === 0 ? "text-7xl" : ""}
                  ${index !== 0 && activeIndex === 0 ? "text-6xl" : ""}
                  ${activeIndex !== 0 ? "text-3xl" : ""}
                  ${index === activeIndex ? "opacity-100 scale-110" : "opacity-30 scale-90 blur-[2px]"}`}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
