import { InputSearch } from '@/components/Inputs'
import SelectDropdown from '@/components/SelectDropdown'
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getAllTechnician, getOpenedCalled } from '@/service/monitoringService';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

const serviceTypesOptions = [
    { value: 2, label: 'Todos' },
    { value: 0, label: 'Instalação' },
    { value: 1, label: 'Manutenção' },
]

export default function ApprovalsContent({ handleCardSelection }) {
    const [serviceCalls, setServiceCalls] = useState([]);

    const [selectedServiceType, setSelectedServiceType] = useState(serviceTypesOptions[0]);
    const [searchedText, setSearchedText] = useState(null);

    const fetchOpenedCalls = async () => {
        try {
            const data = await getOpenedCalled(selectedServiceType.value, searchedText);
            setServiceCalls(data);
            console.log(data)
        } catch (error) {
            console.error("Erro ao buscar chamados:", error);
        }
    };

    useEffect(() => {
        fetchOpenedCalls();
    }, [selectedServiceType, searchedText]);

    return (
        <>
            <div className="pt-10 pb-4 mb-2 border-b border-gray-200 flex justify-center items-center">
                <h2 className="font-nunito-semibold text-[30px] text-[#142937]">
                    Aprovações
                </h2>
            </div>
            <div className="p-4 h-full">
                <div className="w-full flex justify-between px-2 gap-2">
                    <SelectDropdown 
                        options={serviceTypesOptions}
                        value={selectedServiceType}
                        setValue={setSelectedServiceType}
                    />
                    <InputSearch 
                        placeholder={"Pesquise por empresas..."}
                        onSearch={setSearchedText}
                    />
                </div>
                <div className="flex flex-col gap-3 mt-4 overflow-y-scroll h-[70%] px-2">
                    <div className="w-[100%] flex flex-col gap-3 items-center justify-center mt-8">
                        { serviceCalls && serviceCalls.length > 0
                            ? serviceCalls.map((call) => (
                                <button
                                    key={call.idServiceCall}
                                    className="bg-[#FAFAFA] hover:bg-[#f6f6f6] active:bg-[#f0f0f0] w-[100%] rounded-xl h-[80px] xl:h-[68px] shadow-md px-5 transition-transform scale-100 hover:scale-[1.02] overflow-x-hidden"
                                    onClick={() => handleCardSelection(call)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className='flex items-center gap-5'>
                                            <Avatar>
                                                <AvatarImage className="w-[100%]" src={call.clientPhotoUrl} />
                                            </Avatar>
                                            <div className="flex flex-col text-start">
                                                <h1 className="font-nunito-bold text-[16px] mb-[-2px]">
                                                    {call.tradeName}
                                                </h1>
                                                <div className="flex flex-col xl:flex-row items-start xl:items-center gap-0 xl:gap-2">
                                                    <h2 className="font-nunito-regular">
                                                        {call.serviceCallTypeId == 0
                                                            ? "Instalação"
                                                            : "Manutenção"}
                                                    </h2> 

                                                    <span className="w-[6px] h-[6px] rounded-full hidden xl:block bg-[#142937]"></span>

                                                    <h2 className="font-nunito-regular">
                                                        {new Date(
                                                            call.serviceCallCreationDateTime
                                                        ).toLocaleDateString("pt-BR")}
                                                    </h2>
                                                </div>
                                            </div>
                                        </div>
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
                                   <p className='text-center text-lg w-2/3'>Não foram encontrados chamados abertos.</p>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
