import { Image, Text, TouchableOpacity, View } from "react-native"
import { ContainerBox } from "../Container"
import { useEffect, useState } from "react"
import { PicturePerfil } from "../PicturePerfil"
import { NameHeaderTitle } from "../Text";
import { LinearGradient } from "expo-linear-gradient";
import { userDecodeToken } from "~/Service/Auth";
import api from "~/Service/service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

//import fotoPerfil from "../../assets/fotoPerfil.png";


interface User {
    image: string;
    name: string;
    email: string;
    phone: string;
    cpf: string;
    type: string;
    date: string;
    rg: string;
}

const initialUser: User = {
    image: 'https://avatars.githubusercontent.com/u/125310431?v=4',
    name: "Pedro Gabriel Felix da Silva",
    email: "pedrofelix@email.com",
    phone: "(11) 96785-6477",
    cpf: "720.159.670-52",
    type: "Técnico",
    date: "25/02/2004",
    rg: "17.412.278-0"
};

interface tokenProps {
    id: string | undefined;
    individual_person_id: string;
    technicia_id: string;
    name: any;
    role: any;
    image: string;
    token: any;
}


export function Header() {
    const [user, setUser] = useState<tokenProps | undefined>();



    useEffect(() => {
        async function profileLoad() {
            const token = await userDecodeToken();

            if (token) {
                setUser(token)

                // console.log("Log header: " + JSON.stringify(token));
            }
        }

        profileLoad()
    }, [])


    const reduceName = (name: string): string => {
        if (name.length > 20) {
            return `${name.substring(0, 20)}...`;
        }
        return name;
    };




    async function handleLogout() {
        await AsyncStorage.removeItem("token");
        router.replace('/login');
    }



    return (
        <>
            {
                user != null && (
                    <LinearGradient
                        colors={['#03558c', '#124262']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={{
                            width: '100%',
                            height: 120,
                            borderRadius: 12,
                        }}
                    >

                        <View className='pt-[7%] h-[100%] flex-row items-center mb-[-8%] justify-around'>

                            <View className=" flex-row items-center gap-[15px]">

                                <PicturePerfil
                                    imagePerfil={user?.image}
                                    style="w-[62px] h-[62px] rounded-full"
                                />

                                <NameHeaderTitle
                                    name={reduceName(user?.name)}
                                />
                            </View>

                            <TouchableOpacity onPress={handleLogout}>
                                <Image
                                    source={require("../../assets/Icons/icon-logout.png")}
                                    className='w-[24px] h-[24px] m-[3%]'
                                />
                            </TouchableOpacity>
                        </View>

                    </LinearGradient>
                )
            }

        </>
    )
}