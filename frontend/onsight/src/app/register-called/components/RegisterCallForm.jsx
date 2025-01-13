import Form from '@/components/Form';
import { useYupValidationResolver } from '@/components/Form/formValidationConfig';
import { toast } from '@/hooks/use-toast';
import { UserContext } from '@/providers/userContext';
import { registerCalled } from '@/service/calledService';
import { getAllClients } from '@/service/userManagementService';
import { registerCallByAttendantSchema, registerCallSchema } from '@/validations/registerCallSchema';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { IoIosSend } from 'react-icons/io';

export default function RegisterCallForm({ isClient }) {
    const [clients, setClients] = useState([]);

    const { user } = useContext(UserContext);

    const formMethods = useForm({
        resolver: useYupValidationResolver(isClient ? registerCallSchema : registerCallByAttendantSchema),
    });

    const {
        formState: { errors },
        register,
        watch,
        setValue,
        reset
    } = formMethods;

    const cepInformed = watch('cep');

    async function handleSubmit(data) {
        try {
            const calledData = {
                clientId: data.clientId || user.client_id,
                contactEmail: data.email,
                contactPhoneNumber: data.phoneNumber,
                addressCEP: data.cep,
                addressNumber: data.number,
                addressComplement: data.complement,
                serviceType: parseInt(data.serviceTypeId, 10),
                callReasonDescription: data.description,
                isRecurringCall: data.isRecurringCall,
            };

            const response = await registerCalled(calledData);

            console.log("Chamado registrado com sucesso:", response.data);

            toast({
                title: "Chamado Criado com sucesso !",
                description: `Chamado foi criado com sucesso.`,
            });

            reset();
        } catch (error) {
            console.log(error);
        }
    }

    const handleCEPChange = async () => {
        if (!cepInformed)
            return;

        if (cepInformed.length === 8) {
            console.log('entrouu');
            try {
                const response = await axios.get(
                    `https://viacep.com.br/ws/${cepInformed}/json/`
                );

                if (response.data && !response.data.erro) {
                    setValue('neightborhood', response.data.bairro || "");
                    setValue('street', response.data.logradouro || "");
                } else {
                    console.log("CEP não encontrado.");
                }
            } catch (error) {
                console.error("Erro ao buscar CEP:", error);
                console.log("Erro ao buscar o CEP. Verifique sua conexão e tente novamente.");
            }
        }

        if (cepInformed.length === 0) {
            setValue('neightborhood', "");
            setValue('street', "");
        }
    };

    useEffect(() => {
        handleCEPChange();
    }, [cepInformed && cepInformed.length])

    useEffect(() => {
        // Função para buscar os clientes
        const fetchClients = async () => {
            try {
                const clientsData = await getAllClients();
                setClients(clientsData); // Atualiza o estado com a lista de clientes
                console.log(clientsData)
            } catch (error) {
                console.error("Erro ao buscar clientes:", error);
            }
        };

        if (!isClient)
            fetchClients();
    }, []);

    return (
        <Form.Container
            formMethods={formMethods}
            onSubmit={handleSubmit}
            className='flex flex-col gap-2 my-4 pb-2 w-[90%] sm:w-[70%]'
        >
            {
                !isClient && (
                    <>
                        <select
                            className="w-full h-auto bg-white mt-2 p-2 rounded-lg border border-[#142937] font-nunito placeholder-[#124262] text-[#124262]"
                            {...register('clientId')}
                        >
                            <option value="">Selecione o cliente</option>
                            {clients.map((client) => (
                                <option key={client.clientId} value={client.clientId}>
                                    {client.tradeName}{" "}
                                </option>
                            ))}
                        </select>
                        {errors.clientId && <p className='text-[#EE3F3E]'>*{errors.clientId.message}</p>}
                    </>
                ) 
            }

            <Form.Input
                placeholder="Email"
                type="email"
                name="email"
                containerClassname='w-full'
            />

            <Form.Input
                placeholder="Cel"
                type="tel"
                name="phoneNumber"
                containerClassname='w-full'
                mask='(00) 00000-0000'
            />

            <div className="w-full flex flex-col sm:flex-row  gap-x-5 gap-y-2">
                <Form.Input
                    placeholder="CEP"
                    type="text"
                    name="cep"
                    mask='00000-000'
                    containerClassname='w-full sm:w-[40%]'
                />
                <Form.Input
                    placeholder="Bairro"
                    type="text"
                    name="neightborhood"
                    containerClassname='w-full sm:w-[60%]'
                />
            </div>

            <div className="w-full flex flex-col sm:flex-row  gap-x-5 gap-y-2">
                <Form.Input
                    placeholder="Rua"
                    type="text"
                    name="street"
                    containerClassname='w-full sm:w-[60%]'
                />
                <Form.Input
                    placeholder="Número"
                    type="text"
                    name="number"
                    containerClassname='w-full sm:w-[40%]'
                />
            </div>

            <Form.Input
                placeholder="Complemento"
                type="text"
                name="complement"
                containerClassname='w-full'
            />

            <select
                className="w-full h-auto mt-2 p-2 rounded-lg border bg-white border-[#142937] font-nunito placeholder-[#124262] text-[#124262]"
                {...register('serviceTypeId')}
            >
                <option>Selecione o tipo de serviço</option>
                <option value={0}>Instalação</option>
                <option value={1}>Manutenção</option>
            </select>
            {errors.serviceTypeId && <p className='text-[#EE3F3E]'>*{errors.serviceTypeId.message}</p>}

            <textarea
                placeholder="Descrição"
                className="w-full h-auto mt-2 p-2 resize-none rounded-lg border border-[#142937] font-nunito placeholder-[#124262] text-[#124262]"
                rows="4"
                {...register('description')}
            />
            {errors.description && <p className='text-[#EE3F3E]'>*{errors.description.message}</p>}

            <div className="flex mt-2 mb-4 items-center space-x-2">
                <input
                    type="checkbox"
                    id="recorrente"
                    className="w-4 h-4"
                    {...register('isRecurringCall')}
                />
                <label htmlFor="recorrente" className="font-nunito">
                    É motivado por problema recorrente?
                </label>
            </div>

            <button
                type="submit"
                className=" flex items-center justify-center gap-1 w-full text-white p-2 rounded-md bg-gradient-to-t from-[#124262] to-[#03558C] hover:from-[#124262] hover:to-[#144b70]
                transition-all scale-100 hover:scale-[1.02]"
            >
                <IoIosSend size={20} />
                Enviar
            </button>
        </Form.Container>
    )
}
