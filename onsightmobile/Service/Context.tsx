import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as signalR from '@microsoft/signalr';


type ModalContextType = {
  isModalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  connection: signalR.HubConnection | undefined;
  setConnection: React.Dispatch<React.SetStateAction<signalR.HubConnection | undefined>>;
};

// Criação do contexto com um valor padrão (que será sobrescrito pelo Provider)
const ModalContext = createContext<ModalContextType | undefined>(undefined);

type ModalProviderProps = {
  children: ReactNode;
};

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [connection, setConnection] = useState<signalR.HubConnection>()

  return (
    <ModalContext.Provider value={{ isModalVisible, setModalVisible, connection, setConnection }}>
      {children}
    </ModalContext.Provider>
  );
};

// Hook para usar o contexto
export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal deve ser usado dentro de um ModalProvider');
  }
  return context;
};