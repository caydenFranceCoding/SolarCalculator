import React from 'react';

export const ResponsiveContainer = ({ children, className = "" }) => (
  <div className={`w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl ${className}`}>
    {children}
  </div>
);