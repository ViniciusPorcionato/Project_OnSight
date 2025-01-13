import { RefObject, useEffect, useRef, useState } from "react";
import { Alert, Button, Image, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { TextBold, TextExtraBold, TextRegular } from "../Text";
import InputComponent from "../Input";
import RNPickerSelect from 'react-native-picker-select';
import { ButtonComponent } from "../ButtonComponent";
import { ContainerBox, ContainerFieldValue } from "../Container";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons/faClose'
import { PicturePerfil } from "../PicturePerfil";
import { Modalize } from "react-native-modalize";
import { IHandles } from "react-native-modalize/lib/options";


interface JustifyModalProps {
    modalVisible: boolean;
    onClose: () => void;
    modalizeRef?: RefObject<IHandles> | undefined;
}

export const JustifyModal: React.FC<JustifyModalProps> = ({
    modalVisible,
    modalizeRef,
    onClose
}) => {

    //const modalizeRef = useRef<Modalize>(null);
    /*
        useEffect(() => {
            openModal
        })
        const openModal = () => {
            if (modalizeRef?.current) {
              if (modalVisible) {
                modalizeRef.current.open();
                console.log(modalizeRef.current);
                
              }
            }
          };
    
      */
    return (
        <>
            <Modalize
                ref={modalVisible ? modalizeRef?.current?.open : modalizeRef?.current?.close}
                modalStyle={{
                    flex: 1,
                    height: 150
                }}
                handlePosition="inside"
                snapPoint={200}
            >
                <View
                    className="pt-[4%] absolute rounded-t-[12px] bottom-0 w-[100%] h-[70%] justify-evenly items-center bg-[#FCFCFC]"
                >

                    <View className="items-center mb-[4%]">
                        <TextBold style='text-[24px]'>Justifique sua</TextBold>
                        <TextBold style='text-[24px]'>Indisponibilidade</TextBold>
                    </View>

                    <View className=" h-[45%] mb-[7%] gap-[8px]">
                        <InputComponent
                            placeholder="Escreva uma justificativa para sua
indisponibilidade nesse momento..."
                            style='h-[67%] '
                        />

                        <View className="border rounded-[10px]">
                            <RNPickerSelect
                                onValueChange={(value) => console.log(value)}


                                placeholder={{
                                    label: 'Tempo estimado de inatividade',
                                    value: null,

                                }}

                                items={[
                                    { label: '1h', value: 'football' },
                                    { label: '2h', value: 'baseball' },
                                    { label: '3h', value: 'hockey' },
                                ]}
                            />
                        </View>
                    </View>

                    <ButtonComponent
                        handlePress={onClose}
                        titleButton="Indisponibilizar-se"
                    />

                </View>


            </Modalize>
        </>
    )
}

interface DetailsCalledModalProps {
    modalVisible: boolean;
    onClose: () => void;
    called: any;
}

export const DetailsCalledModal: React.FC<DetailsCalledModalProps> = ({
    modalVisible,
    onClose,
    called
}) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.45,
                shadowRadius: 16,
            }}
        >
            {
                called != null && (
                    <View className="border absolute left-[10%] top-[20%] items-center justify-center gap-[15px] w-[80%] h-[60%] rounded-[12px] bg-white">

                        <View className='absolute flex-row gap-[14px] items-center right-[77%] top-[4%] w-[55px] h-[55px]'>
                            <Image
                                className={'rounded-full w-[55px] h-[55px]'}
                                source={{ uri: called.image }}
                            />

                            <TextBold style={'text-[18px]'}>
                                {called.nameEnterprise}
                            </TextBold>

                        </View>

                        <TouchableOpacity
                            className="absolute left-[80%] top-[5%]"
                            onPress={onClose}
                        >
                            <FontAwesomeIcon
                                icon={faClose}
                                size={35}
                            />
                        </TouchableOpacity>

                        <ContainerBox style={'w-[85%] gap-[6px] mt-[10px]'}>
                            <TextExtraBold style={'mb-[12px]'}>
                                Geral
                            </TextExtraBold>
                            <ContainerFieldValue>
                                <TextBold>
                                    Id do Chamado:
                                </TextBold>
                                <TextRegular>
                                    {called.id}
                                </TextRegular>
                            </ContainerFieldValue>



                            <ContainerFieldValue>
                                <TextBold>
                                    Data:
                                </TextBold>
                                <TextRegular>
                                    {called.date}
                                </TextRegular>
                            </ContainerFieldValue>

                            <ContainerFieldValue>
                                <TextBold>
                                    Status:
                                </TextBold>
                                <TextRegular>
                                    {called.status}
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
                                    {called.typeCalled}
                                </TextRegular>
                            </ContainerFieldValue>

                            <ContainerFieldValue>
                                <TextRegular>
                                    <TextBold>Nivel de prioridade: </TextBold>
                                    {called.priorityLevel}
                                </TextRegular>
                            </ContainerFieldValue>

                            <ContainerFieldValue>

                                <TextRegular>
                                    <TextBold>Descrição:</TextBold> {called.description}
                                </TextRegular>
                            </ContainerFieldValue>

                        </ContainerBox>
                    </View>
                )
            }

        </Modal>
    )
}

