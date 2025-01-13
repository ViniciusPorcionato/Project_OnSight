"use client";

// console.log = () => {};
// console.error = () => {};
// console.warn = () => {};

import { Header } from "@/components/Header";
import RegisterCallForm from "../register-called/components/RegisterCallForm";

const Called = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Componente de formulário */}
          <div className=" w-[100%] flex items-center justify-center">
            <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center w-[80%]">
              <h2 className="text-2xl font-nunito-bold mb-4 text-center">
                Cadastre seu chamado
              </h2>
              <RegisterCallForm isClient={true} />
            </div>
          </div>

          {/* Cards de contato */}
          <div className=" flex flex-col items-center justify-between space-y-6">
            <div className="bg-custom-gradient p-4 rounded-lg shadow-lg h-[50%] w-[90%] flex flex-col justify-around">
              <h3 className="text-xl font-nunito-bold">
                Fale Conosco por Telefone !
              </h3>
              <p className="font-nunito">
                Precisa de suporte ou deseja agendar um atendimento? Nossa
                equipe está pronta para ajudar! Entre em contato pelo nosso
                telefone e fale diretamente com nossos especialistas. Estamos
                aqui para oferecer soluções rápidas e eficientes, garantindo que
                você tenha a melhor experiência possível.
              </p>
              <p className="mt-2 font-nunito-bold">
                Telefone para Atendimento: (11) 98573-4321
              </p>
            </div>

            <div className="bg-custom-gradient p-4 rounded-lg shadow-lg h-[50%] w-[90%] flex flex-col justify-around">
              <h3 className="text-xl font-nunito-bold">
                Fale Conosco por E-mail !
              </h3>
              <p className="font-nunito">
                Tem dúvidas, sugestões ou precisa de suporte? Nossa equipe de
                atendimento está pronta para ajudar! Envie sua mensagem para o
                nosso e-mail, e responderemos o mais rápido possível, oferecendo
                a atenção e o cuidado que você merece.
              </p>
              <p className="mt-2 font-nunito-bold">
                E-mail para Contato: contato@email.com
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Called;