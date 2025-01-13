// utils/InputComponent.tsx
import { LinearGradient } from 'expo-linear-gradient';
import React, { Children } from 'react';
import { GestureResponderEvent, Image, ImageSourcePropType, Pressable, Text, TextInput, TouchableOpacity } from 'react-native';

interface ButtonProps {
  titleButton?: string;
  children?: React.ReactNode;
  iconButton?: string | undefined;
  value?: string;
  handlePress?: (event: GestureResponderEvent) => void;
  style?: any; // Ou defina um tipo específico para seu estilo
  disabled?: boolean;
}

export const ButtonComponent: React.FC<ButtonProps> = ({
  titleButton,
  children,
  iconButton,
  handlePress,
  value,
  style,
  disabled
}) => {


  return (
    <TouchableOpacity
      className={`${disabled ? "bg-[#F1F1F1]" : "bg-[#124262]"} rounded-[12px] h-[60px] flex-row justify-center items-center ${style}`}
      onPress={handlePress}
      disabled={disabled}
    >
      {/* <LinearGradient
        colors={['#F1F1F1', '#FAFAFA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          padding: 20,
        }}
      > */}

        {children}
        
        <Text className={`${disabled ? "color-[#BFBFBF]" : "color-white"}  font-black `}> {titleButton}</Text>
      {/* </LinearGradient> */}


    </TouchableOpacity>
  );
};

interface ButtonLinkProps {
  text: string;
  style?: any; // Ou defina um tipo específico para seu estilo
  handlePress?: (event: GestureResponderEvent) => void;
}

export const ButtonLink: React.FC<ButtonLinkProps> = ({
  text,
  style,
  handlePress,
}) => {
  return (
    <TouchableOpacity onPress={handlePress}>
      <Text className={`color-[#124262] text-center font-bold ${style}`}> {text}</Text>
    </TouchableOpacity>
  );
};
