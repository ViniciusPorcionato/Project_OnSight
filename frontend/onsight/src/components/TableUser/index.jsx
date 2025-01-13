"use client";

// console.log = () => {};
// console.error = () => {};
// console.warn = () => {};

import { useEffect, useState } from "react";
import { ModalDeleteUser } from "../ModalDeleteUser";
import { ModalUserInformation } from "../ModalUserInformation";

import { SquareArrowOutUpRight } from "lucide-react";
import { TextTable } from "../Texts";
import { getClientById, getUserById } from "@/service/userManagementService";

export const TableUser = ({ users, fetchUsers }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const openModal = async (user) => {
    try {
      let userData;
      if (user.userTypeId == 3) {
        userData = await getClientById(user.clientId);

      } else {
        userData = await getUserById(user.idIndividualPerson);
      }
      setSelectedUser(userData);
      setIsOpen(true);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      console.log(user.clientId);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="relative w-full overflow-y-auto max-h-[calc(100vh-200px)]">
      <table className="w-full bg-white">
        <thead className="bg-white sticky top-0 z-10">
          <tr>
            <th className="py-2 px-4 border-b text-[#03558c]">Nome</th>
            <th className="py-2 px-4 border-b text-[#03558c]">Email</th>
            <th className="py-2 px-4 border-b text-[#03558c]">Telefone</th>
            <th className="py-2 px-4 border-b text-[#03558c]">Excluir</th>
          </tr>
        </thead>
        <tbody className="overflow-y-auto">
          {users && users.map((user) => (
            <tr key={user.userId} className="hover:bg-gray-100">
              <td
                className="py-2 px-4 border-b flex items-center gap-4 text-center cursor-pointer"
                onClick={() => openModal(user)}
              >
                <img
                  src={user.profileImageUrl}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full mr-3 ml-12"
                />
                <TextTable>{user.userName || user.tradeName}</TextTable>

                <SquareArrowOutUpRight
                  className="cursor-pointer hidden lg:block text-[#124262] hover:text-[#03558c]"
                  size={18}
                />
              </td>
              <td className="py-2 px-4 border-b text-center">
                <TextTable>{user.email || user.clientEmail}</TextTable>
              </td>
              <td className="py-2 px-4 border-b text-center">
                <TextTable>
                  {user.phoneNumber && user.phoneNumber.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
                    || user.clientPhoneNumber.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}
                </TextTable>
              </td>
              <td
                className="py-2 px-4 border-b text-center text-[#d40d0c]"
                onClick={() => {
                  setSelectedUser(user);
                }}
              >
                <ModalDeleteUser
                  user={selectedUser}
                  onUserDeleted={fetchUsers}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <ModalUserInformation
        isOpen={isOpen}
        onClose={closeModal}
        user={selectedUser}
      />
    </div>
  );
};
