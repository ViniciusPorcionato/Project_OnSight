import { ButtonAzul, ButtonCancelar } from '@/components/Buttons';
import Form from '@/components/Form';
import { useYupValidationResolver } from '@/components/Form/formValidationConfig'
import { registerIndividualPerson } from '@/service/userManagementService';
import { personSchema } from '@/validations/personSchema';
import React from 'react'
import { useForm } from 'react-hook-form';

export default function IndividualPersonForm({ onCloseModal, userType, profileImage }) {

    const formMethods = useForm({ 
        resolver: useYupValidationResolver(personSchema),
     });

    const {
        formState: { errors }
    } = formMethods;

    async function handleSubmit(data) {
        try {
            const personData = {
              name: data.name,
              rg: data.rg,
              cpf: data.cpf,
              birthDate: data.birthDate.toISOString().slice(0, 10),
              phoneNumber: data.phoneNumber,
              email: data.email,
              password: data.password,
              profileImage,
              userType
            };
    
            console.log(personData);
    
            await registerIndividualPerson(personData);
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
            <Form.Input
                placeholder="Nome"
                type="text"
                name="name"
                containerClassname='w-full'
            />

            <div className="w-full flex flex-col sm:flex-row  gap-x-5 gap-y-2">
                <Form.Input
                    placeholder="RG"
                    type="text"
                    name="rg"
                    mask='00.000.000-0'
                />
                <Form.Input
                    placeholder="CPF"
                    type="text"
                    name="cpf"
                    mask='000.000.000-00'
                />
            </div>

            <div className="w-full flex flex-col sm:flex-row  gap-x-5 gap-y-2">
                <Form.Input
                    placeholder="Data Nascimento"
                    type="date"
                    name="birthDate"
                    containerClassname='w-full sm:w-[40%]'
                />
                <Form.Input
                    placeholder="Cel"
                    type="tel"
                    name="phoneNumber"
                    containerClassname='w-full sm:w-[60%]'
                    mask='(00) 00000-0000'
                />
            </div>

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
