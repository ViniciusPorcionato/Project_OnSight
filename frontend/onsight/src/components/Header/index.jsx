"use client"
import { faChartPie } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { IoSettingsSharp } from "react-icons/io5";
import { ChartNoAxesCombined, Menu } from "lucide-react";
import { Container } from "../Container";
import { DropDown } from "../DropDown";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/providers/userContext";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FaPencilAlt } from "react-icons/fa";
import { FaChartPie } from "react-icons/fa6";

export const Header = () => {

  const router = useRouter();
  const { user } = useContext(UserContext);

  // useEffect(() => {
  //   const decodedToken = getDecodedToken();
  //   if (decodedToken) {
  //     setRole(decodedToken.role);
  //   }
  // }, []);

  const goToCalled = () => router.push('/register-called');
  const goToManagement = () => router.push('/user-management');

  const canAccess = (roles) => user && roles.includes(user.role);
  const goToMonitoring = () => router.push('/monitoring');

  return (
    <>
      <header className="relative z-[10000] w-screen h-auto flex justify-center items-center p-4 bg-[#FAFAFA] shadow-md">
        <Container additionalClasses="flex justify-center items-center">
          <div className="flex w-[100%] justify-between">
            <div className="flex ">
              {/* Menu Hamburguer na Esquerda */}
              <div className="flex items-center">
                <Sheet>
                  <SheetTrigger className="md:hidden flex items-center">
                    <Menu />
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle className="font-nunito-bold text-[#142937] mb-6">
                        Menu
                      </SheetTitle>
                    </SheetHeader>
                    <div className="space-y-4">
                      <button onClick={goToCalled} className="text-[#142937]/80 hover:text-[#03558c] flex gap-1 items-center">
                        <FaPencilAlt size={20} color="#42535E" />
                        Novo Chamado
                      </button>
                      <button onClick={goToMonitoring} className="text-[#142937]/80 hover:text-[#03558c] flex items-center gap-1">
                        <FaChartPie size={20} color="#42535E" />
                        Monitoramento
                      </button>
                      <button onClick={goToManagement} className="text-[#142937]/80 hover:text-[#03558c] flex items-center gap-1">
                        <IoSettingsSharp size={20} color="#42535E"/>
                        Gerenciamento
                      </button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Logo à Direita (somente em telas maiores) */}
              <Image
                src="/images/Logo.svg"
                width={80}
                height={80}
                alt="Imagem do usuário logado"
                className="md:w-[110px] md:h-[43px] flex-shrink-0 max-md:hidden pointer-events-none select-none"
                />
            </div>

            {/* Botões do Header (visível apenas em telas maiores) */}
            <div className="flex gap-9">
              <div className="flex gap-7">
                {canAccess(['0', '1']) && (
                  <button onClick={goToCalled} className="text-[#142937]/80 hover:text-[#03558c] flex gap-1 items-center text-center max-md:hidden">
                    <FaPencilAlt size={20} color="#42535E" style={{ marginBottom: 3 }} />
                    Novo Chamado
                  </button>
                )}
                {canAccess(['0', '1']) && (
                  <button onClick={goToMonitoring} className="text-[#142937]/80 hover:text-[#03558c] flex items-center text-center gap-1 max-md:hidden">
                    <FaChartPie size={20} color="#42535E" style={{ marginBottom: 3 }} />
                    Monitoramento
                  </button>
                )}
                {canAccess(['0', '1']) && (
                  <button onClick={goToManagement} className="text-[#142937]/80 hover:text-[#03558c] flex items-center text-center gap-1 max-md:hidden">
                    <IoSettingsSharp size={20} color="#42535E" style={{ marginBottom: 3 }} />
                    Gerenciamento
                  </button>
                )}
              </div>

              <DropDown />
            </div>
          </div>
        </Container>
      </header>
    </>
  );
};

