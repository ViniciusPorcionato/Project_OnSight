"use client";
import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const router = useRouter();

  useEffect(() => {
    console.log("UserContext atualizado:", user);

    const token = localStorage.getItem('token');

    if (!token) {
      router.replace('/login');
      return;
    }

    const decodedToken = jwtDecode(token);

    console.log(decodedToken);

    setUser({
      individual_person_id: decodedToken.individual_person_id,
      role: decodedToken.role,
      isAuthenticated: true,
      ...decodedToken,
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
