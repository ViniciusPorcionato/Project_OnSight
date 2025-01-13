import { ButtonAzul, ButtonCancelar } from '@/components/Buttons';
import Form from '@/components/Form';
import { useYupValidationResolver } from '@/components/Form/formValidationConfig'
import { registerClient } from '@/service/userManagementService';
import { clientSchema } from '@/validations/clientSchema';
import React from 'react'
import { useForm } from 'react-hook-form';

export default function ClientForm({ onCloseModal, profileImage, userType }) {

    const formMethods = useForm({
        resolver: useYupValidationResolver(clientSchema),
    });

    const {
        formState: { errors }
    } = formMethods;

    async function handleSubmit(data) {
        try {
            const clientData = {
                tradeName: data.tradeName,
                companyName: data.companyName,
                cnpj: data.cnpj,
                phoneNumber: data.phoneNumber,
                email: data.email,
                password: data.password,
                profileImage,
                userType
            };

            console.log(data);

            await registerClient(clientData);

            onCloseModal();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Form.Container
            formMethods={formMethods}
            onSubmit={handleSubmit}
            className='flex flex-col gap-2 w-[80%]'
        >
            <div className="w-full flex flex-col sm:flex-row  gap-x-5 gap-y-2">
                <Form.Input
                    placeholder="Nome Fantasia"
                    type="text"
                    name="tradeName"
                    containerClassname='w-full sm:w-[40%]'
                />
                <Form.Input
                    placeholder="Razão Social"
                    type="text"
                    name="companyName"
                    containerClassname='w-full sm:w-[60%]'
                />
            </div>

            <Form.Input
                placeholder="CNPJ"
                type="text"
                name="cnpj"
                mask='00.000.000/0000-00'
            />

            <Form.Input
                placeholder="Cel"
                type="tel"
                name="phoneNumber"
                containerClassname='w-full'
                mask='(00) 00000-0000'
            />

            <Form.Input
                placeholder="Email"
                type="email"
                name="email"
                containerClassname='w-full'
            />

            <div className="w-full flex flex-col sm:flex-row  gap-x-5 gap-y-2">
                <Form.Input
                    placeholder="Senha"
                    type='password'
                    name="password"
                />
                <Form.Input
                    placeholder="Confirmar senha"
                    type='password'
                    name="confirmPassword"
                />
            </div>

            <div className="flex flex-col items-center h-[100%] gap-2 mt-[12%]">
                <ButtonAzul type="submit" text="Confirmar" />
                <ButtonCancelar onClick={onCloseModal} />
            </div>
        </Form.Container>
    )
}
