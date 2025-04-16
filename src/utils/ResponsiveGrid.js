import React from 'react';

export const ResponsiveGrid = ({
  children,
  cols = {
    default: 1,
    sm: 2,
    md: 3,
    lg: 4
  },
  gap = 'gap-4 sm:gap-6 lg:gap-8',
  className = ""
}) => {
  // Build the grid template columns classes dynamically
  const colClasses = [];

  if (cols.default) colClasses.push(`grid-cols-${cols.default}`);
  if (cols.xs) colClasses.push(`xs:grid-cols-${cols.xs}`);
  if (cols.sm) colClasses.push(`sm:grid-cols-${cols.sm}`);
  if (cols.md) colClasses.push(`md:grid-cols-${cols.md}`);
  if (cols.lg) colClasses.push(`lg:grid-cols-${cols.lg}`);
  if (cols.xl) colClasses.push(`xl:grid-cols-${cols.xl}`);

  const gridColClass = colClasses.join(' ');

  return (
    <div className={`grid ${gridColClass} ${gap} ${className}`}>
      {children}
    </div>
  );
};
