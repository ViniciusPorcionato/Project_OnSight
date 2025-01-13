"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  TextDescriptionUser,
  TextInformationUser,
  TextNameUserModal,
} from "../Texts";

export const ModalUserInformation = ({ isOpen, onClose, user }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="
        w-full 
        h-full 
        overflow-y-auto
        md:w-[90vw] 
        md:h-auto 
        md:max-h-[90vh] 
        md:max-w-[500px]"
      >
        {user ? (
          <DialogHeader>
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 border-b">
              <Avatar className="w-20 h-20">
                <AvatarImage
                  src={user.clientProfileImage || user.profileImageUrl}
                />
              </Avatar>
              <TextNameUserModal className="text-center sm:text-left">
                {user.userName || user.tradeName}
              </TextNameUserModal>
            </div>
            <DialogDescription>
              <ul className="flex flex-col gap-4 p-4">
                <li className="flex flex-wrap gap-1">
                  <TextInformationUser>Tipo de usuário:</TextInformationUser>
                  <TextDescriptionUser>
                    {user.userTypeId === 0
                      ? "Administrador"
                      : user.userTypeId === 1
                      ? "Atendente"
                      : user.userTypeId === 2
                      ? "Técnico"
                      : "Cliente"}
                  </TextDescriptionUser>
                </li>
                <li className="flex flex-wrap gap-1">
                  <TextInformationUser>Email:</TextInformationUser>
                  <TextDescriptionUser>
                    {user.email || user.clientUserEmail}
                  </TextDescriptionUser>
                </li>
                <li className="flex flex-wrap gap-1">
                  <TextInformationUser>Telefone:</TextInformationUser>
                  <TextDescriptionUser>
                    {user.phoneNumber && user.phoneNumber.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') 
                      || user.clientUserPhoneNumber && user.clientUserPhoneNumber.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}
                  </TextDescriptionUser>
                </li>
                {user.userTypeId === 3 ? (
                  <li className="flex flex-wrap gap-1">
                    <TextInformationUser>CNPJ:</TextInformationUser>
                    <TextDescriptionUser>{user.cnpj && user.cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')}</TextDescriptionUser>
                  </li>
                ) : (
                  <li className="flex flex-wrap gap-1">
                    <TextInformationUser>CPF:</TextInformationUser>
                    <TextDescriptionUser>{user.cpf && user.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}</TextDescriptionUser>
                  </li>
                )}
                {user.userTypeId === 3 ? (
                  <li className="flex flex-wrap gap-1">
                    <TextInformationUser>Razão Social:</TextInformationUser>
                    <TextDescriptionUser>
                      {user.companyName}
                    </TextDescriptionUser>
                  </li>
                ) : (
                  <li className="flex flex-wrap gap-1">
                    <TextInformationUser>Nascimento:</TextInformationUser>
                    <TextDescriptionUser>
                      {new Date(user.birthDate).toLocaleDateString("pt-BR")}
                    </TextDescriptionUser>
                  </li>
                )}
                {user.userTypeId !== 3 ? (
                  <li className="flex flex-wrap gap-1">
                    <TextInformationUser>RG:</TextInformationUser>
                    <TextDescriptionUser>{user.rg && user.rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')}</TextDescriptionUser>
                  </li>
                ) : null}
              </ul>
            </DialogDescription>
          </DialogHeader>
        ) : (
          <DialogHeader>
            <div className="flex items-center gap-5 p-4">
              <DialogTitle>Usuário não encontrado!</DialogTitle>
            </div>
          </DialogHeader>
        )}
      </DialogContent>
    </Dialog>
  );
};