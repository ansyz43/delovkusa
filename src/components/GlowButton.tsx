import React from "react";

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: "default" | "lg";
}

const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  onClick,
  className = "",
  size = "lg",
}) => {
  const sizeClasses = size === "lg" ? "px-10 py-6 text-lg" : "px-6 py-3 text-base";

  return (
    <button
      onClick={onClick}
      className={`relative group inline-flex items-center justify-center font-medium rounded-full text-white overflow-hidden transition-all duration-400 active:scale-[0.97] ${sizeClasses} ${className}`}
    >
      {/* Animated gradient border */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-[length:200%_100%] animate-glow-border" />
      {/* Inner background */}
      <span className="absolute inset-[2px] rounded-full bg-pink-600 group-hover:bg-pink-700 transition-colors duration-300" />
      {/* Content */}
      <span className="relative flex items-center gap-2">
        {children}
      </span>
      {/* Glow effect */}
      <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_30px_rgba(236,72,153,0.5)]" />
    </button>
  );
};

export default GlowButton;
