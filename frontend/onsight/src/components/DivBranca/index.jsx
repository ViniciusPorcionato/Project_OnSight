import React from 'react';

export const DivBranca = ({ children }) => {
  return (
    <div className="w-full sm:max-w-[600px] sm:max-h-[600px] h-full min-h-[500px] bg-white p-4 sm:p-8 sm:shadow-lg flex flex-col justify-center items-center sm:rounded-lg">
      {children}
    </div>
  );
};

