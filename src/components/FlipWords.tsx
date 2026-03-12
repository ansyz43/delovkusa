import React, { useState, useEffect, useCallback } from "react";

interface FlipWordsProps {
  words: string[];
  duration?: number;
  className?: string;
}

const FlipWords: React.FC<FlipWordsProps> = ({
  words,
  duration = 3000,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
      setIsAnimating(false);
    }, 400);
  }, [words.length]);

  useEffect(() => {
    const interval = setInterval(startAnimation, duration);
    return () => clearInterval(interval);
  }, [startAnimation, duration]);

  return (
    <span className={`inline-block relative ${className}`}>
      <span
        className="inline-block transition-all duration-400 ease-in-out"
        style={{
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating ? "translateY(-12px)" : "translateY(0)",
          filter: isAnimating ? "blur(4px)" : "blur(0)",
        }}
      >
        {words[currentIndex]}
      </span>
    </span>
  );
};

export default FlipWords;
