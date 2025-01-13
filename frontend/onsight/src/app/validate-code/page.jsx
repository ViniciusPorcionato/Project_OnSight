"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import InputLogin from "@/components/Inputs";
import { ButtonAzul, ButtonCancelar } from "@/components/Buttons";
import {FundoAzul} from "@/components/FundoAzul";
import {DivBranca} from "@/components/DivBranca";
import Logo from "@/components/Logo";

const ValidateCode = () => {
    const [email, setEmail] = useState("nome@email.com");
    const [codigo, setCodigo] = useState("");
    const inputs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    const focusNextInput = (index) => {
        if (index < inputs.length - 1) {
            inputs[index + 1].current.focus();
        }
    };

    const focusPrevInput = (index) => {
        if (index > 0) {
            inputs[index - 1].current.focus();
        }
    };

    return (
        <FundoAzul>
            <DivBranca>
                <Logo />
                <div className="flex flex-col w-full items-center justify-center space-y-6">
                    <div className="w-full text-center">
                        <h1 className="text-[25px] font-bold text-black mb-2">Verifique seu email</h1>
                        <p className="w-full text-[12px] text-black text-center">
                            Digite o código de 4 dígitos enviado para <span className="font-semibold text-[#496BBA]">{email}</span>
                        </p>
                    </div>
                    <div className="flex justify-center space-x-8 pb-2">
                        {[0, 1, 2, 3].map((index) => (
                            <input
                                key={index}
                                ref={inputs[index]}
                                type="text"
                                maxLength="1"
                                className="w-12 h-12 text-center border border-gray-500 rounded-md text-2xl"
                                onChange={(e) => {
                                    const txt = e.target.value;
                                    if (txt === "") {
                                        focusPrevInput(index);
                                    } else {
                                        const newCodigo = [...codigo];
                                        newCodigo[index] = txt;
                                        setCodigo(newCodigo.join(""));
                                        focusNextInput(index);
                                    }
                                }}
                            />
                        ))}
                    </div>
                    <ButtonAzul text="Confirmar" />
                    <div className="">
                        <ButtonCancelar />
                    </div>
                </div>
            </DivBranca>
        </FundoAzul>
    );
};

export default ValidateCode;
