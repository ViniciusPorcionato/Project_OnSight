import {  View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


interface ContainerProps {
    children?: React.ReactNode;
    style?: any;
}

export const Container: React.FC<ContainerProps> = ({
    children,
    style
}) => {
    return(
        <SafeAreaView className={`flex-1 justify-center items-center ${style}`}>
            {children}
        </SafeAreaView>
    )
}

interface ContentProps {
    children?: React.ReactNode;
    style?: any;
}

export const Content: React.FC<ContentProps> = ({
    children,
    style
}) => {
    return(
        <View className={`justify-center items-center ${style}`}>
            {children}
        </View>
    )
}

interface ContainerBoxProps {
    children?: React.ReactNode;
    style?: any;
}

export const ContainerBox : React.FC<ContainerBoxProps> = ({
    children,
    style
}) => {
    return(
        <View className={`${style} `}>
            {children}
        </View>
    )
}


interface ContainerTextProps {
    children?: React.ReactNode;
    style?: any;
}

export const ContainerText : React.FC<ContainerTextProps> = ({
    children,
    style
}) => {
    return(
        <View className={`justify-center items-start ${style}`}>
            {children}
        </View>
    )
}

interface ContainerFieldValueProps {
    children?: React.ReactNode;
    style?: any;
}

export const ContainerFieldValue : React.FC<ContainerFieldValueProps> = ({
    children,
    style
}) => {
    return(
        <View className={`flex-row gap-[5px] ${style}`}>
            {children}
        </View>
    )
}
