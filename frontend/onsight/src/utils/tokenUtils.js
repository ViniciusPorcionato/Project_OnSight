import { jwtDecode } from "jwt-decode";

export const getDecodedToken = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    return token ? jwtDecode(token) : null;
  }
  return null;
};