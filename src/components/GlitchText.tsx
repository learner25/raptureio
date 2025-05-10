import { useState, useEffect } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
}

export default function GlitchText({ text, className = "" }: GlitchTextProps) {
  const [glitchedText, setGlitchedText] = useState(text);

  useEffect(() => {
    const chars = "!<>-_\\ABCDEFGHIJKLMNOPQRSTUVWXYZ/+=";
    let interval: number | null = null;
    let iteration = 0;

    const glitch = () => {
      interval = window.setInterval(() => {
        setGlitchedText((prevText) => {
          return text
            .split("")
            .map((char, index) => {
              if (index < iteration) {
                return text[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");
        });

        if (iteration >= text.length) {
          if (interval) clearInterval(interval);
          iteration = 0;
          setTimeout(glitch, 3000); // Wait before next glitch cycle
        }

        iteration += 1 / 3;
      }, 30);
    };

    glitch();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [text]);

  return (
    <span className={`relative inline-block ${className}`}>
      {glitchedText}
      <span className="absolute top-0 left-0 w-full h-full bg-[#4ecdc4] opacity-0 mix-blend-screen animate-glitch-1"></span>
      <span className="absolute top-0 left-0 w-full h-full bg-[#4ecdc4] opacity-0 mix-blend-multiply animate-glitch-2"></span>
    </span>
  );
}
