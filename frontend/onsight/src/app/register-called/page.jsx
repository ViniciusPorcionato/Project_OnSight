"use client";

// console.log = () => { };
// console.error = () => { };
// console.warn = () => { };

import { Header } from "@/components/Header";
import RegisterCallForm from "./components/RegisterCallForm";

const RegisterCalled = () => {
  return (
    <div className="min-h-screen bg-[#F1F1F1] overflow-x-hidden">
      <Header />
      <div className=" w-[100%] flex items-center justify-center">
        <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center w-full max-w-4xl mx-auto mt-10 mb-10 sm:w-[90%] lg:w-[50%]">
          <h2 className="text-2xl font-nunito-bold mb-4 text-center mt-8">
            Cadastre seu chamado
          </h2>
          <RegisterCallForm isClient={false} />
        </div>
      </div>
    </div>
  );
};

export default RegisterCalled;
