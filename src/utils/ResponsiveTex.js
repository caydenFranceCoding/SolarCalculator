import React from 'react';

export const ResponsiveText = ({
  children,
  as: Component = 'p',
  size = "base", // xxs, xs, sm, base, lg, xl, 2xl, 3xl, 4xl
  className = ""
}) => {
  // Size mapping for responsive text
  const sizeClasses = {
    xxs: "text-xxs xs:text-xs",
    xs: "text-xs sm:text-sm",
    sm: "text-sm sm:text-base",
    base: "text-base sm:text-lg",
    lg: "text-lg sm:text-xl",
    xl: "text-xl sm:text-2xl",
    "2xl": "text-2xl sm:text-3xl",
    "3xl": "text-3xl sm:text-4xl",
    "4xl": "text-3xl sm:text-4xl md:text-5xl",
  };

  return (
    <Component className={`${sizeClasses[size]} ${className}`}>
      {children}
    </Component>
  );
};