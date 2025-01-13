import { useFocusEffect, useRouter } from 'expo-router';
import { AppState, Image, Linking, TouchableOpacity, View } from 'react-native';
import { Container, ContainerBox, ContainerFieldValue } from '~/components/Container';
import { Header } from '~/components/Header';
import { Modalize } from 'react-native-modalize';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TextBold, TextExtraBold, TextRegular } from '~/components/Text';
import { LinearGradient } from 'expo-linear-gradient';
import { ButtonComponent } from '~/components/ButtonComponent';
import { MapsComponente } from '~/components/Mapa';
import api from '~/Service/service';
import { userDecodeToken } from '~/Service/Auth';
import { mapskey } from '~/Utils/mapsKey';
import axios from 'axios';


// Import do socket
import * as signalR from '@microsoft/signalr';
import { getCurrentPositionAsync, LocationAccuracy, requestForegroundPermissionsAsync, watchPositionAsync } from 'expo-location';
import { useModal } from '~/Service/Context';
import * as Notifications from "expo-notifications";
import { setupNotificationListeners, requestNotificationsPermission, sendInAppNotification, sendPushNotification } from '~/Service/notificationService.js'



interface CurrentCalledProps {
  serviceCallId: string
  callCode: string
  callStatusId: number
  creationDateTime: string
  serviceTypeId: number
  phoneNumberClient: string
  emailClient: string
  addressIdClient: string
  addressCep: string
  addressStreet: string
  addressNumber: string
  addressComplement?: string
  addressNeighborhood: string
  addressCity: string
  isRecurring: boolean
  conclusionDateTime: string
  urgencyStatusId: number
  description: string
  clientName: string
  clientTradeName: string
  clientPhotoImgUrl: string
  responsibleAttendantName: string
  deadLine: string
}

interface tokenProps {
  id: string | undefined;
  individual_person_id: string;
  technicia_id: string;
  name: any;
  role: any;
  image: string;
  token: any;
}

interface coordsProps {
  lat: number
  lng: number
}


Notifications.requestPermissionsAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
})

export default function Home() {

  const modalizeRef = useRef<Modalize>();

  const { isModalVisible, setModalVisible } = useModal();

  const { connection, setConnection } = useModal();

  const [isOpen, setIsOpen] = useState(false);

  const [tokenUser, setTokenUser] = useState<tokenProps | undefined>();

  const [coords, setCoords] = useState<coordsProps>()

  const router = useRouter();

  // Função para lidar com chamada de notificação 
  // const handleCallNotifications = async () => {
  //   // Obtém status das permissões
  //   const { status } = await Notifications.getPermissionsAsync();

  //   // Verifica se o usuário concedeu permissão
  //   if (status !== "granted") {
  //     alert("Você não deixou as notificações ativas")
  //     return;
  //   }
  // }

  const notificationCall = async (title: string, body: string) => {
    // Obtém status das permissões
    const { status } = await Notifications.getPermissionsAsync();

    // Verifica se o usuário concedeu permissão
    if (status !== "granted") {
      alert("Você não deixou as notificações ativas")
      return;
    }

    // Agenda uma notficação
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        sound: "default",
      },
      trigger: null
    })

  }



  async function getUser() {
    const token = await userDecodeToken();

    // console.log(token);

    if (!token) {
      router.navigate("/login")
    }


    if (token != null) {
      setTokenUser(token)
    }
    await api.get(`/user/get-user-by-id?individualPersonId=${token?.individual_person_id}`)
      .then(response => {
        // console.log(response.data)
      }).catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    getUser()
    getCurrentCalled()

    const subscriptions = setupNotificationListeners();

    const setupNotifications = async () => {
      const token = await requestNotificationsPermission();
      console.log('Expo Push Token:', token?.data);
    };

    setupNotifications();

    return () => {
      subscriptions.receiveSubscription.remove();
      subscriptions.responseSubscription.remove();
    };

  }, [])


  useEffect(() => {
    getCurrentCalled()
  }, [tokenUser])


  // O intuito dessa função é recarregar a tela de home
  // Eu fiz essa função para poder carregar um novo chamado no histórico
  useFocusEffect(
    useCallback(() => {
      getUser()
      getCurrentCalled()
      notificationCall(
        "Teste",
        "Notificação recebida"
      )
    }, [])
  )

  const [currentCalled, setCurrentCalled] = useState<CurrentCalledProps | undefined>()

  async function getCurrentCalled() {
    if (tokenUser) {

      await api.get(`/service-call/get-current-technician-service-call?technicianId=${tokenUser?.technicia_id}`).then((response) => {
        console.log("Chamado atual: ", response.data);
        setCurrentCalled(response.data)
      }).catch((error) => {
        console.log("erro do chamado atual: ", error);
      })
    }
  }

  useEffect(() => {
    getCoordsByCEP()
  }, [currentCalled])

  async function finishCalled() {
    await api.patch(`/service-call/finish?serviceCallId=${currentCalled?.serviceCallId}`).then((response) => {

    })

    setModalVisible(false)
    getCurrentCalled()
    toggleModal()
    notificationCall(
      "Chamado concluído",
      "Notificação recebida"
    )
  }


  const onPositionChange = (position: any) => {
    if (position === 'top') {
      setIsOpen(true);
      setModalVisible(true)
    } else {
      setIsOpen(false);
      setModalVisible(false)
    }
  };

  const toggleModal = () => {
    if (modalizeRef.current) {
      if (isOpen) {
        // Fechar o modal completamente
        modalizeRef.current.close();
        setModalVisible(false)
      }
    }
  };

  const reduceName = (name: string): string => {
    if (name.length > 20) {
      return `${name.substring(0, 20)}...`;
    }
    return name;
  };

  // Funçao da urgencia
  const getUrgencyLabel = (id: number | undefined): string => {
    switch (id) {
      case 0:
        return "Não urgente";
      case 1:
        return "Pouco urgente";
      case 2:
        return "Urgente";
      default:
        return "Desconhecida";
    }
  };

  const renderContentWhenClosed = () => (
    <LinearGradient
      colors={['#F1F1F1', '#FAFAFA']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{
        padding: 20,
      }}
      className='h-[100%]'
    >

      <View className='mt-[3%]  flex-row items-center justify-between'>

        <View className='flex-row gap-[14px] items-center'>

          <Image
            className={'rounded-full w-[55px] h-[55px]'}
            source={currentCalled?.clientPhotoImgUrl.length != 0 ? { uri: currentCalled?.clientPhotoImgUrl } : { uri: "https://blobvitalhubg15.blob.core.windows.net/containervitalhubpedro/imagemPadrao.jpg" }}
          />


          <TextBold style={'text-[18px]'}>
            {currentCalled?.clientName}
          </TextBold>

        </View>


        <View className='w-[18px] h-[18px] bg-[#E8CB0B] rounded-full' />

      </View>

      <ContainerBox style={'w-[85%] gap-[6px] mt-[10px]'}>

        <ContainerFieldValue>
          <TextBold>
            Localização:
          </TextBold>
          <TextRegular>
            {currentCalled?.addressCep}
          </TextRegular>
        </ContainerFieldValue>



        <ContainerFieldValue>
          <TextBold>
            Tipo de chamado:
          </TextBold>
          <TextRegular>
            {currentCalled?.serviceTypeId == 0 ? "Instalação" : "Manutenção"}
          </TextRegular>
        </ContainerFieldValue>

        <ContainerFieldValue>
          <TextBold>
            Status:
          </TextBold>
          <TextRegular>
            Em Andamento
          </TextRegular>
        </ContainerFieldValue>

        <ContainerFieldValue>
          <TextBold>
            Data de abertura do chamado:
          </TextBold>
          <TextRegular>
            {currentCalled?.creationDateTime ? new Date(currentCalled?.creationDateTime).toLocaleDateString('pt-BR') : 'Data não disponível'}
          </TextRegular>
        </ContainerFieldValue>

      </ContainerBox>

    </LinearGradient>
  );

  const renderContent = () => (
    <LinearGradient
      colors={['#F1F1F1', '#FAFAFA']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{
        padding: 20,
      }}
    >

      <View className='mt-[5%]  flex-row items-center justify-between'>

        <View className='flex-row gap-[14px] items-center'>

          <Image
            className={'rounded-full w-[55px] h-[55px]'}
            source={currentCalled?.clientPhotoImgUrl.length != 0 ? { uri: currentCalled?.clientPhotoImgUrl } : { uri: "https://blobvitalhubg15.blob.core.windows.net/containervitalhubpedro/imagemPadrao.jpg" }}
          />


          <TextBold style={'text-[18px]'}>
            {currentCalled?.clientName}
          </TextBold>

        </View>

        <View className='w-[18px] h-[18px] bg-[#E8CB0B] rounded-full' />

      </View>

      <View
        className='border-b my-[7%] border-[#BFBFBF]'
      />


      <ContainerBox style={'w-[85%] gap-[6px] mt-[10px]'}>
        <TextExtraBold style={'mb-[12px]'}>
          Geral
        </TextExtraBold>
        <ContainerFieldValue>
          <TextBold>
            Id do Chamado:
          </TextBold>
          <TextRegular>
            {reduceName(currentCalled?.serviceCallId ?? "")}
          </TextRegular>
        </ContainerFieldValue>



        <ContainerFieldValue>
          <TextBold>
            Data de abertura:
          </TextBold>
          <TextRegular>
            {currentCalled?.creationDateTime ? new Date(currentCalled?.creationDateTime).toLocaleDateString('pt-BR') : 'Data não disponível'}
          </TextRegular>
        </ContainerFieldValue>

        <ContainerFieldValue>
          <TextBold>
            Status:
          </TextBold>
          <TextRegular>
            {currentCalled?.urgencyStatusId == 1 ? "Em Andamento" : ""}
          </TextRegular>
        </ContainerFieldValue>

      </ContainerBox>

      <View
        className='border-b my-[7%] border-[#BFBFBF]'
      />

      <ContainerBox style={'w-[85%] gap-[6px] mt-[10px]'}>
        <TextExtraBold style={'mb-[12px]'}>
          Contatos
        </TextExtraBold>

        <ContainerFieldValue>
          <TextBold>
            Telefone: </TextBold>
          <TextRegular>
            {currentCalled?.phoneNumberClient}
          </TextRegular>
        </ContainerFieldValue>

        <ContainerFieldValue>
          <TextRegular>
            <TextBold>Email: </TextBold>
            {currentCalled?.emailClient}
          </TextRegular>
        </ContainerFieldValue>

        <ContainerFieldValue>

          <TextRegular>
            <TextBold>Local:</TextBold> {currentCalled?.addressCep}
          </TextRegular>
        </ContainerFieldValue>

      </ContainerBox>

      <View
        className='border-b my-[7%] border-[#BFBFBF]'
      />

      <ContainerBox style={'w-[85%] gap-[6px] mt-[10px]'}>
        <TextExtraBold style={'mb-[12px]'}>
          Detalhes
        </TextExtraBold>

        <ContainerFieldValue>
          <TextBold>
            Tipo de chamado: </TextBold>
          <TextRegular>
            {currentCalled?.serviceTypeId == 0 ? "Instalação" : "Manutenção"}
          </TextRegular>
        </ContainerFieldValue>

        <ContainerFieldValue>
          <TextRegular>
            <TextBold>Nivel de prioridade: </TextBold>
            {getUrgencyLabel(currentCalled?.urgencyStatusId)}
          </TextRegular>
        </ContainerFieldValue>

        <ContainerFieldValue>

          <TextRegular>
            <TextBold>Descrição:</TextBold> {currentCalled?.description}
          </TextRegular>
        </ContainerFieldValue>

      </ContainerBox>

      <View
        className='border-b my-[7%] border-[#BFBFBF]'
      />

      <View className='flex-row justify-between w-[100%]'>

        <ButtonComponent
          titleButton='Concluir Chamado'
          style={'w-[75%]'}
          handlePress={finishCalled}
        />

        <ButtonComponent
          style={'w-[15%]'}
          handlePress={() => Linking.openURL(`https://api.whatsapp.com/send/?phone=%2B5511945316782&text&type=phone_number&app_absent=0`)}
        >
          <Image
            source={require('../../assets/Icons/mdi--whatsapp.png')}
            className='self-center w-[60%] h-[60%]'
          />
        </ButtonComponent>
      </View>
    </LinearGradient>
  );

  async function getCoordsByCEP() {
    const CepAndNumber = `${currentCalled?.addressCep} 580`;

    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      CepAndNumber
    )}&key=${mapskey}`;

    const response = await axios.get(geocodingUrl);

    // const { lat, lng }  = response.data.results[0].geometry.location;
    setCoords(response.data.results[0].geometry.location)

    // console.log("As lat e log", coords?.lat.valueOf());
  }



  // const [connection, setConnection] = useState<signalR.HubConnection>();

  function useSignalRConnection(connection: signalR.HubConnection | undefined) {
    useEffect(() => {
      const handleAppStateChange = (nextAppState) => {
        console.log('App State:', nextAppState); // Log para verificar os estados

        if (nextAppState === 'background') {
          try {
            if (connection && connection.state === signalR.HubConnectionState.Connected) {
              connection.stop()
                .then(() => console.log('Expo: Conexão com o servidor signalR finalizada'))
                .catch(err => console.error('Expo: Erro ao encerrar conexão com o servidor signalR', err));
            }
          } catch (error) {
            console.error('Expo: erro ao gerenciar a mudança do estado da aplicação', error);
          }
        } else if (nextAppState === 'active') {
          try {
            if (connection && connection.state === signalR.HubConnectionState.Disconnected) {
              connection.start()
                .then(() => console.log('Expo: Conexão signalR reestabelecida'))
                .catch(err => console.error('Expo: Erro ao reestabelecer conexão com o servidor signalR', err));
            }
          } catch (error) {
            console.error('Expo: Erro ao reestabelecer conexão com o servidor signalR', error);
          }
        }
      };

      const subscription = AppState.addEventListener('change', handleAppStateChange);

      return () => {
        subscription.remove();

        if (connection) {
          connection.stop()
            .catch(err => console.error('Expo: Erro ao parar a conexão com o servidor signalR', err));
        }
      };
    }, [connection]);
  }

  const sendMyLocationToSystem = async (technicianId: string | undefined, lat: number, long: number) => {
    if (connection && connection.state === 'Connected') {
      try {
        await connection.invoke('SendMyLocationToSystem', {
          idTechnician: technicianId,
          latitude: lat,
          longitude: long
        });
      } catch (error) {
        console.error('Erro ao enviar localização:', error);
      }
    } else {
      console.warn('Conexão não está em estado Connected. Não enviando localização.');
    }
  }

  const startConnection = useCallback(async () => {

    if (!tokenUser) {
      return console.log("Token Inválido, não será possível enviar localização");
    }


    // guardando o token sem as ""
    const tokenWebSocket = tokenUser?.token.replace(/^["']|["']$/g, '')

    try {
      // Instancia e configura o objeto HubConnection
      const connectionBuilder = new signalR.HubConnectionBuilder()
        .configureLogging(signalR.LogLevel.Debug)  // add this for diagnostic clues
        .withUrl(`http://172.16.39.54:5281/communicationHub`, {
          accessTokenFactory: () => tokenWebSocket,
          transport: signalR.HttpTransportType.WebSockets
        }) // URL da API
        // .withAutomaticReconnect()
        .build();

      // Inicia a conexão
      await connectionBuilder.start()
        .catch((error) => {
          return console.error(error.toString());
        });

      // Guarda a conexão no state
      setConnection(connectionBuilder);

    } catch (error) {
      console.log(error);
    }
  }, [tokenUser?.token])

  useSignalRConnection(connection);

  async function getPositionAndSend() {
    try {
      await watchPositionAsync({
        accuracy: LocationAccuracy.High,
        // timeInterval: 1000,
        distanceInterval: 10
      }, async (response) => {

        if (connection && connection.state === 'Connected') {
          await sendMyLocationToSystem(
            tokenUser?.technicia_id,
            response.coords.latitude,
            response.coords.longitude
          );
        } else {
          console.warn('Conexão não está pronta para enviar localização.');
        }
      })
    } catch (error) {
      console.log(error);
    }

  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (connection && connection.state === 'Connected') {
        getPositionAndSend();
      }
    }, 10000);

    // Limpa o intervalo ao desmontar
    return () => clearInterval(interval);
  }, [connection, tokenUser])

  useEffect(() => {
    startConnection();
    return () => {
      if (connection) {
        console.log('Cleaning up connection...');
        connection.stop();
      }
    };

  }, [tokenUser?.token])

  useEffect(() => {
    if (connection) {
      connection.on('ReceiveFeedback', data => {
        sendInAppNotification('Atenção!', data);
        console.log(data);
      });

      connection.on('ReceiveFeedbackToMe', data => {
        sendInAppNotification('Novo chamado!', data);
        getCurrentCalled();
        console.log(data);

        notificationCall(
          "Você recebeu um novo chamado",
          "Você tem um novo serviço disponivel, recarregue a tela principal"
        )
      });
    }
  }, [])


  return (
    <>
      {
        tokenUser != null && (
          <>
            <Header />
            <Container
            // style={'border'}
            >
              {
                coords ? (
                  <MapsComponente
                    latitude={coords?.lat}
                    longitude={coords?.lng}
                  />
                ) :
                  <MapsComponente />
              }



              {
                currentCalled ? (
                  <TouchableOpacity
                    className='absolute top-[50%] right-[10%]'
                    onPress={() => Linking.openURL(`waze://?ll=${coords?.lat},${coords?.lng}&navigate=yes`)}
                  >
                    <Image
                      source={require("../../assets/Icons/logoWaze.png")}
                      className='w-[60px] h-[60px] rounded-full'
                    />
                  </TouchableOpacity>) : null
              }



            </Container>

            {

              currentCalled ? (
                <Modalize
                  ref={modalizeRef}
                  modalStyle={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.45,
                    shadowRadius: 16,
                  }}
                  alwaysOpen={300}
                  handlePosition="inside"
                  onPositionChange={onPositionChange}
                >
                  {
                    isOpen ? (
                      renderContent()
                    ) : (
                      renderContentWhenClosed()
                    )
                  }
                </Modalize>

              ) : null

            }

          </>
        )
      }

    </>
  );
}


