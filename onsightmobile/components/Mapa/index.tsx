import { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"

// Import do maps
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"

import MapViewDirections from "react-native-maps-directions"

// Import do style
//import { BoxMaps } from "./style"

// Import da key
import { mapskey } from "../../Utils/mapsKey"

import {
    getCurrentPositionAsync,
    LocationAccuracy,
    LocationObject,
    requestForegroundPermissionsAsync,
    watchPositionAsync
}
    from "expo-location"

interface mapsProps {
    latitude?: number;
    longitude?: number;
}

export const MapsComponente: React.FC<mapsProps> = ({ latitude, longitude }) => {

    // Posição inicial
    const [initialPosition, setInitialPosition] = useState<LocationObject | null>(null);


    async function CapturarLocalizacao() {
        const { granted } = await requestForegroundPermissionsAsync();

        if (granted) {
            const currentPosition = await getCurrentPositionAsync()

            setInitialPosition(currentPosition)

            // console.log("log e pa: ",initialPosition?.coords)

            // console.log("aquele log lá: ", latitude, longitude);

        }
    }

    useEffect(() => {
        CapturarLocalizacao()

        watchPositionAsync({
            accuracy: LocationAccuracy.High,
            timeInterval: 1000,
            distanceInterval: 1
        }, async (response) => {

            // setInitialPosition(response)

            // setInitialLatitude(response.coords.latitude);
            // setinitialLongitude(response.coords.latitude);


            // mapRefence.current?.animateCamera({
            //     pitch: 60,
            //     center: response.coords
            // })


            // console.log("Resposta do mapa: ", response);

        }

        )
    }, [])



    return (
        <>
            {
                initialPosition != null && (
                    <View className="flex-1 w-[100%] mt-[-30px]">
                        <MapView
                            // latitude={latitude}
                            // longitude={longitude}
                            initialRegion={{
                                latitude: initialPosition.coords.latitude,
                                longitude: initialPosition.coords.longitude,
                                latitudeDelta: 0.005,
                                longitudeDelta: 0.005
                            }}
                            provider={PROVIDER_GOOGLE}
                            style={styles.map}
                        >

                            {/* Criando um marcador no mapa  */}
                            <Marker
                                coordinate={{
                                    latitude: initialPosition.coords.latitude,
                                    longitude: initialPosition.coords.longitude,
                                }}
                                title='Localização atual'
                                description='Qualquer lugar do map'
                                pinColor='red'
                            />

                            {
                                latitude && longitude ? (
                                    <>
                                        {/* Criando um marcador no mapa  */}
                                        <Marker
                                            coordinate={{
                                                latitude: latitude,
                                                longitude: longitude,
                                            }}
                                            title='Localização Destino'
                                            description='Qualquer lugar do map'
                                            pinColor='blue'
                                        />



                                        {/* Marcar um destino mapa */}
                                        <MapViewDirections
                                            origin={{
                                                latitude: initialPosition.coords.latitude,
                                                longitude: initialPosition.coords.longitude,
                                            }}
                                            // O Destino está mocado
                                            destination={{
                                                latitude: latitude,
                                                longitude: longitude,
                                            }}
                                            apikey={mapskey}
                                            strokeWidth={5}
                                            strokeColor="#00456D"
                                        />
                                    </>
                                ) : (
                                    null
                                )
                            }
                        </MapView >

                    </View >
                )
            }
        </>



    )
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
        width: '100%'
    }
});