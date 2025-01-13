/* eslint-disable prettier/prettier */
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configuração das notificações
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

// Função para solicitar permissão de notificações
export async function requestNotificationsPermission() {
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {''
            alert('Failed to get push token for push notification!');
            return;
        }

        return await Notifications.getExpoPushTokenAsync({
            projectId: '97bbeefb-7d0e-41c9-b41d-c71919fdcacc' // Substitua pelo seu project ID do Expo
        });
    } else {
        alert('Must use physical device for Push Notifications');
    }
}

// Função para enviar notificação interna (no app)
export const sendInAppNotification = (title, body) => {
    Notifications.presentNotificationAsync({
        title,
        body,
        data: {
            priority: 'high',
            timestamp: Date.now()
        }
    });
};

// Função para enviar push notification
export const sendPushNotification = async (expoPushToken, title, body, data = {}) => {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title,
        body,
        data,
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
};

// Configurar listeners de notificação
export const setupNotificationListeners = () => {
    // Listener para quando a notificação é recebida enquanto o app está aberto
    const receiveSubscription = Notifications.addNotificationReceivedListener(notification => {
        console.log('Notification received:', notification);
    });

    // Listener para quando o usuário toca na notificação
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Notification tapped:', response);
        // Aqui você pode adicionar lógica para navegar para uma tela específica
    });

    // Retorne as subscrições para que possam ser removidas quando necessário
    return {
        receiveSubscription,
        responseSubscription
    };
};