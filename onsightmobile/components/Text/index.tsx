// utils/InputComponent.tsx
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';




interface TextTitleProps {
  title: string;
  style?: any;
}

export const TitleText: React.FC<TextTitleProps> = ({
  title,
  style
}) => {
  return (
    <Text
      className={`color-[#142937] font-extrabold font text-[28px] ${style}`}
      style={{ fontFamily: 'Nunito_800ExtraBold' }}
    >
      {title}
    </Text>
  );
};


interface TextSubtitleProps {
  text: string;
  style?: any;
}

export const SubtitleText: React.FC<TextSubtitleProps> = ({
  text,
  style
}) => {
  return (
    <Text 
    className={`color-[#142937] font-normal font text-[16px] ${style}`}
    style={{ fontFamily: 'Nunito_400Regular' }}

    >
      {text}
      </Text>
  );
};

interface NameHeaderTitleProps {
  name: string;
  style?: any;
}

export const NameHeaderTitle: React.FC<NameHeaderTitleProps> = ({
  name,
  style
}) => {
  return (
    <Text
      className={`color-[#fafafa] text-[16px] ${style}`}
      style={{ fontFamily: 'Nunito_600SemiBold' }}
    >
      {name}
    </Text>
  )
}

interface NameTitleProps {
  name: string;
  style?: any;
}

export const NameTitle: React.FC<NameTitleProps> = ({
  name,
  style
}) => {
  return (
    <Text
      className={`text-[16px]`}
      style={{ fontFamily: 'Nunito_700Bold' }}
    >
      {name}
    </Text>
  )
}

interface TextRegularProps{
  children?: React.ReactNode;
  style?: any;
}

export const TextRegular: React.FC<TextRegularProps> = ({
  children,
  style
}) => {
  return(
    <Text
    className={`text-[14px] ${style}`}
    style={{ fontFamily: 'Nunito_400Regular' }}
    >
      {children}
    </Text>
  )
}

interface TextBoldProps{
  children?: React.ReactNode;
  style?: any;
}

export const TextBold: React.FC<TextBoldProps> = ({
  children,
  style
}) => {
  return(
    <Text
    className={`text-[14px] ${style}`}
    style={{ fontFamily: 'Nunito_700Bold' }}
    >
      {children}
    </Text>
  )
}


interface TextExtraBoldProps{
  children?: React.ReactNode;
  style?: any;
}

export const TextExtraBold: React.FC<TextExtraBoldProps> = ({
  children,
  style
}) => {
  return(
    <Text
    className={`text-[14px] ${style}`}
    style={{ fontFamily: 'Nunito_800ExtraBold' }}
    >
      {children}
    </Text>
  )
}