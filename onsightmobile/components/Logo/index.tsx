import { Image } from "react-native";

interface LogoProps {
    style?: any;
}

export const Logo: React.FC<LogoProps> = ({
    style
}) => {
    return (
        <Image
            source={require('../../assets/LogoOnSight.png')}
            className={` ${style}`}
        />
    )
}