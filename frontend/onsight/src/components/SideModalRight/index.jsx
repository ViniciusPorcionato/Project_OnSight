"use client";
import {
  getDetailsCalled,
  getDetailsTechnician,
  getHistoryCalledTechnican,
  sendNewCallAlertToTechnician,
  updateAttendantRevision,
} from "@/service/monitoringService";
import { useContext, useEffect, useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { ExpandableText } from "../ExpandableText";
import { FaCircle } from "react-icons/fa";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import MetricDetails from "../MetricDetails";
import { UserContext } from "@/providers/userContext";
import { useToast } from "@/hooks/use-toast";
import { IoCloseSharp } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import Image from "next/image";

export const SideModalRight = ({ isOpen, item, onClose, metrics, connection }) => {
  const [detailedItem, setDetailedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [historyCalled, setHistoryCalled] = useState(null);

  const { user } = useContext(UserContext);

  const { toast } = useToast();

  useEffect(() => {
    const fetchDetails = async () => {
      console.log("Item completo recebido:", item);
      console.log("Chaves do item:", item ? Object.keys(item) : "Item é nulo");

      setDetailedItem(null);
      setLoading(true);
      setError(null);

      try {
        // Verifica o tipo de item e faz a requisição apropriada
        if (item && item.serviceCallId) {
          const details = await getDetailsCalled(item.serviceCallId);
          console.log(details);
          setDetailedItem(details);
        } else if (item && item.individualPersonId) {
          const details = await getDetailsTechnician(item.individualPersonId);
          const history = await getHistoryCalledTechnican(item.technicianId);
          setHistoryCalled(history);
          setDetailedItem(details);
        } else if (item && item.serviceCallStatusId == 0) {
          const openedDetails = await getDetailsCalled(item.idServiceCall);
          console.log(openedDetails);
          setDetailedItem(openedDetails);
          console.log("Detalhes do chamado em aberto:", openedDetails);
        } else {
          console.warn("Nenhum ID válido encontrado no item");
        }
      } catch (error) {
        console.error("Erro detalhado ao buscar detalhes:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (item) {
      fetchDetails();
    }

    console.log(user.individual_person_id);
  }, [item]);

  useEffect(() => {
    console.log(detailedItem);
  }, [detailedItem]);

  const renderServiceCallDetails = () => (
    <div className="flex flex-col justify-between h-full gap-4">
      <div>
        <h1 className="font-nunito-bold text-[#142937] text-[20px] mb-4">Geral</h1>
        <label className="flex items-center font-nunito-bold text-[#142937]">
          Nome:
          <input
            type="text"
            name="clientName"
            value={detailedItem.clientName}
            className="font-nunito-light text-[#142937] ml-1 p-1 bg-[transparent]"
            disabled
          />
        </label>
        <label className="flex items-center font-nunito-bold text-[#142937]">
          ID do chamado:
          <input
            type="text"
            name="callCode"
            value={detailedItem.callCode}
            className="font-nunito-light text-[#142937] ml-1 p-1 bg-[transparent]"
            disabled
          />
        </label>
        <label className="flex items-center font-nunito-bold text-[#142937]">
          Data da abertura:
          <input
            type="text"
            name="creationDateTime"
            value={new Date(detailedItem.creationDateTime).toLocaleDateString(
              "pt-BR"
            )}
            className="font-nunito-light text-[#142937] ml-1 p-1 bg-[transparent]"
            disabled
          />
        </label>
        <label className="flex items-center font-nunito-bold text-[#142937]">
          Interno Responsável:
          <input
            type="text"
            name="responsibleAttendantName"
            value={
              detailedItem.responsibleAttendantName == null
                ? "Não alocado"
                : detailedItem.responsibleAttendantName
            }
            className="font-nunito-light text-[#142937] ml-1 p-1 bg-[transparent]"
            disabled
          />
        </label>
        <label className="flex items-center font-nunito-bold text-[#142937]">
          Status:
          <input
            type="text"
            name="callStatusId"
            value={
              detailedItem.callStatusId == 0
                ? "Em aberto"
                : detailedItem.callStatusId == 1
                  ? "Em progresso"
                  : detailedItem.callStatusId == 2
                    ? "Finalizado"
                    : detailedItem.callStatusId == 3
                      ? "Cancelado"
                      : "Não encontrado"
            }
            className="font-nunito-light text-[#142937] ml-1 p-1 bg-[transparent]"
            disabled
          />
        </label>
      </div>
      <div>
        <h1 className="font-nunito-bold text-[#142937] text-[20px] mb-4">Contato</h1>
        <label className="flex items-center font-nunito-bold text-[#142937]">
          Telefone:
          <input
            type="text"
            name="phoneNumberClient"
            value={detailedItem.phoneNumberClient}
            className="font-nunito-light text-[#142937] ml-1 p-1 bg-[transparent]"
            disabled
          />
        </label>
        <label className="flex items-center font-nunito-bold text-[#142937]">
          Email:
          <input
            type="text"
            name="emailClient"
            value={detailedItem.emailClient}
            className="font-nunito-light text-[#142937] ml-1 p-1 bg-[transparent]"
            disabled
          />
        </label>
        <label className="flex items-start font-nunito-bold text-[#142937]">
          <h3>Localização:</h3>
          <ExpandableText
            text={`${detailedItem.addressStreet}, ${detailedItem.addressNeightborhood}, Nº${detailedItem.addressNumber} - ${detailedItem.addressCity}`}
            maxLength={20}
          />
        </label>
      </div>
      <div>
        <h1 className="font-nunito-bold text-[#142937] text-[20px] mb-4">
          Detalhes
        </h1>
        <label className="flex items-center font-nunito-bold text-[#142937]">
          Tipo de chamado:
          <input
            type="text"
            name="serviceTypeId"
            value={
              detailedItem.serviceTypeId == 0 ? "Instalação" : "Manutenção"
            }
            className="font-nunito-light text-[#142937] ml-1 p-1 bg-[transparent]"
            disabled
          />
        </label>
        <label className="flex items-center font-nunito-bold text-[#142937]">
          Prazo de conclusão:
          <input
            type="text"
            name="conclusionDateTime"
            value={new Date(detailedItem.conclusionDateTime).toLocaleDateString(
              "pt-BR"
            )}
            className="font-nunito-light text-[#142937] ml-1 p-1 bg-[transparent]"
            disabled
          />
        </label>
        <label className="flex items-center font-nunito-bold text-[#142937]">
          Nível de prioridade:
          <input
            type="text"
            name="urgencyStatusId"
            value={
              detailedItem.urgencyStatusId == 0
                ? "Não Urgente"
                : detailedItem.urgencyStatusId == 1
                  ? "Pouco Urgente"
                  : "Urgente"
            }
            className="font-nunito-light text-[#142937] ml-1 p-1 bg-[transparent]"
            disabled
          />
        </label>
        <label className="flex font-nunito-bold text-[#142937] mt-2 flex-col">
          <h3>Descrição do chamado:</h3>
          <textarea
            name="description"
            className="font-nunito-light text-[#142937] bg-[transparent] resize-none"
            disabled
            value={detailedItem.description}
          />
        </label>
      </div>
    </div>
  );

  const renderTechnicianDetails = () => (
    <div className="flex flex-col justify-between h-min-full gap-4 pb-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-center">
          <h1 className="font-nunito-bold text-[#142937] text-[30px] mb-4">
            Dados do Técnico
          </h1>
        </div>
        <div className="flex flex-col items-center">
          <Avatar className="w-[80px] h-[80px] mb-2">
            <AvatarImage
              className="w-[100%] h-[100%]"
              src={detailedItem.profileImageUrl}
            />
          </Avatar>
          <h2 className="flex font-nunito-bold text-[#142937] text-[20px]">
            {detailedItem.userName}
          </h2>
          <h2 className="font-nunito-light text-[#142937] mt-[-5px] mb-2">
            {detailedItem.userTypeId == 2 ? "Técnico" : "Não encontrado"}
          </h2>
        </div>
        <div className="flex flex-col mt-5 gap-1 mb-2">
          <h2 className="flex font-nunito-bold text-[#142937]">
            Email:&nbsp;
            <p className="font-nunito-light text-[#142937]">
              {detailedItem.email}
            </p>
          </h2>
          <h2 className="flex font-nunito-bold text-[#142937]">
            Telefone:&nbsp;
            <p className="font-nunito-light text-[#142937]">
              {detailedItem.phoneNumber.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}
            </p>
          </h2>
          <h2 className="flex font-nunito-bold text-[#142937]">
            CPF:&nbsp;
            <p className="font-nunito-light text-[#142937]">
              {detailedItem.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
            </p>
          </h2>
          <h2 className="flex font-nunito-bold text-[#142937]">
            Nascimento:&nbsp;
            <p className="font-nunito-light text-[#142937]">
              {new Date(detailedItem.birthDate).toLocaleDateString("pt-BR")}
            </p>
          </h2>
        </div>
        <div className="flex flex-col items-center mt-5">
          <div>
            <h1 className="font-nunito-bold text-[#142937] text-[20px]">
              Chamados
            </h1>
          </div>
          <div className="w-[80%] select-none cursor-grab active:cursor-grabbing">
            <Carousel orientation="vertical">
              <CarouselContent>
                {historyCalled && historyCalled.length > 0
                  ? (
                    historyCalled?.map((call, index) => (
                      <CarouselItem key={index}>
                        <div className="flex flex-col items-start gap-2 p-4 bg-[#FAFAFA] rounded-xl shadow-xl">
                          <div className="flex w-[100%] items-center gap-5">
                            <div className="h-[100%]">
                              <img
                                src={call.profileImageUrl}
                                alt=""
                                className="w-[50px] h-[50px] rounded-xl"
                              />
                            </div>
                            <div className="flex flex-col">
                              <h1 className="font-nunito-bold">{call.tradeName}</h1>
                              <div className="flex items-center gap-2">
                                <h3 className="font-nunito-semibold">
                                  {new Date(
                                    call.creationDateTime
                                  ).toLocaleDateString("pt-BR")}
                                </h3>
                                <FaCircle size={10} />
                                <h3 className="font-nunito-semibold">
                                  {call.callStatusId == 0
                                    ? "Em aberto"
                                    : call.callStatusId == 1
                                      ? "Em progresso"
                                      : call.callStatusId == 2
                                        ? "Finalizado"
                                        : call.callStatusId == 3
                                          ? "Cancelado"
                                          : "Não encontrado"}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))) : (
                    <div className="flex flex-col items-center gap-5 mt-14">
                      <Image
                        src="/images/NoDataIllustration.svg"
                        width={80}
                        height={80}
                        alt="Sem dados."
                        className="w-1/2 md:w-1/3 flex-shrink-0 max-md:hidden"
                      />
                      <p className='text-center text-lg w-2/3'>Não foram encontrados chamados.</p>
                    </div>
                  )
                }
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );

  const sendNewCallAlertToTechnician = async (technicianId, connection) => {
    try {
      if (connection)
      {
        const result = await connection.invoke('SendNewCallAlertToTechnician', technicianId);        
      }
      else {
        console.error('A conexão com o servidor não está estabelecida. Inviabilizando o envio da mensagem ao técnico.');
        throw error;
      }
    } catch (error) {
      console.error('Erro ao enviar a mensagem de novo chamado ao técnico:', error);
      throw error;
    }
  }

  const handleUpdateAttendantRevision = async (isApproved) => {
    if (!user || !user.individual_person_id) {
      return;
    }

    const updateData = {
      serviceCallId: detailedItem.serviceCallId,
      responsibleAttendentId: user.individual_person_id,
      deadline: new Date(detailedItem.deadLine).toISOString().split("T")[0],
      serviceCallDescription: detailedItem.description,
      serviceType: Number(detailedItem.serviceTypeId),
      urgencyStatus: Number(detailedItem.urgencyStatusId),
      instantSolutionDescription: detailedItem.instantSolutionDescription || "",
      isCallApproved: isApproved,
    };

    try {
      const response = await updateAttendantRevision(updateData);
      await sendNewCallAlertToTechnician(response.technicianId, connection);
      
      // console.log(response);

      if (isApproved) {
        toast({
          title: "Chamado Aprovado",
          description: `Chamado ${detailedItem.callCode} foi aprovado com sucesso.`,
        });
      } else {
        toast({
          title: "Chamado Reprovado",
          description: `Chamado ${detailedItem.callCode} foi reprovado com sucesso.`,
        });
      }

      onClose();
    } catch (error) {
      toast({
        title: "Erro ao processar chamado",
        description:
          "Não foi possível realizar a operação, pois não há tecnicos disponíveis",
      });
      console.error(
        `Erro ao ${isApproved ? "aprovar" : "reprovar"} o chamado:`,
        error
      );
    }
  };

  const renderCalled = () => (
    <div className="flex flex-col justify-between h-auto gap-8">
      <div>
        <h1 className="font-nunito-bold text-[#142937] text-[20px] mb-3">Geral</h1>
        <label className="flex items-center font-nunito-bold text-[#142937]">
          Empresa:
          <input
            type="text"
            name="clientName"
            value={detailedItem.clientName}
            className="font-nunito-light text-[#142937] ml-1 p-1 bg-[transparent]"
            disabled
          />
        </label>
        <label className="flex items-center font-nunito-bold text-[#142937]">
          ID do chamado:
          <input
            type="text"
            name="callCode"
            value={detailedItem.callCode}
            className="font-nunito-light text-[#142937] ml-1 p-1 bg-[transparent]"
            disabled
          />
        </label>
        <label className="flex items-center font-nunito-bold text-[#142937]">
          Data da abertura:
          <input
            type="text"
            name="creationDateTime"
            value={new Date(detailedItem.creationDateTime).toLocaleDateString(
              "pt-BR"
            )}
            className="font-nunito-light text-[#142937] ml-1 p-1 bg-[transparent]"
            disabled
          />
        </label>
        <label className="flex items-center font-nunito-bold text-[#142937]">
          Interno Responsável:
          <input
            type="text"
            name="responsibleAttendantName"
            value={
              detailedItem.responsibleAttendantName == null
                ? "Não alocado"
                : detailedItem.responsibleAttendantName
            }
            className="font-nunito-light text-[#142937] ml-1 p-1 bg-[transparent]"
            disabled
          />
        </label>
        <label className="flex items-center font-nunito-bold text-[#142937]">
          Status:
          <input
            type="text"
            name="callStatusId"
            value={
              detailedItem.callStatusId == 0
                ? "Em aberto"
                : detailedItem.callStatusId == 1
                  ? "Em progresso"
                  : detailedItem.callStatusId == 2
                    ? "Finalizado"
                    : detailedItem.callStatusId == 3
                      ? "Cancelado"
                      : "Não encontrado"
            }
            className="font-nunito-light text-[#142937] ml-1 p-1 bg-[transparent]"
            disabled
          />
        </label>
      </div>
      <div>
        <h1 className="font-nunito-bold text-[#142937] text-[20px] mb-3">Contato</h1>
        <label className="flex items-center font-nunito-bold text-[#142937]">
          Telefone:
          <input
            type="text"
            name="phoneNumberClient"
            value={detailedItem.phoneNumberClient}
            className="font-nunito-light text-[#142937] ml-1 p-1 bg-[transparent]"
            disabled
          />
        </label>
        <label className="flex items-center font-nunito-bold text-[#142937]">
          Email:
          <input
            type="text"
            name="emailClient"
            value={detailedItem.emailClient}
            className="font-nunito-light text-[#142937] ml-1 p-1 bg-[transparent]"
            disabled
          />
        </label>
        <label className="flex items-start font-nunito-bold text-[#142937]">
          Localização:
          <ExpandableText
            text={`${detailedItem.addressStreet}, ${detailedItem.addressNeightborhood}, Nº${detailedItem.addressNumber} - ${detailedItem.addressCity}`}
            maxLength={20}
          />
        </label>
      </div>
      <div>
        <h1 className="font-nunito-bold text-[#142937] text-[20px] mb-3">
          Detalhes
        </h1>
        <label className="flex items-center font-nunito-bold text-[#142937]">
          Tipo de chamado:&nbsp;
          <select
            value={detailedItem.serviceTypeId}
            onChange={(txt) =>
              setDetailedItem({
                ...detailedItem,
                serviceTypeId: txt.target.value,
              })
            }
            className="font-nunito-light bg-[#FAFAFA]"
          >
            <option value={0}>Instalação</option>
            <option value={1}>Manutenção</option>
          </select>
        </label>
        <label className="flex items-center font-nunito-bold text-[#142937]">
          Prazo de conclusão:
          <input
            type="date"
            name="conclusionDateTime"
            value={detailedItem.deadLine}
            className="font-nunito-light text-[#142937] ml-1 p-1 bg-[transparent]"
            onChange={(txt) =>
              setDetailedItem({ ...detailedItem, deadLine: txt.target.value })
            }
          />
        </label>
        <label className="flex items-center font-nunito-bold text-[#142937]">
          Nível de prioridade:&nbsp;
          <select
            value={detailedItem.urgencyStatusId}
            onChange={(txt) =>
              setDetailedItem({
                ...detailedItem,
                urgencyStatusId: txt.target.value,
              })
            }
            className="font-nunito-light ml-1 text-[#142937] bg-[#FAFAFA]"
          >
            <option value={0}>Não Urgente</option>
            <option value={1}>Pouco Urgente</option>
            <option value={2}>Urgente</option>
          </select>
        </label>
        <label className="flex flex-col items-start font-nunito-bold text-[#142937] mt-3">
          <h3>Descrição do chamado:</h3>
          <ExpandableText
            text={`${detailedItem.description}`}
            maxLength={170}
            haveMarginLeft={false}
          />
        </label>
        <label className="flex flex-col font-nunito-bold items-start text-[#142937] mt-3">
          Solução mediata:
          <textarea
            name="description"
            className="font-nunito-light h-[20vh] text-[#142937] p-1 bg-[transparent] w-full mt-1 border border-1 border-[#142937] rounded-sm resize-none"
            onChange={(txt) =>
              setDetailedItem({
                ...detailedItem,
                instantSolutionDescription: txt.target.value,
              })
            }
          />
        </label>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => handleUpdateAttendantRevision(false)}
          className="transition-all scale-100 hover:scale-105 bg-[#E5E7E8] hover:bg-[#d6d7d8] w-[46%] h-14 text-[#124262] font-nunito-bold text-lg p-2 rounded flex items-center justify-center gap-1"
        >
          <IoCloseSharp size={26} />
          Reprovar
        </button>
        <button
          onClick={() => handleUpdateAttendantRevision(true)}
          className="transition-all scale-100 hover:scale-105 bg-[#124262] hover:bg-[#1a3445] w-[46%] h-14 text-white p-2 rounded font-nunito-bold text-lg flex items-center justify-center gap-2"
        >
          <FaCheck size={21} />
          Aprovar
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={`w-[30%] bg-[#FAFAFA] shadow-lg transition-all duration-300 transform ${isOpen ? "translate-x-0" : "translate-x-full"
        } absolute right-0 z-[1000] h-full `}
    >
      <div className="p-4 border-b border-gray-200 flex justify-between">
        <h2 className="font-nunito-semibold text-[20px] text-[#142937]">
          Detalhes
        </h2>
        <button onClick={onClose} className="text-red-500 font-bold text-xl">
          ×
        </button>
      </div>
      <div className="p-8 overflow-y-scroll h-[81%]">
        {loading ? (
          <div className="flex items-center justify-center h-full w-full">
            <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[#142937]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
          </div>
        ) : error ? (
          <p className="text-red-500">Erro ao carregar detalhes</p>
        ) : detailedItem ? (
          detailedItem.callStatusId == 0 ? (
            renderCalled()
          ) : detailedItem.serviceCallId ? (
            renderServiceCallDetails()
          ) : item.individualPersonId ? (
            renderTechnicianDetails()
          ) : (
            <p className="text-red-500">Nenhum detalhe disponível</p>
          )
        ) : item && item.metricCategoryId ? (
          <MetricDetails metricItem={item} />
        ) : null}
      </div>
    </div>
  );
};
