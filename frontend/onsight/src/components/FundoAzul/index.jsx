import React from 'react';

export const FundoAzul = ({ children }) => {
  return (
    <main className="flex items-center justify-center min-h-screen w-full bg-white sm:bg-gradient-to-t from-[#142937] to-[#124262]">
      {children}
    </main>
  );
};

