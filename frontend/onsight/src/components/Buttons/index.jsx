"use client"

import React, { useState } from "react";
import { FaPaperPlane, FaPlus } from "react-icons/fa";
import { TextButton } from "../Texts";
import { buttonVariants } from "../ui/button";
import { Eye, ImagePlus } from "lucide-react";

export const ButtonAzul = ({ text, onClick, ...rest }) => {
  return (
    <div className="w-full flex justify-center">
      <button
        className="w-full max-w-[400px] h-auto p-3 bg-gradient-to-b transition-all from-[#03558c] to-[#124262] hover:from-[#124262] hover:to-[#124262] rounded-lg text-white font-nunito-bold"
        onClick={onClick}
        { ...rest }
      >
        {text}
      </button>
    </div>
  );
};


export const ButtonCancelar = ({ text, ...props }) => {
  return (
    <button type="button" className="text-[16px] text-[#124262] font-nunito-bold" { ...props }>
      Cancelar
    </button>
  );
};

export const ButtonAddUser = (props) => {
  return (
    <button
      onClick={props.onClick}
      className="transition-all scale-100 hover:scale-[1.02] bg-gradient-to-t from-[#124262] to-[#03558C] hover:from-[#124262] hover:to-[#144b70] text-white w-[25%] h-auto px-4 py-2 rounded-md flex items-center justify-center space-x-2"
    >
      <FaPlus />{" "}
      <TextButton additionalClasses="md:text-[18px] max-sm:text-[10px]">
        Novo Usuário
      </TextButton>
    </button>
  );
};

export const ToggleButton = () => {
  const [isToggled, setIsToggled] = useState(false);

  const toggleButton = () => {
    setIsToggled(!isToggled);
  };

  return (
    <button
      onClick={toggleButton}
      className={`w-8 h-5 rounded-full border-2 ${
        isToggled ? "bg-[#142937]" : "bg-white"
      } border-[#142937] relative transition-colors duration-200 ease-in-out`}
    >
      <div
        className={`w-3 h-3 rounded-full bg-[#142937] absolute top-1 left-1 transition-transform duration-200 ease-in-out ${
          isToggled ? "transform translate-x-3" : ""
        }`}
      ></div>
    </button>
  );
};

export const GradientButton = () => {
  return (
    <button className="flex items-center justify-center w-[468px] h-[61.48px] bg-gradient-to-b from-[#03558c] to-[#124262] rounded-[10px] gap-2">
      <FaPaperPlane className="text-white text-[22px]" />
      <span className="text-white text-xl font-bold font-nunito">
        Enviar
      </span>
    </button>
  );
};
