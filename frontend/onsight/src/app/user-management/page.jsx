"use client";

// console.log = () => {};
// console.error = () => {};
// console.warn = () => {};

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { FaUserShield } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaUserCog } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { TableUser } from "@/components/TableUser";
import { ButtonAddUser } from "@/components/Buttons";
import { TextTypeUser, TitlePage } from "@/components/Texts";
import { ModalRegisterUser } from "@/components/ModalRegisterUser";
import withAuth from "@/components/AuthFunction";
import { getAllClients, getUsersByType } from "@/service/userManagementService";

const UserManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]); 
  const [selectedType, setSelectedType] = useState(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const fetchUsers = async (type = null) => {
    setIsLoading(true);
    try {
      let fetchedUsers;
      if (type === null) {
        fetchedUsers = await getAllClients(); // Sempre carregar todos os clientes como padrão
      } else {
        fetchedUsers = await getUsersByType(type);
      }
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Busca todos os clientes ao carregar a página ou quando selectedType mudar
    if (selectedType === null || selectedType === 3) {
      fetchUsers(null); // Carrega todos os clientes por padrão
    } else {
      fetchUsers(selectedType); // Busca usuários por tipo
    }
  }, [selectedType]);
  

  // useEffect(() => {
  //   fetchUsers(selectedType);
  // }, [selectedType]);

  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  return (
    <div className="w-screen h-screen bg-[#f1f1f1]">
      <Header />

      <main className="flex flex-col items-center mt-10 bg-[#f1f1f1] px-4 md:px-0">
        {/* Container principal */}
        <div className="w-full md:w-[75%] bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <TitlePage>Gerenciamento de Usuários</TitlePage>
            <ButtonAddUser onClick={openModal} />
          </div>
        </div>

        {/* Botões de filtro */}
        <div className="w-full md:w-[75%] bg-white rounded-lg shadow-lg p-6 mt-4 flex flex-col md:flex-row justify-between items-center md:items-center mb-4 space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row w-full justify-around gap-4 md:gap-0">
            <button
              className="flex items-center gap-2 text-[#142937]/80 hover:text-[#03558c]"
              onClick={() => setSelectedType(0)}
            >
              <FaUserShield size={20} />
              <TextTypeUser>Administradores</TextTypeUser>
            </button>
            
            <div className="border-l border-gray-300 h-6 mx-4 hidden md:block" />

            <button
              className="flex items-center gap-2 text-[#142937]/80 hover:text-[#03558c]"
              onClick={() => setSelectedType(1)}
            >
              <FaUser size={16} />
              <TextTypeUser>Atendentes</TextTypeUser>
            </button>

            <div className="border-l border-gray-300 h-6 mx-4 hidden md:block" />

            <button
              className="flex items-center gap-2 text-[#142937]/80 hover:text-[#03558c]"
              onClick={() => setSelectedType(2)}
            >
              <FaUserCog size={20} />
              <TextTypeUser>Técnicos</TextTypeUser>
            </button>

            <div className="border-l border-gray-300 h-6 mx-4 hidden md:block" />

            <button
              className="flex items-center gap-2 text-[#142937]/80 hover:text-[#03558c] xl:mr-6"
              onClick={() => setSelectedType(3)}
            >
              <FaUserTie size={17} />
              <TextTypeUser>Clientes</TextTypeUser>
            </button>
          </div>
        </div>

        {/* Tabela de Usuários */}
        <div className="w-full md:w-[75%] bg-white rounded-lg shadow-lg p-2 mb-6 overflow-x-auto">
          {isLoading ? (
            <p className="text-center text-gray-600">Carregando usuários...</p>
          ) : users.length > 0 ? (
            <TableUser users={users} fetchUsers={fetchUsers} />
          ) : (
            <p className="text-center text-gray-600">Nenhum usuário encontrado.</p>
          )}
        </div>
      </main>

      <ModalRegisterUser isOpen={isOpen} onClose={closeModal} />

    </div>
  );
};

export default UserManagement;
