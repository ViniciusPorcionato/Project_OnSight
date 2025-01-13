"use client";

import React, { useState } from 'react';
import Logo from '@/components/Logo';
import { InputLogin } from '@/components/Inputs';
import { ButtonAzul, ButtonCancelar } from '@/components/Buttons';
import {FundoAzul} from '@/components/FundoAzul';
import {DivBranca} from '@/components/DivBranca';

const RecoverPassword = () => {
    const [email, setEmail] = useState("");

    return (
        <FundoAzul>
            <DivBranca>
                <Logo />
                <div className="flex flex-col items-center justify-center gap-4 py-2 max-w-xs mx-auto sm:max-w-sm md:max-w-md lg:max-w-lg">
                    <h1 className="text-[25px] font-bold text-black mb-2 text-center">Recuperar Senha</h1>
                    <p className="max-w-[400px] text-[12px] text-black text-center mb-2">
                        Digite abaixo seu email cadastrado que enviaremos um link para recuperação de senha
                    </p>
                    <InputLogin
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <ButtonAzul text="Enviar" />
                    <ButtonCancelar text="Cancelar" />
                </div>
            </DivBranca>
        </FundoAzul>
    );
}

export default RecoverPassword;
