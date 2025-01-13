/* eslint-disable prettier/prettier */
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ContainerBox, ContainerFieldValue } from '~/components/Container';
import { LinearGradient } from 'expo-linear-gradient';
import { PicturePerfil } from '~/components/PicturePerfil';
import { NameTitle, TextBold, TextExtraBold, TextRegular } from '~/components/Text';
import { Modalize } from 'react-native-modalize';
import InputComponent from '~/components/Input';
import RNPickerSelect from 'react-native-picker-select';
import { ButtonComponent } from '~/components/ButtonComponent';
import api from '~/Service/service';
import { userDecodeToken } from '~/Service/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useModal } from '~/Service/Context';
import * as Notifications from "expo-notifications";



interface User {
  profileImageUrl: string;
  userName: string;
  email: string;
  phoneNumber: string;
  cpf: string;
  birthDate: string;
  status: number;
}

interface CalledUserProps {
  idServiceCall: string,
  callStatusId: number,
  creationDateTime: string,
  callDescription: string,
  callServiceTypeId: number,
  callUrgencyStatusId: number,
  tradeName: string,
  profileImageUrl: string

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


export default function Home() {
  const [user, setUser] = useState<User>();
  const [calledUser, setCalledUser] = useState<CalledUserProps[]>([]);
  const [tokenUser, setTokenUser] = useState<tokenProps | undefined>();
  const [status, setStatus] = useState<number>();

  const { connection, setConnection } = useModal();

  const notificationCalledSucess = async () => {
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
        title: "Chamado concluído",
        body: "Notificação recebida.",
      },
      trigger: null
    })
  }


  async function getUser() {
    const token = await userDecodeToken();

    if (token) {
      console.log(token.technicia_id);

      setTokenUser(token)
    }
    await api.get(`/user/get-user-by-id?individualPersonId=${token?.individual_person_id}`)
      .then(response => {
        setUser(response.data)
      }).catch(error => {
        console.log("Resposta do get-user-by-id", error);
      })

    await api.get(`/user/technician/${token?.technicia_id}/status`).then((response) => {
      setStatus(response.data)
      // console.log("Teste: ", response.data);

    }).catch(error => {
      console.log("Get-Technician", error);

    })
  }

  async function getCallHistory() {
    await api.get(`/service-call/get-technician-call-history?technicianId=${tokenUser?.technicia_id}`)
      .then(response => {
        // console.log(response.data)
        setCalledUser(response.data)

      }).catch(error => {
        console.log("Call-History ", error);
      })
  }


  // Registrar indisponibilidade
  const [visibilityDetailsModal, setVisibilityDetailsModal] = useState(false)
  const modalizeRefDetails = useRef<Modalize>(null);
  const openModalDetails = (called: any) => {

    if (visibilityDetailsModal) {
      setVisibilityDetailsModal(false)
      setModalVisible(false)
    }
    if (modalizeRefDetails.current) {

      if (!visibilityDetailsModal) {
        modalizeRefDetails.current.open();
        setVisibilityDetailsModal(true)
        setModalVisible(true)
        setCalledSelect(called)
      }
    }
  };


  async function registerUnavaliability(data: registerUnavaliabilityProps) {
    let technicianData = null;

    await api.post(`/user/technician/register-unavaliability`, {
      technicianId: tokenUser?.technicia_id,
      reasonDescription: data.justify,
      estimatedDurationTime: data.estimatedDurationTime
    }).then((response) => {
      technicianData = response.data;
    }).catch(error => {
      console.log("unavaliability ", error);
    })

    if (technicianData) {
      await connection?.invoke('SendUnavailabilityAlertToInternalUsers', technicianData);
    }

    await api.get(`/user/technician/${tokenUser?.technicia_id}/status`).then((response) => {
      setStatus(response.data)
    })

    handleClose()
  }

  useEffect(() => {
    getUser()
    getCallHistory()
  }, [status])


  useEffect(() => {
    getCallHistory()
  }, [user])


  // O intuito dessa função é recarregar a tela de perfil
  // Eu fiz essa função para poder carregar um novo chamado no histórico
  useFocusEffect(
    useCallback(() => {
      getUser()
      getCallHistory()
    }, [status])
  )




  // Configurações do Modal -----------------------------------------------
  const [calledSelect, setCalledSelect] = useState<CalledUserProps | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const { isModalVisible, setModalVisible } = useModal();

  const modalizeRef = useRef<Modalize>(null);

  const openModal = () => {
    if (modalizeRef.current) {
      if (isOpen) {
        setIsOpen(false)
        setModalVisible(false)
      }

      if (!isOpen) {
        modalizeRef.current.open();
        setIsOpen(true)
        setModalVisible(true)
      }
    }

    // console.log(isOpen);

  };

  const handleClose = () => {
    if (modalizeRef.current) {
      if (isOpen) {
        modalizeRef.current.close();
        setIsOpen(false)
      }
    }
  };


  // Configurações do Modal -----------------------------------------------

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


  const getStatusLabel = (id: number | undefined): string => {
    switch (id) {
      case 0:
        return "bg-[#BFBFBF]";
      case 1:
        return "bg-[#D40D0C]";
      case 2:
        return "bg-[#39D313]";
      case 3:
        return "bg-[#E89F10]";
      default:
        return "bg-white"
    }
  };


  async function handleLogout() {
    await AsyncStorage.removeItem("token");
    router.replace('/login');
  }



  // Validações do formulário
  type registerUnavaliabilityProps = {
    justify: string;
    estimatedDurationTime: string;
  };

  const { control, handleSubmit, formState: { errors } } = useForm<registerUnavaliabilityProps>();

  const onClose = () => {
    console.log("O modal foi fechado.");
    setModalVisible(false)

    setVisibilityDetailsModal(false)
    setIsOpen(false)
  };

  return (
    <>
      {
        user != null && (
          <>
            <LinearGradient
              colors={['#03558c', '#124262']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                width: '100%',
                height: '20%',
                borderRadius: 12,
                alignItems: 'flex-end',
                justifyContent: 'flex-end'
              }}
            >
              <TouchableOpacity onPress={handleLogout}>
                <Image
                  source={require("../../assets/Icons/icon-logout.png")}
                  className='w-[24px] h-[24px] m-[3%]'
                />
              </TouchableOpacity>
            </LinearGradient>


            <Modalize
              ref={modalizeRef}
              modalStyle={{
                flex: 1,
              }}
              handlePosition="inside"
              snapPoint={550}
              onClose={onClose}
            >
              <View
                className=" pt-[6%] gap-2 rounded-t-[12px] bottom-0 w-[100%] h-[530px] justify-beetwen items-center bg-[#FCFCFC]"
              >

                <View className="items-center mt-[5%] mb-[4%]">
                  <TextBold style='text-[24px]'>Justifique sua</TextBold>
                  <TextBold style='text-[24px]'>Indisponibilidade</TextBold>
                </View>

                <View className=" w-[90%] h-[55%] mb-[7%] gap-[8px]">

                  <Controller
                    control={control}
                    name="justify"
                    rules={{
                      required: "A justificativa é obrigatória.",
                      minLength: {
                        value: 5,
                        message: "Justificativa insuficiente. Dê mais detalhes.",
                      },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <InputComponent
                        placeholder="Escreva uma justificativa para sua
indisponibilidade nesse momento..."
                        style='w-[100%] h-[67%] '
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                  {errors.justify && <Text className=" mt-[-19px] mb-[3%] text-red-500">{errors.justify.message}</Text>}

                  <View className="border rounded-[10px]">
                    <Controller
                      control={control}
                      name="estimatedDurationTime"
                      rules={{
                        required: "O tempo estimado é obrigatório.",
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <RNPickerSelect
                          placeholder={{
                            label: 'Tempo estimado de inatividade',
                            value: null,

                          }}

                          items={[
                            { label: '1 Min', value: '00:01:000' },
                            { label: '2 Min', value: '00:02:000' },
                            { label: '3 Min', value: '00:03:000' },
                          ]}
                          onValueChange={onChange}
                          value={value}
                        />
                      )}
                    />
                  </View>
                  {errors.estimatedDurationTime && <Text className=" mt-[-10px] mb-[5%] text-red-500">{errors.estimatedDurationTime.message}</Text>}
                </View>

                <ButtonComponent
                  handlePress={handleSubmit(registerUnavaliability)}
                  style={'w-[90%]'}
                  titleButton="Indisponibilizar-se"
                />

              </View>
            </Modalize >

            <Modalize
              ref={modalizeRefDetails}
              modalStyle={{
                flex: 1,
                height: 150
              }}
              handlePosition="inside"
              snapPoint={380}
              onClose={onClose}
            >

              <View className="mt-[5%]  items-center justify-center gap-[15px] rounded-[12px] bg-white">

                <View className='flex-row gap-[14px] items-center top-[4%] w-[90%] h-[55px]'>
                  <Image
                    className={'rounded-full w-[55px] h-[55px]'}
                    source={{ uri: calledSelect?.profileImageUrl }}
                  />


                  <TextBold style={'text-[18px]'}>
                    {calledSelect?.tradeName}
                  </TextBold>

                </View>



                <ContainerBox style={'w-[85%] gap-[6px] mt-[10px]'}>
                  <TextExtraBold style={'mb-[12px]'}>
                    Geral
                  </TextExtraBold>
                  <ContainerFieldValue>
                    <TextBold>
                      Id do Chamado:
                    </TextBold>
                    <TextRegular>
                      {reduceName(calledSelect?.idServiceCall ?? "")}
                    </TextRegular>
                  </ContainerFieldValue>



                  <ContainerFieldValue>
                    <TextBold>
                      Data:
                    </TextBold>
                    <TextRegular>
                      {calledSelect?.creationDateTime ? new Date(calledSelect?.creationDateTime).toLocaleDateString('pt-BR') : 'Data não disponível'}
                    </TextRegular>
                  </ContainerFieldValue>

                  <ContainerFieldValue>
                    <TextBold>
                      Status:
                    </TextBold>
                    <TextRegular>
                      {calledSelect?.callStatusId == 2 ? "Concluído" : "Pendente"}
                    </TextRegular>
                  </ContainerFieldValue>

                </ContainerBox>

                <ContainerBox style={'w-[85%] gap-[6px] mt-[10px]'}>
                  <TextExtraBold style={'mb-[12px]'}>
                    Detalhes
                  </TextExtraBold>

                  <ContainerFieldValue>
                    <TextBold>
                      Tipo de chamado: </TextBold>
                    <TextRegular>
                      {calledSelect?.callServiceTypeId == 0 ? "Intalação" : "Manutenção"}
                    </TextRegular>
                  </ContainerFieldValue>

                  <ContainerFieldValue>
                    <TextRegular>
                      <TextBold>Nivel de prioridade: </TextBold>
                      {getUrgencyLabel((calledSelect?.callUrgencyStatusId))}
                    </TextRegular>
                  </ContainerFieldValue>

                  <ContainerFieldValue>

                    <TextRegular>
                      <TextBold>Descrição:</TextBold> {calledSelect?.callDescription}
                    </TextRegular>
                  </ContainerFieldValue>

                </ContainerBox>
              </View>
            </Modalize>



            <TouchableOpacity
              className='absolute left-[33%] top-[9%] w-[130px] h-[130px] rounded-full bg-[#fafafa] items-center justify-center'
              onPress={openModal}
            >
              <PicturePerfil
                imagePerfil={tokenUser?.image}
              />

              <View className={`justify-center items-center absolute right-[20px] top-[80%] w-[20px] h-[20px] bg-[#fafafa] rounded-full`}>
                <View className={`w-[14px] h-[14px] ${getStatusLabel(status)} rounded-full`} />
              </View>
            </TouchableOpacity>

            <View
              // style={{ flex: 1 }}
              className='flex-1 mt-[15%] items-center'
            >
              <NameTitle
                name={user?.userName}
              />

              <TextRegular style={'mb-[5%]'}>
                {tokenUser?.role == 2 ? "Técnico" : ""}
              </TextRegular>

              <ContainerBox style={'h-[18%] w-[85%] flex-column justify-between gap-[6px] mb-[6%]'}>
                <ContainerFieldValue>
                  <TextBold>
                    Email:
                  </TextBold>
                  <TextRegular>
                    {user.email}
                  </TextRegular>
                </ContainerFieldValue>

                <ContainerFieldValue>
                  <TextBold>
                    Telefone:
                  </TextBold>
                  <TextRegular>
                    {user.phoneNumber}
                  </TextRegular>
                </ContainerFieldValue>

                <ContainerFieldValue>
                  <TextBold>
                    CPF:
                  </TextBold>
                  <TextRegular>
                    {user.cpf}
                  </TextRegular>
                </ContainerFieldValue>

                <ContainerFieldValue>
                  <TextBold>
                    Nascimento:
                  </TextBold>
                  <TextRegular>
                    {user?.birthDate ? new Date(user.birthDate).toLocaleDateString('pt-BR') : 'Data não disponível'}
                  </TextRegular>
                </ContainerFieldValue>
              </ContainerBox>

              <TextBold style={'text-[24px] mb-[6%]'}>Histórico</TextBold>

              {/* Lista de chamados */}

              <View className='w-[100%] items-center h-[44%] '>
                <FlatList
                  className='w-[85%]'
                  // style={{flex:1}}
                  scrollEnabled={true}
                  keyExtractor={(item) => item.idServiceCall}
                  data={calledUser}
                  renderItem={({ item }) =>
                  (
                    <TouchableOpacity
                      onPress={() => openModalDetails(item)}
                      className='bg-white shadow-md flex-row gap-[12px] pl-[12px] items-center w-[100%] h-20 rounded-[16px] m-[1.5%]'
                    >

                      <Image
                        source={item.profileImageUrl.length > 0 ? { uri: item.profileImageUrl } : { uri: "https://blobvitalhubg15.blob.core.windows.net/containervitalhubpedro/imagemPadrao.jpg" }}
                        className='w-[45px] h-[45px] rounded-full'
                      />

                      <View>
                        <Text>
                          {item.tradeName}
                        </Text>

                        <View
                          className='flex-row gap-[6px]'
                        >
                          <Text>
                            {/* {user?.birthDate ? new Date(user.birthDate).toLocaleDateString('pt-BR') : 'Data não disponível'} */}
                            {item.creationDateTime ? new Date(item.creationDateTime).toLocaleDateString('pt-BR') : 'Data não disponível'}
                          </Text>
                          <TextBold>•</TextBold>
                          <Text>
                            {item.callStatusId == 2 ? "Concluído" : "Cancelado"}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                  )
                  }
                />

              </View>
            </View>
          </>
        )
      }

    </>
  );
}
