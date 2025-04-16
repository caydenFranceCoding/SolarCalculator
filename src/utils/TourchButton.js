import React from 'react';

export const TouchButton = ({
  children,
  onClick,
  className = "",
  variant = "primary", // primary, secondary, outline, text
}) => {
  // Base classes for touch-friendly sizing
  const baseClasses = "py-3 px-4 rounded font-medium min-h-11 min-w-11 text-center";

  // Variant-specific classes
  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    outline: "border border-blue-500 text-blue-500 hover:bg-blue-50",
    text: "text-blue-500 hover:underline"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
