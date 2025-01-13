import api from "./service";

export const registerCalled = async (calledData) => {
  try {
    const response = await api.post(`/service-call`, calledData);
    return response.data;
  } catch (error) {
    console.error("Error ao registrar chamado", error);
    throw error;
  }
};

