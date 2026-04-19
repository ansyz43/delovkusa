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

  // Find the longest word to reserve space and prevent layout shift
  const longestWord = words.reduce((a, b) => (a.length > b.length ? a : b), "");

  return (
    <span className={`inline-block relative ${className}`}>
      {/* Invisible spacer — reserves width of the longest word */}
      <span className="invisible whitespace-nowrap" aria-hidden="true">
        {longestWord}
      </span>
      {/* Visible animated word, positioned absolutely so it doesn't affect layout */}
      <span
        className="absolute inset-0 inline-flex items-center justify-center transition-all duration-400 ease-in-out"
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
