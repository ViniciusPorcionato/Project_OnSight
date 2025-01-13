"use client"
import { useState } from "react";
export const ExpandableText = ({ text, maxLength = 50, haveMarginLeft = true }) => {
    const [isExpanded, setIsExpanded] = useState(false);
  
    if (text.length <= maxLength) {
      return (
        <p className="font-nunito-light text-[#142937]">
          {text}
        </p>
      );
    }
  
    return (
      <div>
        <p className={`font-nunito-light text-[#142937] ${haveMarginLeft ? 'ml-2' : 'ml-0'}`}>
          {isExpanded ? text : `${text.slice(0, maxLength)}...`}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2 text-[#142937] hover:underline"
          >
            {isExpanded ? 'Ler menos' : 'Ler mais'}
          </button>
        </p>
      </div>
    );
  };