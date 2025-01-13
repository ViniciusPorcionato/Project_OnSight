import React from 'react';

export const ContactCard = ({ title, description, contactInfo }) => (
  <div className="w-[776px] h-[410px] bg-gradient-to-b from-[#03558c] to-[#124262] rounded-[15px] flex flex-col items-center justify-center text-center">
    <div className="w-[518px] h-[57px] text-[#f1f1f1] text-[40px] font-extrabold font-['Nunito'] leading-[64px]">
      {title}
    </div>
    <div className="w-[684px] h-[151px] text-[#f1f1f1] text-xl font-normal font-['Nunito']">
      {description}
    </div>
    <div className="w-[684px] h-[47.39px] text-[#f1f1f1] text-2xl font-bold font-['Nunito']">
      {contactInfo}
    </div>
  </div>
);

