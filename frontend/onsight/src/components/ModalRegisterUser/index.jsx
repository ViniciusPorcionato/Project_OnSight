"use client";

// console.log = () => { };
// console.error = () => { };
// console.warn = () => { };

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { TitleModalUser } from "../Texts";
import { InputForm, InputFormPassword, InputSelectImage } from "../Inputs";
import { ButtonAzul, ButtonCancelar } from "../Buttons";
import React, { useEffect, useRef, useState } from "react";
import {
  registerIndividualPerson,
  registerClient,
} from "@/service/userManagementService";
import IndividualPersonForm from "./components/IndividualPersonForm";
import ClientForm from "./components/ClientForm";

export const ModalRegisterUser = ({ isOpen, onClose }) => {
  const [userType, setUserType] = useState(1);
  const [profileImage, setProfileImage] = useState(null);

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setProfileImage(file);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     if (userType == 3) {
  //       const clientData = {
  //         tradeName: formData.tradeName,
  //         companyName: formData.companyName,
  //         cnpj: formData.cnpj,
  //         phoneNumber: formData.phoneNumber,
  //         email: formData.email,
  //         password: formData.password,
  //         profileImage: formData.profileImage,
  //         userType,
  //       };
  //       await registerClient(clientData);
  //       setFormData({
  //         name: "",
  //         tradeName: "",
  //         companyName: "",
  //         rg: "",
  //         cpf: "",
  //         cnpj: "",
  //         birthDate: "",
  //         phoneNumber: "",
  //         email: "",
  //         password: "",
  //         profileImage: null,
  //       });
  //       onClose();
  //     } else {
  //       const personData = {
  //         name: formData.name,
  //         rg: formData.rg,
  //         cpf: formData.cpf,
  //         birthDate: formData.birthDate,
  //         phoneNumber: formData.phoneNumber,
  //         email: formData.email,
  //         password: formData.password,
  //         profileImage: formData.profileImage,
  //         userType,
  //       };
  //       await registerIndividualPerson(personData);
  //       setFormData({
  //         name: "",
  //         tradeName: "",
  //         companyName: "",
  //         rg: "",
  //         cpf: "",
  //         cnpj: "",
  //         birthDate: "",
  //         phoneNumber: "",
  //         email: "",
  //         password: "",
  //         profileImage: null,
  //       });
  //       onClose();
  //     }
  //   } catch (error) {
  //     console.error("Erro ao cadastrar usuário:", error);
  //   }
  // };

  useEffect(() => {
    console.log(userType)
  }, [userType])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
          <DialogOverlay className='bg-transparent' asChild />
          <DialogContent className="mt-[40px] h-[80%] overflow-y-scroll">
            <DialogHeader>
              <div className="flex w-[100%] justify-center items-center my-[5%]">
                <DialogTitle className='font-nunito-semibold text-[#124262] text-[25px]'>Cadastro de Usuários</DialogTitle>
              </div>
              <div className="flex justify-center items-center relative">
                <Avatar className="w-[80px] h-[80px]">
                  <AvatarImage
                    className="w-[100%] h-[100%]"
                    src={
                      profileImage
                        ? URL.createObjectURL(profileImage)
                        : "https://blobvitalhubg15.blob.core.windows.net/containervitalhubpedro/imagemPadrao.jpg"
                    }
                  />
                </Avatar>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="profileImage"
                />
                <label htmlFor="profileImage">
                  <InputSelectImage onChange={(e) => handleImageChange(e)} />
                </label>
              </div>
              <div className="flex flex-col justify-center items-center gap-2">
                <select
                  onChange={handleUserTypeChange}
                  className="bg-white mt-[5%] w-[80%] h-auto p-2 rounded-lg border border-[#142937] font-nunito placeholder-[#124262] text-[#124262]"
                  value={userType}
                >
                  <option value={2}>Técnico</option>
                  <option value={1}>Atendente</option>
                  <option value={3}>Cliente</option>
                  <option value={0}>Administrador</option>
                </select>

                { userType == 3 ? (
                  <ClientForm 
                    onCloseModal={onClose}
                    userType={userType}
                    profileImage={profileImage}
                  />
                ) : (
                  <IndividualPersonForm
                    onCloseModal={onClose}
                    userType={userType}
                    profileImage={profileImage}
                  />
                )}

              </div>
            </DialogHeader>
          </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};