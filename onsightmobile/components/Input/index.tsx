// utils/InputComponent.tsx
import React from 'react';
import { TextInput } from 'react-native';

interface InputProps {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: any; // Ou defina um tipo específico para seu estilo
  onBlur?: any;
  secureText?: boolean;
}

const InputComponent: React.FC<InputProps> = ({
  placeholder,
  secureText,
  value,
  onChangeText,
  style,
  onBlur
}) => {
  return (
    <TextInput
      placeholder={placeholder}
      secureTextEntry={secureText}
      value={value}
      onChangeText={onChangeText}
      className={`border bg-white rounded-lg p-2  h-[60px] mb-4 ${style}`}
      onBlur={onBlur}
    />
  );
};

export default InputComponent;
