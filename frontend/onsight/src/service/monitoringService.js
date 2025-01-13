import api from "./service";

export const getAllTechnician = async (statusId, textSearch) => {
  try {
    let builtUrl = `user/get-technician-filtered-searched?textToSearch=${textSearch}&technicianStatusId=${statusId}`;

    if (!textSearch || textSearch == '') {
      builtUrl = `user/get-technician-filtered-searched?technicianStatusId=${statusId}`;
    }
    const response = await api.get(builtUrl);

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar todos os tecnicos:", error);
    throw error;
  }
};

export const getAllCalled = async (callStatusId, textSearch) => {
  try {
    if (textSearch)
      textSearch = textSearch.trim();

    textSearch == null ? textSearch = '' : textSearch;

    let builtUrl = `/service-call/get-calls-search-filter?textToSearch=${textSearch}&serviceTypeId=${callStatusId}`;

    if (!textSearch || textSearch == '') {
      builtUrl = `/service-call/get-calls-search-filter?serviceTypeId=${callStatusId}`;
    }

    const response = await api.get(builtUrl);

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar todos os chamados:", error);
    throw error;
  }
};

export const getAllServerCalls = async (connection) => {
  try {
    if (connection) {
      console.log("TAQUI");
      await connection.invoke('GetAllServiceCalls');
    } else {
      console.error("A constante connection está vazia.");
    }
  } catch (error) {
    console.error("Erro ao buscar todos os chamados:", error);
  }
};

export const getOpenedCalled = async (serviceTypeId, textSearch) => {
  try {
    let builtUrl = `/service-call/get-opened-calls-search-filter?textToSearch=${textSearch}&serviceCallId=${serviceTypeId}`;

    if (!textSearch || textSearch == '') {
      builtUrl = `/service-call/get-opened-calls-search-filter?serviceTypeId=${serviceTypeId}`;
    }

    const response = await api.get(builtUrl);

    return response.data;
  } catch (error) {
    console.error("Erro ao os chamados em aberto:", error);
    throw error;
  }
};

export const getDetailsCalled = async (id) => {
  try {
    const response = await api.get(
      `/service-call/get-details-service-call?serviceCallId=${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao os detalhes do chamado:", error);
    throw error;
  }
};

export const getDetailsTechnician = async (id) => {
  try {
    const response = await api.get(
      `/user/get-user-by-id?individualPersonId=${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao os detalhes do técnico:", error);
    throw error;
  }
};

export const getHistoryCalledTechnican = async (id) => {
  try {
    const response = await api.get(
      `/service-call/get-technician-call-history?technicianId=${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao o histórico de chamado do técnico:", error);
    throw error;
  }
};

export const getMostRecentMetricOfAllCategories = async () => {
  try {
    const response = await api.get('metrics');

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar as métricas atuais:", error);
    throw error;
  }
};

export const getMetricDetails = async (metricCategoryId) => {
  try {
    const response = await api.get(`metrics/category?metricCategory=${metricCategoryId}`);

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar detalhes da métrica selecionada:", error);
    throw error;
  }
};

export const updateAttendantRevision = async (data) => {
  try {
    const response = await api.put('/service-call/attendant-revision', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar a revisão do atendente:', error);
    throw error;
  }
};

// export const sendNewCallAlertToTechnician = async (technicianId, connection) => {
//   try {
//     if (connection)
//     {
//       console.log("OUPA");
//       await connection.invoke('SendNewCallAlertToTechnician', technicianId);
//       console.log("PASSOU");
      
//     }
//     else {
//       console.error('A conexão com o servidor não está estabelecida. Inviabilizando o envio da mensagem ao técnico.');
//       throw error;
//     }
//   } catch (error) {
//     console.error('Erro ao enviar a mensagem de novo chamado ao técnico:', error);
//     throw error;
//   }
// }