import api from "./service";

//GET: Buscar todos os clientes
export const getAllClients = async () => {
  try {
    const response = await api.get("/user/get-all-clients");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar todos os clientes:", error);
    throw error;
  }
};

//GET: Buscar cliente por ID
export const getClientById = async (id) => {
  try {
    const response = await api.get(`/user/get-client-by-id?clientId=${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar cliente por ID:", error);
    throw error;
  }
};

//POST: Registrar pessoa individual
export const registerIndividualPerson = async (personData) => {
  try {
    console.log(personData);
    let formData = new FormData();

    formData.append("name", personData.name);
    formData.append("rg", personData.rg);
    formData.append("cpf", personData.cpf);
    formData.append("birthDate", personData.birthDate);
    formData.append("phoneNumber", personData.phoneNumber);
    formData.append("userType", personData.userType);
    formData.append("email", personData.email);
    formData.append("password", personData.password);
    formData.append("profileImage", personData.profileImage);

    console.log(formData.values());

    const response = await api.post("/user/individual-person", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao registrar pessoa individual:", error);
    throw error;
  }
};



//POST: Registrar cliente
export const registerClient = async (clientData) => {
  try {
    const formData = new FormData();

    formData.append("tradeName", clientData.tradeName);
    formData.append("companyName", clientData.companyName);
    formData.append("cnpj", clientData.cnpj);
    formData.append("phoneNumber", clientData.phoneNumber);
    formData.append("email", clientData.email);
    formData.append("password", clientData.password);
    formData.append("profileImage", clientData.profileImage);

    console.log(formData.values());

    const response = await api.post("/user/client", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error registering client:", error);
    throw error;
  }
};

//GET: Buscar usuários por tipo
export const getUsersByType = async (selectedType) => {
  try {
    const response = await api.get(
      `/user/get-users-by-type?userTypeId=${selectedType}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuários por tipo:", error);
    throw error;
  }
};

//GET: Buscar usuário por ID
export const getUserById = async (id) => {
  try {
    const response = await api.get(
      `/user/get-user-by-id?individualPersonId=${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuário por ID:", error);
    throw error;
  }
};

//DELETE: Excluir usuário por ID
export const deleteUserById = async (userId) => {
  try {
    const response = await api.delete(
      `/user/delete-user-by-id?idUserToDelete=${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao excluir usuário por ID:", error);
    throw error;
  }
};
