import { Image, Platform } from "react-native";

interface PictureProps {
    imagePerfil: string | undefined;
    style?: any;
}

export const PicturePerfil: React.FC<PictureProps> = ({
    imagePerfil,
    style
}) => {    
    return (
        <Image
            source={{uri: imagePerfil}}
            className={`w-[120px] h-[120px] rounded-full ${style}`}
        />
    )
}