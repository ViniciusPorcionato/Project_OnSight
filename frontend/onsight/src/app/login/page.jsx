'use client'

import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Logo from '@/components/Logo';
import { InputLogin, InputPassword } from '@/components/Inputs';
import { ButtonAzul } from '@/components/Buttons';
import { FundoAzul } from '@/components/FundoAzul';
import { DivBranca } from '@/components/DivBranca';
import { useRouter } from 'next/navigation';
import api from '@/service/service';
import { useContext } from 'react';
import { UserContext } from '@/providers/userContext';

const Login = () => {
  const [email, setEmail] = useState('isaac@email.com');
  const [senha, setSenha] = useState('12345');
  const [error, setError] = useState('');
  const router = useRouter();

  const { user, setUser } = useContext(UserContext)

  useEffect(() => {
    // Limpa qualquer erro anterior quando o usuário começa a editar os campos
    setError('');
  }, [email, senha]);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token == null || token === '')
      return;

    const decodedToken = jwtDecode(token);

    console.log(decodedToken);

    setUser({
      individual_person_id: decodedToken.individual_person_id, 
      role: decodedToken.role,
      isAuthenticated: true,
      ...decodedToken,
    });

    routeUser(decodedToken.role);
  }, []);

  const handleLogin = async () => {
    // console.log("Iniciando processo de login...");
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setError("Por favor, insira um e-mail válido.");
      return;
    }
    try {
      const response = await api.post("/user/login", {
        userEmail: email,
        userPassword: senha,
      });

      if (response.data.authenticationToken) {
        localStorage.setItem("token", response.data.authenticationToken);

        const decodedToken = jwtDecode(response.data.authenticationToken);

        setUser({
          individual_person_id: decodedToken.individual_person_id, 
          role: decodedToken.role,
          isAuthenticated: true,
          ...decodedToken,
        });


        routeUser(decodedToken.role);
      } else {
        throw new Error("Email ou senha incorretos");
      }
    } catch (error) {
      // console.error("Erro durante o login:", errorMessage);
      const errorMessage = error.response && error.response.status === 400
        ? "Email ou senha incorretos"  // Custom message for 400 errors
        : (error.response ? error.response.data.message : "Erro desconhecido");
      setError(errorMessage);
    }
  };

  const onKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  const routeUser = (role) => {
    switch (role) {
      case '0': // Administrator
        router.push('/monitoring')
      case '1': // Attendant
        router.push('/monitoring');
        break;
      case '2': // Technician
        setError('Você não tem acesso a este sistema.');
        break;
      case '3': // Client
        router.push('/called');
        break;
      default:
        console.error('Tipo de usuário desconhecido');
        setError('Tipo de usuário desconhecido');
        break;
    }
  };

  return (
    <FundoAzul>
      <DivBranca>
        <Logo />
        <div className="pt-1 gap-4 grid py-2 w-full max-w-xs mx-auto sm:max-w-sm md:max-w-md lg:max-w-lg">
          <h1 className="text-[25px] font-bold text-black text-center font-nunito-semibold">Login</h1>
          <p className="text-[12px] text-black text-center font-nunito-semibold">
            Insira suas informações de cadastro para entrar no sistema
          </p>
          <InputLogin
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            additionalClasses={"font-nunito text-[#124262] placeholder-[#124262]"}
            onKeyDown={onKeyDown}
          />
          <InputPassword
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            additionalClasses={"font-nunito text-[#124262]"}
            onKeyDown={onKeyDown}
          />
          <ButtonAzul text="Entrar" onClick={handleLogin} />
          {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
        </div>
      </DivBranca>
    </FundoAzul>
  );
};

export default Login;