import { InputSearch } from '@/components/Inputs'
import SelectDropdown from '@/components/SelectDropdown'
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getAllTechnician } from '@/service/monitoringService';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

const technicianStatusOptions = [
    { value: -1, label: 'Todos' },
    { value: 0, label: 'Offline' },
    { value: 1, label: 'Indisponível' },
    { value: 2, label: 'Disponível' },
    { value: 3, label: 'Trabalhando' },
]

export default function TechniciansContent({ handleCardSelection }) {
    const [technicians, setTechnicians] = useState([]);

    const [selectedTechnicianStatus, setSelectedTechnicianStatus] = useState(technicianStatusOptions[0]);
    const [searchedText, setSearchedText] = useState(null);

    const fetchTechnicians = async () => {
        try {
            const data = await getAllTechnician(selectedTechnicianStatus.value, searchedText);
            setTechnicians(data);
            console.log(data);
        } catch (error) {
            console.error("Erro ao buscar técnicos:", error);
        }
    };

    useEffect(() => {
        fetchTechnicians();
    }, [selectedTechnicianStatus, searchedText]);

    function getColorByCallStatusId(statusId) {
        switch(statusId) {
            case 0:
                return '#596872';
            case 1:
                return '#EE3F3E';
            case 2: 
                return '#4ECC4C';
            case 3:
                return '#03558C';
            default:
                return '#5C6E7A'
        }
    }

    function makeTechnicianStatusCircle(statusId) {
        const styledClassName = `w-4 h-4 rounded-full`;

        return (
            <span className={styledClassName} style={{ backgroundColor: getColorByCallStatusId(statusId) }}></span>
        );
    }

    return (
        <>
            <div className="pt-10 pb-4 mb-2 border-b border-gray-200 flex justify-center items-center">
                <h2 className="font-nunito-semibold text-[30px] text-[#142937]">
                    Técnicos
                </h2>
            </div>
            <div className="p-4 h-full">
                <div className="w-full flex justify-between px-2 gap-2">
                    <SelectDropdown 
                        options={technicianStatusOptions}
                        value={selectedTechnicianStatus}
                        setValue={setSelectedTechnicianStatus}
                    />
                    <InputSearch 
                        placeholder={"Pesquise por técnicos..."}
                        onSearch={setSearchedText}
                    />
                </div>
                <div className="flex flex-col gap-3 mt-4 overflow-y-scroll h-[70%] px-2">
                    <div className="w-[100%] flex flex-col gap-3 items-center justify-center mt-8">
                        { technicians && technicians.length > 0
                            ? technicians.map((technician) => (
                                <button
                                    key={technician.technicianId}
                                    className="bg-[#FAFAFA] hover:bg-[#f6f6f6] active:bg-[#f0f0f0] w-[100%] rounded-xl h-[60px] shadow-md px-5 transition-transform scale-100 hover:scale-[1.02]"
                                    onClick={() => handleCardSelection(technician)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className='flex items-center gap-5'>
                                            <Avatar>
                                                <AvatarImage className="w-[100%]" src={technician.photoUrlTechnician} />
                                            </Avatar>
                                            <div className="flex flex-col text-start">
                                                <h1 className="font-nunito-semibold">
                                                    {technician.nameTechnician}
                                                </h1>
                                            </div>
                                        </div>
                                        { makeTechnicianStatusCircle(technician.technicianStatusId) }
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
                                   <p className='text-center text-lg w-2/3'>Não foram encontrados técnicos.</p>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
