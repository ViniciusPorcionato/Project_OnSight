import { Controller, useFormContext } from 'react-hook-form';
import { IMaskInput } from 'react-imask';

export default function Input({
    name,
    mask,
    className,
    containerClassname,
    icon,
    ...rest
}) {
    const { 
        register, 
        control,
        formState: { errors }
    } = useFormContext();

    const formProps = register(name);
    
    const buildedClassName = `w-full h-auto mt-2 p-2 rounded-lg border border-[#142937] font-nunito placeholder-[#124262] text-[#124262] ${className}`;

    return (
        <div className={containerClassname}>
            {mask ? (
                <Controller
                    name={name}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <IMaskInput
                            mask={mask}
                            value={value}
                            unmask={true}
                            lazy={true}
                            onAccept={(value) => onChange(value)}
                            className={buildedClassName}
                            {...rest}
                        />
                    )}
                />
            ) : (
                <input
                    id={name}
                    className={buildedClassName}
                    {...formProps}
                    {...rest}
                />
            )}
            { errors[name] && <p className='text-[#EE3F3E] mt-1'>*{ errors[name].message }</p> }
        </div>
    );
}