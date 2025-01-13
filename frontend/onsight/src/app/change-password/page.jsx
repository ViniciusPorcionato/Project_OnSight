"use client";

import Image from "next/image";
import { useState } from "react";
import {InputPassword} from "@/components/Inputs";
import { ButtonAzul, ButtonCancelar } from "@/components/Buttons";
import { FundoAzul } from "@/components/FundoAzul";
import { DivBranca } from "@/components/DivBranca";
import Logo from "@/components/Logo";

const ChangePassword = () => {

    const [senha, setSenha] = useState("");
    const [novaSenha, setNovaSenha] = useState("");

    return (
        <FundoAzul>
            <DivBranca>
                <Logo/>
                <div className="pt-3 gap-4 grid py-2 w-full max-w-xs mx-auto sm:max-w-sm md:max-w-md lg:max-w-lg">
                    <h1 className="text-[25px] font-bold text-black text-center font-nunito-bold">Mudar Senha</h1>
                    <p className="text-[12px] text-black text-center font-nunito-bold">
                        Insira uma nova senha
                    </p>
                    <InputPassword
                        type="password"
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        additionalClasses={"font-nunito text-[#124262]"}
                    />
                    <InputPassword
                        type="password"
                        placeholder="Confirmar senha"
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        additionalClasses={"font-nunito text-[#124262]"}
                    />
                    <ButtonAzul text="Confirmar" />
                    <p className="text-center text-gray-600">
                        <ButtonCancelar text="Cancelar" />
                    </p>
                </div>
            </DivBranca>
        </FundoAzul>
    );
}

export default ChangePassword;
