import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { encode, decode } from "base-64";
import { useEffect, useState } from "react";
import api from "./service";

if (!global.atob) {
    global.atob = decode
}

if (!global.btoa) {
    global.btoa = encode
}



export const userDecodeToken = async () => {
    const token = await AsyncStorage.getItem("token");



    // Verificar se o token tem algo
    if (token === null) {
        return null;
    }


    // Decodifica o token recebido
    const decoded = jwtDecode(token)

    // console.log('Auth : ' + JSON.stringify(decoded));

    // // buscar usuário

    let imagePerfil = "https://blobvitalhubg15.blob.core.windows.net/containervitalhubpedro/imagemPadrao.jpg"
    if (decoded != null) {

        // Arrumar essa rotaaaaa
        await api.get(`/user/get-user-by-id?individualPersonId=${decoded.individual_person_id}`)
            .then(response => {
                // console.log(response.data)

                if (response.data.profileImageUrl != null && response.data.profileImageUrl.length > 0 ) {
                    imagePerfil = response.data.profileImageUrl
                }

                // console.log(response.data.foto);
            }).catch(error => {
                console.log(error);
            })
    }

    return {
        id: decoded.jti,
        individual_person_id: decoded.individual_person_id,
        technicia_id: decoded.technicia_id,
        name: decoded.unique_name,
        role: decoded.role,
        image: imagePerfil,
        token: token
    }
}