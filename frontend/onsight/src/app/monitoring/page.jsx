
"use client"

// console.log = () => {};
// console.error = () => {};
// console.warn = () => {};

import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { FaHeadset, FaUsers } from "react-icons/fa6";
import { BiTask } from "react-icons/bi";
import { SideModal } from "@/components/SideModal";
import { SideModalRight } from "@/components/SideModalRight";
import KpiCard from "@/components/KpiCard";
import { getMostRecentMetricOfAllCategories } from "@/service/monitoringService";
import * as signalR from '@microsoft/signalr';
import { twMerge } from "tailwind-merge";
import useWindowDimensions from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const Monitoring = () => {
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRightModalOpen, setIsRightModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [mostRecentMetricsOfCategories, setMostRecentMetricsOfCategories] = useState([]);
  const [connection, setConnection] = useState(); // Controla a conexão em tempo real

  const [allServiceCalls, setAllServiceCalls] = useState([]);
  const [allTechnicins, setAllTechnicians] = useState([]);

  const dimensions = useWindowDimensions();
  const MIN_WIDTH = 750;

  useEffect(() => {
    if (dimensions.width < MIN_WIDTH) {
      setIsModalOpen(false);
      setIsRightModalOpen(false);
      setActiveTab(null);
    }
  }, [dimensions])

  useEffect(() => {
    const initMap = () => {
      const location = { lat: -23.5505, lng: -46.6333 };
      window.map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: location,
        mapTypeControl: false,
        streetViewControl: false
      });

      // new google.maps.Marker({
      //   position: location,
      //   map: map,
      //   title: "São Paulo"
      // });
    };

    const initRealtimeConnection = async () => {
      const token = localStorage.getItem('token');

      try {
        // Instancia e configura o objeto HubConnection
        const connectionBuilder = new signalR.HubConnectionBuilder()
          .withUrl("http://172.16.39.54:5281/communicationHub", {
            accessTokenFactory: () => token
          }) // URL da API
          .withAutomaticReconnect()
          .configureLogging(signalR.LogLevel.Information)
          .build();

        // Inicia a conexão
        await connectionBuilder.start();

        // Guarda a conexão no state
        setConnection(connectionBuilder);
      } catch (error) {
        console.log(error);
      }
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDgfakNiJSLznscZ9SZyk98sCwsAnF0IWc&callback=initMap`;
    script.async = true;
    script.defer = true;
    window.initMap = initMap;
    document.head.appendChild(script);

    initRealtimeConnection();

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleTabClick = (tab) => {
    if (activeTab === tab) {
      setIsModalOpen(false);
      setActiveTab(null);
    } else {
      setIsModalOpen(true);
      setActiveTab(tab);
    }
  };

  const openRightModal = (item) => {
    setSelectedItem(item);
    setIsRightModalOpen(true);
  };

  async function getMetrics() {
    const response = await getMostRecentMetricOfAllCategories();

    setMostRecentMetricsOfCategories(response);

    console.log(response);
  }

  useEffect(() => {
    getMetrics();
  }, []);

  const updateMarkersInMap = (dataList, isDataServiceCalls, updateTechnicianMarkers = false, selectedTechnicianToRouteLocate) => {
    // Inicializa window.markers se não existir
    if (!window.markers) {
      window.markers = [];
    }

    // Garante que o mapa foi inicializado e que há serviços
    if (window.google && window.google.maps) {

      // Remove os markers existentes baseado em seus titles
      if (window.markers) {
        window.markers = window.markers.filter(marker => {
          const shouldRemove = isDataServiceCalls
            ? marker.getTitle() === "cliente"
            : marker.getTitle() === "tecnico";

          if (shouldRemove) {
            marker.setMap(null); // Remove o marker do mapa
            return false; // Remove o marker do array
          }
          return true; // Mantém o marker no array
        });
      }

      // Create a bounds object to automatically adjust map view
      const bounds = new window.google.maps.LatLngBounds();

      if (isDataServiceCalls) {
        createAllServiceCallsMarkers(dataList, bounds)
      }
      else {
        createAllTechniciansMarkers(dataList, bounds, selectedTechnicianToRouteLocate)
      }

      // Ajusta o mapa para mostrar todos os markers
      // if (window.map && window.markers.length > 0 && updateTechnicianMarkers) {
      //   window.map.fitBounds(bounds, { padding: 50 });
      // }
    }
  }

  const createAllServiceCallsMarkers = (serviceCalls, bounds) => {
    serviceCalls.forEach((call) => {
      const location = { lat: call.assignedCallLocation.latitude, lng: call.assignedCallLocation.longitude };

      // Verifica se a URL da imagem do cliente é válida
      const isUserPhotoAValidUrl = call.clientProfileImageUrl && call.clientProfileImageUrl.startsWith("http");

      const marker = new window.google.maps.Marker({
        position: location,
        map: window.map,
        title: "cliente",
        icon: {
          url: isUserPhotoAValidUrl ? call.clientProfileImageUrl : "https://blobvitalhubg15.blob.core.windows.net/containervitalhubpedro/imagemPadrao.jpg", // URL da foto do técnico
          // path: google.maps.SymbolPath.CIRCLE, // Opções: CIRCLE, FORWARD_CLOSED_ARROW, BACKWARD_CLOSED_ARROW
          scaledSize: new google.maps.Size(40, 40), // Tamanho do ícone
          origin: new google.maps.Point(0, 0), // Origem do ícone
          anchor: new google.maps.Point(20, 20), // Ponto de ancoragem do ícone
        },

        clickable: true
      });

      // Criar InfoWindow
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div>
            <h1 style="font-size: 16px"><strong>CLIENTE</strong></h1>
            <div style="display: flex; align-items: center;">
              <strong style="margin-right: 10px;">Cliente:</strong>
              <span>${call.clientTradeName}</span>
            </div>
          </div>
        `
      });

      // Adicionar listener de clique
      marker.addListener("click", () => {
        infoWindow.open({
          anchor: marker,
          map: window.map
        });
      });

      // bounds.extend(location);
      window.markers.push(marker);
    });
  }

  const createAllTechniciansMarkers = (technicians, bounds, selectedTechnicianToRouteLocate) => {
    technicians.forEach((technician) => {
      const location = { lat: technician.technicianLocation.latitude, lng: technician.technicianLocation.longitude };

      // Verifica se a URL da imagem do cliente é válida
      const isUserPhotoAValidUrl = technician.technicianProfileImageUrl && technician.technicianProfileImageUrl.startsWith("http");

      // Cria o marker
      const marker = new window.google.maps.Marker({
        position: location,
        map: window.map,
        title: "tecnico",
        icon: {
          url: isUserPhotoAValidUrl ? technician.technicianProfileImageUrl : "https://blobvitalhubg15.blob.core.windows.net/containervitalhubpedro/imagemPadrao.jpg", // URL da foto do técnico

          scaledSize: new google.maps.Size(40, 40), // Tamanho do ícone
          origin: new google.maps.Point(0, 0), // Origem do ícone
          anchor: new google.maps.Point(20, 20), // Ponto de ancoragem do ícone
        },

        clickable: true,
      });

      // Criar InfoWindow
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div>
            <h1 style="font-size: 16px"><strong>TÉCNICO</strong></h1>
            <div style="display: flex; align-items: center;">
              <strong style="margin-right: 10px;">Nome:</strong>
              <span>${technician.technianName}</span>
            </div>
          </div>
        `
      });

      // Adicionar listener de clique
      marker.addListener("click", () => {
        infoWindow.open({
          anchor: marker,
          map: window.map
        });
      });

      // Insere o marker
      bounds.extend(marker.position);
      window.markers.push(marker);

      // Desenha a rota com base nos dados de localização
      if (selectedTechnicianToRouteLocate && selectedTechnicianToRouteLocate.respectiveServiceCallId) {
        createSelectedRoute(selectedTechnicianToRouteLocate);
      }
    });
  }

  const createSelectedRoute = (data) => {
    if (data.assignedCallLocation && data.technicianLocation.latitude != 0 && data.technicianLocation.longitude != 0) {
      const technicianLocation = { lat: data.technicianLocation.latitude, lng: data.technicianLocation.longitude };
      const callLocation = { lat: data.assignedCallLocation.latitude, lng: data.assignedCallLocation.longitude };

      const sampleRoute = {
        origin: {
          lat: technicianLocation.lat,
          lng: technicianLocation.lng
        },
        destination: {
          lat: callLocation.lat,
          lng: callLocation.lng
        },
      };

      drawRoute(sampleRoute);
    } else {
      console.log("Nenhum chamado atual associado ao técnico: ", data.technicianId);
    }
  }


  const drawRoute = (route) => {
    if (window.google && window.google.maps) {
      // Limpa as rotas existentes
      if (window.directionsRenderer) {
        window.directionsRenderer.setMap(null);
      }

      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true // remove marcadores padrão
      });

      window.directionsRenderer = directionsRenderer;
      directionsRenderer.setMap(window.map); // recebe o mapa

      // atualiza a rota
      const { origin, destination, waypoints = [] } = route;

      directionsService.route({
        origin: origin,
        destination: destination,
        waypoints: waypoints.map(wp => ({ location: wp, stopover: true })),
        optimizeWaypoints: true, // Otimiza a ordem dos waypoints
        travelMode: window.google.maps.TravelMode.DRIVING, // Modo DRIVING: carro
        provideRouteAlternatives: true
      }, (response, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(response);
        } else {
          console.error('Erro ao calcular rota:', status);
        }
      });
    }
  }

  useEffect(() => {
    if (connection) {
      connection.on('ReceiveUnavailabilityAlert', data => {
        console.log("Surgiu uma indisponibilidade!! => ", data);

        // Colocar um Toast aqui
        if (data && data.technicianName && data.unavailabilityDescription) {
          toast({
            title: `Técnico ${data.technicianName} está indisponível`,
            description:
              `Descrição: ${data.unavailabilityDescription}\nDuração: ${data.unavailabilityEstimatedDurationTime}`,
            action: (
              <img
                src={data.technicianPerfilPhotoUrl}
                alt="Ícone de notificação"
                className="w-12 h-12 mr-4 rounded-full"
              />
            ),
          });
        }
      });
    }
  }, [connection])

  useEffect(() => {
    if (allServiceCalls.length > 0) {
      updateMarkersInMap(allServiceCalls, true, true);
    }
  }, [allServiceCalls])

  useEffect(() => {
    if (!selectedItem) {
      // Atualiza os markers - sem rota
      updateMarkersInMap(allTechnicins, false, true, null);
      return;
    }

    // Localiza o técnico
    const selectedTechnicianToRouteLocate = selectedItem.individualPersonId
      ? allTechnicins.find(technician => technician.technicianId == selectedItem.technicianId)
      : allTechnicins.find(technician => technician.respectiveServiceCallId == selectedItem.serviceCallId);

    if (selectedTechnicianToRouteLocate) {

      if (!selectedTechnicianToRouteLocate.assignedCallLocation) {
        // Atualiza os markers - sem rota
        updateMarkersInMap(allTechnicins, false, true, null);
        return;
      }
    }

    // Atualiza os markers no mapa com rota
    updateMarkersInMap(allTechnicins, false, true, selectedTechnicianToRouteLocate);
  }, [allTechnicins])

  function generateTabButtonStyle(tabButtonName, activeTabName) {
    const baseClassNames = 'p-2 rounded-lg hover:text-[#124262] text-[#1429379a] transition-all duration-200 scale-100 hover:scale-105';

    let finalClassNames = baseClassNames;

    if (tabButtonName == activeTabName)
      finalClassNames = twMerge([baseClassNames, 'text-[#134668]']);

    return finalClassNames;
  }

  return (
    <div className="h-screen w-full bg-gray-300 overflow-hidden relative">
      <Header />

      <div className="flex h-[100%]">

        <div className="max-sm:hidden w-20 h-full bg-[#FAFAFA] flex flex-col items-center gap-8 z-20 shadow-xl">
          <div className="mt-10 flex flex-col gap-8">
            <button
              className={generateTabButtonStyle('chamados', activeTab)}
              onClick={() => handleTabClick("chamados")}
            >
              <FaHeadset size={30} />
            </button>
            <button
              className={generateTabButtonStyle('tecnicos', activeTab)}
              onClick={() => handleTabClick("tecnicos")}
            >
              <FaUsers size={30} />
            </button>
            <button
              className={generateTabButtonStyle('aprovacoes', activeTab)}
              onClick={() => handleTabClick("aprovacoes")}
            >
              <BiTask size={30} />
            </button>
          </div>
        </div>

        <SideModal
          className="max-sm:hidden"
          isOpen={isModalOpen}
          activeTab={activeTab}
          onClose={() => {
            setIsModalOpen(false);
            setActiveTab(null);
          }}
          onOpenRightModal={openRightModal}
          connection={connection}
          allServiceCalls={allServiceCalls}
          setAllServiceCalls={setAllServiceCalls}
          setAllTechnicians={setAllTechnicians}
          allTechnicins={allTechnicins}
          createSelectedRoute={createSelectedRoute}
        />

        <SideModalRight
          className="max-sm:hidden"
          isOpen={isRightModalOpen}
          item={selectedItem}
          onClose={() => setIsRightModalOpen(false)}
          connection={connection}
        />

        {/* Mapa (exibido em todas as telas) */}
        <div className="flex-1 h-full relative">
          <div className={`flex gap-2 absolute z-40 p-4 transition transform ${isModalOpen ? 'translate-x-[25vw]' : ''} duration-300`}>
            {
              mostRecentMetricsOfCategories &&
              mostRecentMetricsOfCategories.map(metric =>
                <KpiCard
                  kpiCategoryName={metric.metricCategoryName}
                  metricValue={metric.value}
                  metricUnit={metric.metricUnit}
                  deltaPercentage={metric.percentualDelta}
                  key={metric.metricCategoryId}
                  onClick={() => {
                    if (dimensions.width < MIN_WIDTH)
                      return;

                    openRightModal(metric)
                  }}
                />
              )
            }
          </div>
          <div id="map" className="h-[90%] w-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;
