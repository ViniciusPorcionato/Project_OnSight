import { InputSearch } from '@/components/Inputs'
import SelectDropdown from '@/components/SelectDropdown'
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getAllCalled } from '@/service/monitoringService';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

const callStatusOptions = [
    { value: -1, label: 'Todos' },
    { value: 0, label: 'Abertos' },
    { value: 1, label: 'Em progresso' },
    { value: 2, label: 'Finalizados' },
    { value: 3, label: 'Cancelados' },
]

export default function ServiceCallsContent({ connection, handleCardSelection }) {

    const [serviceCalls, setServiceCalls] = useState();

    const [selectedCallStatus, setSelectedCallStatus] = useState(callStatusOptions[0]);
    const [searchedText, setSearchedText] = useState(null);

    const fetchServiceCalls = async () => {
        try {
            const data = await getAllCalled(selectedCallStatus.value, searchedText);
            setServiceCalls(data);
            console.log(data);
        } catch (error) {
            console.error("Erro ao buscar chamados:", error);
        }
    };

    const fetchRealtimeLocationServiceCalls = async () => {
        try {
            if (connection)
                await connection.invoke('GetAllServiceCalls');
            else
                console.log("Connection está vazio!");
        } catch (error) {
            console.error("Erro ao buscar chamados:", error);
        }
    }

    useEffect(() => {
        fetchServiceCalls();
        fetchRealtimeLocationServiceCalls();
    }, [selectedCallStatus, searchedText]);

    function getColorByCallStatusId(statusId) {
        switch (statusId) {
            case 0:
                return '#E89F10';
            case 1:
                return '#03558C';
            case 2:
                return '#4ECC4C';
            case 3:
                return '#EE3F3E';
            default:
                return '#5C6E7A'
        }
    }

    function makeCallStatusCircle(statusId) {
        const styledClassName = `w-4 h-4 rounded-full`;

        return (
            <span className={styledClassName} style={{ backgroundColor: getColorByCallStatusId(statusId) }}></span>
        );
    }

    return (
        <>
            <div className="pt-10 pb-4 mb-2 border-b border-gray-200 flex justify-center items-center">
                <h2 className="font-nunito-semibold text-[30px] text-[#142937]">
                    Chamados
                </h2>
            </div>
            <div className="p-4 h-full">
                <div className="w-full flex justify-between px-2 gap-2">
                    <SelectDropdown
                        options={callStatusOptions}
                        value={selectedCallStatus}
                        setValue={setSelectedCallStatus}
                    />
                    <InputSearch
                        placeholder={"Pesquise por empresa..."}
                        onSearch={setSearchedText}
                    />
                </div>
                <div className="flex flex-col gap-3 mt-4 overflow-y-scroll h-[70%] px-2">
                    <div className="w-[100%] flex flex-col gap-3 items-center justify-center">
                        {serviceCalls && serviceCalls.length > 0
                            ? serviceCalls.map((call) => (
                                <button
                                    key={call.serviceCallId}
                                    className="bg-[#FAFAFA] hover:bg-[#f6f6f6] active:bg-[#f0f0f0] w-[100%] rounded-xl h-[60px] shadow-md px-5 transition-transform scale-100 hover:scale-[1.02]"
                                    onClick={() => handleCardSelection(call)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className='flex items-center gap-5'>
                                            <Avatar>
                                                <AvatarImage className="w-[100%]" src={call.clientPhotoUrl} />
                                            </Avatar>
                                            <div className="flex flex-col text-start">
                                                <h1 className="font-nunito-semibold">
                                                    {call.clientTradeName}
                                                </h1>
                                            </div>
                                        </div>
                                        {makeCallStatusCircle(call.serviceCallStatusId)}
                                    </div>

                                </button>
                            ))
                            : (
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
                    </div>
                </div>
            </div>
        </>
    )
}
