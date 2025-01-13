import React from 'react';
import Image from 'next/image';

const Logo = () => {
  return (
    <div className="flex justify-center w-full py-4">
      <Image 
        src="/images/Logo.svg" 
        alt="OnSight Logo" 
        width={160} 
        height={90} 
        layout="fixed"
      />
    </div>
  );
};

export default Logo;
