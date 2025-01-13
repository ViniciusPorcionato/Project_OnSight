import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { useState } from "react";
import * as signalR from '@microsoft/signalr';



const LOCATION_TASK_NAME = "background-location-task";

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }: TaskManager.TaskManagerTaskBody<{ locations: Location.LocationObject[] } | undefined>) => {
    if (error) {
        console.error("Erro na tarefa de localização:", error);
        return;
    }

    if (data && data.locations) {
        const [location] = data.locations;

        if (location) {
            console.log("Localização em segundo plano:", location.coords);

            // await signalRConnection.send("EnviarLocalizacao", location.coords);
        }
    }
});


export const startBackgroundLocation = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();

    if (!granted) {
        console.log("Permissões de localização não concedidas");
        return;
    }

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
    });

    console.log("Monitoramento de localização em segundo plano iniciado");
};
