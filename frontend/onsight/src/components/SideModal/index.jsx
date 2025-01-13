"use client";
import React, { useEffect, useState } from "react";
import { InputSearch } from "../Inputs";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { VscDebugBreakpointFunction } from "react-icons/vsc";
import {
  getAllCalled,
  getAllTechnician,
  getOpenedCalled,
} from "@/service/monitoringService";
import ServiceCallsContent from "./components/ServiceCallsContent";
import TechniciansContent from "./components/TechniciansContent";
import ApprovalsContent from "./components/ApprovalsContent";

export const SideModal = ({ isOpen = false, activeTab, onOpenRightModal, connection, allServiceCalls, setAllServiceCalls, setAllTechnicians, allTechnicins, createSelectedRoute }) => {

  const [tecnicos, setTecnicos] = useState([]);
  const [called, setCalled] = useState([]);
  const [openedCalled, setOpenedCalled] = useState([]);

  const handleRightModalOpen = (item) => {
    onOpenRightModal(item);
  };

  const focusOnLocation = (location, zoomLevel = 15) => {
    if (window.map && window.google && location) {
      const typedLocation = new window.google.maps.LatLng(location.latitude, location.longitude);

      window.map.setCenter(typedLocation);
      window.map.setZoom(zoomLevel);
    }
  }

  const focusOnArea = (location, location2, padding = 100) => {
    if (window.map && window.google && location && location2) {
      // pega a rota do chamado clicado
      const routeData = getRouteData(
        { lat: location.latitude, lng: location.longitude },
        { lat: location2.latitude, lng: location2.longitude }
      );

      const bounds = new window.google.maps.LatLngBounds();

      // Insere as localizações ao limite
      bounds.extend(new window.google.maps.LatLng(location.latitude, location.longitude));
      bounds.extend(new window.google.maps.LatLng(location2.latitude, location2.longitude));

      // Adiciona os pontos da rota no mapeamento da área
      if (routeData && routeData.overview_path) {
        routeData.overview_path.forEach(point => {
          bounds.extend(point);
        })
      }

      // Ajusta o mapa para mostrar todas as localizações
      window.map.fitBounds(bounds, padding);
    }
  }

  const getRouteData = (originToSearch, destinationToSearch) => {
    if (window.directionsRenderer && window.directionsRenderer.getDirections()) {
      const directions = window.directionsRenderer.getDirections();

      if (directions && directions.routes && directions.routes.length > 0) {
        const route = directions.routes.find(route => {
          const routeStart = route.legs[0].start_location;
          const routeEnd = route.legs[route.legs.length - 1].end_location;

          return (
            routeStart.lat() === originToSearch.lat &&
            routeStart.lng() === originToSearch.lng &&
            routeEnd.lat() === destinationToSearch.lat &&
            routeEnd.lng() === destinationToSearch.lng
          )
        });

        if (route) {
          return {
            overview_path: route.overview_path,
            bounds: route.bounds
          }
        }
      }
    }
    return null;
  }

  const fetchTechnicians = async () => {
    try {
      const data = await getAllTechnician();
      setTecnicos(data);
      console.log("UEEEEEEEEEEEEEEPAAAAAAAAAAAAAAA");
      console.log(data);
    } catch (error) {
      console.error("Erro ao buscar técnicos:", error);
    }
  };

  const fetchCalled = async () => {
    try {
      const data = await getAllCalled();
      setCalled(data);
    } catch (error) {
      console.error("Erro ao buscar chamados:", error);
    }
  };

  const fetchOpenedCalled = async () => {
    try {
      const data = await getOpenedCalled();
      setOpenedCalled(data);
    } catch (error) {
      console.error("Erro ao buscar chamados:", error);
    }
  };

  const fetchServerCalls = async () => {
    try {
      if (connection) await connection.invoke("GetAllServiceCalls");
      else console.log("Connection está vazio!");
    } catch (error) {
      console.log("Houve um erro na conexão: ", error);
    }
  };

  const fetchServerTechnicians = async () => {
    try {
      if (connection)
        await connection.invoke("GetTechniciansWithRespectiveCalls");
      else console.warn("Connection está vazio!");
    } catch (error) {
      console.error("Houve um erro na conexão: ", error);
    }
  };

  useEffect(() => {
    console.log(openedCalled);
  }, [openedCalled]);

  useEffect(() => {
    fetchOpenedCalled();
    fetchCalled();
    fetchTechnicians();

    fetchServerCalls();
    fetchServerTechnicians();
  }, []);

  useEffect(() => {
    if (connection) {
      fetchServerCalls();
      fetchServerTechnicians();

      connection.on("ReceiveAllServiceCalls", (data) => {
        console.log("Receive Service Calls");
        console.log(data);
        // setCalled(data);
        setAllServiceCalls(data);
      });

      connection.on("ReceiveAllTechnicians", (data) => {
        console.log("Receive Technicians");
        console.log(data);
        setAllTechnicians(data);
      });

      connection.on("ReceiveFeedback", (data) => {
        console.log(data);
      });
      // return () => {
      //   connection.off('ReceiveAllServiceCalls');
      //   connection.off('ReceiveAllTechnicians');
      //   connection.off('ReceiveFeedback');
      // }
    }
  }, [connection]);

  return (
    <div
      className={`max-sm:hidden w-[25%] h-full bg-[#F1F1F1] shadow-lg transition-all duration-300 ease-in-out transform ${isOpen ? "translate-x-0" : "-translate-x-full"
        } absolute left-20 z-10`}
    >
      {/* <div className="p-4 border-b border-gray-200">
        <div className="flex justify-center items-center">
          <h2 className="font-nunito-semibold text-[30px] text-[#142937]">
            {activeTab === "chamados" && "Chamados"}
            {activeTab === "tecnicos" && "Técnicos"}
            {activeTab === "aprovacoes" && "Aprovações"}
          </h2>
        </div>
      </div> */}

      {/* <div className="p-4">
        {activeTab === "chamados" && (
          <div className="w-[100%] flex justify-between">
            <select className="text-[#142937] p-1 rounded-xl w-full sm:w-[50%] md:w-[30%]">
              <option value="">Selecione uma opção</option>
            </select>
            <InputSearch placeholder={"Pesquise por chamados..."} />
          </div>
        )}
        {activeTab === "tecnicos" && (
          <div className="w-[100%] flex justify-between">
            <select className="text-[#142937] p-1 rounded-xl w-[30%]">
              <option value="">Selecione uma opção</option>
            </select>
            <InputSearch placeholder={"Pesquise por técnicos..."} />
          </div>
        )}
        {activeTab === "aprovacoes" && (
          <div className="w-[100%] flex justify-between">
            <select className="text-[#142937] p-1 rounded-xl w-[30%] shadow-xl">
              <option value="">Selecione uma opção</option>
            </select>
            <InputSearch placeholder={"Pesquise por aprovações..."} />
          </div>
        )}
      </div> */}

      {/* <div className="flex flex-col gap-3 mt-4 overflow-y-auto max-h-[400px] px-4"> */}

      {activeTab === "chamados" && (
        <ServiceCallsContent
          handleCardSelection={call => {
            handleRightModalOpen(call);
            const realtimeCall = allServiceCalls.find(serviceCall => serviceCall.serviceCallId == call.serviceCallId)

            if (realtimeCall) {
              if (realtimeCall.technicianLocation) {
                createSelectedRoute(realtimeCall);

                focusOnArea(realtimeCall.assignedCallLocation, realtimeCall.technicianLocation);
              } else {
                focusOnLocation(realtimeCall.assignedCallLocation);
              }
            }
          }}
        />
      )}

      {activeTab === "tecnicos" && (
        <TechniciansContent
          handleCardSelection={technician => {
            handleRightModalOpen(technician);

            // Pega o técnico com sua respectiva localização
            const technicianDetails = allTechnicins.find(technicianToFind => technicianToFind.technicianId == technician.technicianId);

            if (technicianDetails) {
              // Desenha a rota no mapa
              createSelectedRoute(technicianDetails);
              const location = technicianDetails.technicianLocation;

              // Foca na localização do técnico
              focusOnLocation(location);
            }
          }}
        />
      )}

      {activeTab === "aprovacoes" && (
        <ApprovalsContent
          handleCardSelection={handleRightModalOpen}
        />
        // <div className="w-[100%] flex flex-col gap-3 items-center justify-center mt-8">
        //   {openedCalled.map((OpenCall, index) => (
        //     <button
        //       key={index}
        //       className="bg-[#FAFAFA] w-[90%] rounded-xl h-[60px] shadow-xl"
        //       onClick={() => handleRightModalOpen(OpenCall)}
        //     >
        //       <div className="flex items-center gap-5 ml-2">
        //         <div className="flex flex-col text-start">
        //           <h1 className="font-nunito-semibold">{OpenCall.tradeName}</h1>
        //           <div className="flex items-center gap-1">
        //             <h2 className="font-nunito-semibold">
        //               {OpenCall.serviceCallTypeId == 0
        //                 ? "Instalação"
        //                 : "Manutenção"}
        //             </h2>
        //             <VscDebugBreakpointFunction />
        //             <h2 className="font-nunito-semibold">
        //               {new Date(
        //                 OpenCall.serviceCallCreationDateTime
        //               ).toLocaleDateString("pt-BR")}
        //             </h2>
        //           </div>
        //         </div>
        //       </div>
        //     </button>
        //   ))}
        // </div>
      )}
    </div>
    // </div>
  );
};
