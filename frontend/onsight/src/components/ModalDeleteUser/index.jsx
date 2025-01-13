import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TextButton,
  TextButtonDark,
  TextNameUserModal,
  TitleModalUser,
} from "../Texts";
import { deleteUserById } from "@/service/userManagementService";

export const ModalDeleteUser = ({ user, onUserDeleted  }) => {

  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!user?.userId) return;

    setIsLoading(true);
    try {
      await deleteUserById(user.userId);
      onUserDeleted();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      alert("Erro ao excluir usuário. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-[100%] flex justify-center hover:text-[#9c2f2f]">
        <FaTrash />
      </AlertDialogTrigger>

      {user ? (
        <AlertDialogContent className="h-[50%]">
          <AlertDialogHeader className="flex flex-col items-center">
            <TitleModalUser>Deseja excluir este usuário ?</TitleModalUser>
            <AlertDialogDescription></AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-center items-center gap-2">
            <Avatar className="w-[60px] h-[60px]">
              <AvatarImage
                className="w-[100%] h-[100%]"
                src={user.profileImageUrl || user.profileImageUrl}
              />
            </Avatar>
            <TextNameUserModal>
              {user.userName || user.tradeName}
            </TextNameUserModal>
          </div>
          <AlertDialogFooter>
            <div className="w-[100%] flex flex-col items-center justify-end gap-3">
              <AlertDialogAction 
              onClick={() => handleDelete()}
              className="w-[60%] bg-gradient-to-b from-[#03558c] to-[#124262] rounded-[10px]">
                <TextButton>{isLoading? "Excluindo..." : "Confirmar"}</TextButton>
              </AlertDialogAction>
              <AlertDialogCancel className="w-[60%] bg-transparent border-none rounded-[10px]">
                <TextButtonDark>Cancelar</TextButtonDark>
              </AlertDialogCancel>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      ) : (
        <AlertDialogContent className="h-[50%]">
          <AlertDialogHeader className="flex flex-col items-center">
            <AlertDialogTitle>
              <TextButtonDark>Usuário não encontrado !</TextButtonDark>
            </AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <div className="w-[100%] flex flex-col items-center justify-end gap-3">
              <AlertDialogCancel className="w-[60%] bg-transparent border-none rounded-[10px] text-[#124262] text-xl">
                Cancelar
              </AlertDialogCancel>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
};
