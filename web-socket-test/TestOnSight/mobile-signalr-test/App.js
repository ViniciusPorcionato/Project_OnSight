import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { AppState, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as signalR from '@microsoft/signalr'

export default function App() {
  const [connection, setConnection] = useState();

  function useSignalRConnection(connection) {
    useEffect(() => {
      const handleAppStateChange = (nextAppState) => {
        console.log('App State:', nextAppState); // Log para verificar os estados

        if (nextAppState === 'background') {
          try {
            if (connection && connection.state === signalR.HubConnectionState.Connected) {
              connection.stop()
                .then(() => console.log('Expo: SignalR connection stopped'))
                .catch(err => console.error('Expo: Error stopping SignalR connection', err));
            }
          } catch (error) {
            console.error('Expo: Error handling app state change', error);
          }
        } else if (nextAppState === 'active') {
          try {
            if (connection && connection.state === signalR.HubConnectionState.Disconnected) {
              connection.start()
                .then(() => console.log('Expo: SignalR connection restarted'))
                .catch(err => console.error('Expo: Error restarting SignalR connection', err));
            }
          } catch (error) {
            console.error('Expo: Error restarting connection', error);
          }
        }
      };

      const subscription = AppState.addEventListener('change', handleAppStateChange);

      return () => {
        subscription.remove();

        if (connection) {
          connection.stop()
            .catch(err => console.error('Expo: Error stopping connection on cleanup', err));
        }
      };
    }, [connection]);
  }

  const startConnection = useCallback(async () => {
    try {
      // Instancia e configura o objeto HubConnection
      const connectionBuilder = new signalR.HubConnectionBuilder()
        .configureLogging(signalR.LogLevel.Debug)  // add this for diagnostic clues
        .withUrl(`http://172.16.39.117:5288/communicationHub`, {
          accessTokenFactory: () => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1Yjk3NjgxOC05MjFjLTRhNzktYWJjOC0xZDE3NWU0ZDc1ZGMiLCJ1bmlxdWVfbmFtZSI6IlZpbmljaXVzIFBvcmNpb25hdG8iLCJwcm9maWxlX2ltYWdlX3VybCI6Imh0dHBzOi8vb25zaWdodGJsb2JzdG9yYWdlLmJsb2IuY29yZS53aW5kb3dzLm5ldC9vbnNpZ2h0Y29udGFpbmVyLzQ1MmU2NzE5OTMyMzQwYjNiZTUwYzlhODNkNTY4ZDlmLmpwZyIsInJvbGUiOiIyIiwiaW5kaXZpZHVhbF9wZXJzb25faWQiOiI4M2RmZDNiOC04MjNkLTQ3ZWYtODIyMy00Yjc5NWMxYWE4OGMiLCJ0ZWNobmljaWFfaWQiOiJlYWIwOTk4MS0wNzBhLTRiZjYtOTIzMC03ODczMGU1MmJiNWYiLCJuYmYiOjE3MzM0MjEwMjEsImV4cCI6MTczMzQyODIyMSwiaWF0IjoxNzMzNDIxMDIxfQ.y_kZPTIp_jSO1GpMA9fPQ4-zBCmYjXL1MPygsDxBpro',
          transport: signalR.HttpTransportType.WebSockets
        }) // URL da API
        .build();

      // Inicia a conexão
      await connectionBuilder.start()
        .catch((error) => {
          return console.error(error.toString());
        });

      // Guarda a conexão no state
      setConnection(connectionBuilder);
    } catch (error) {
      console.log(error);
    }
  })

  useSignalRConnection(connection)

  useEffect(() => {
    startConnection();
    return () => {
      if (connection) {
        console.log('Cleaning up connection...');
        connection.stop();
      }
    };

  }, [])

  useEffect(() => {
    if (connection) {
      connection.on('ReceiveFeedback', data => {
        console.log(data);
      });
    }
  }, [connection])

  // const [latitude, setLatitude] = useState(0);
  // const [longitude, setLongitude] = useState(0);
  const sendMyLocationToSystem = (lat, long) => {
    if (connection) {
      try {
        // console.log(`Envia a loc ${Number(latitude)}, ${Number(longitude)}`);

        connection.invoke('SendMyLocationToSystem', {
          idTechnician: 'eab09981-070a-4bf6-9230-78730e52bb5f',
          latitude: lat,
          longitude: long
        });
      } catch (error) {
        console.error('Erro ao enviar localização:', error);
      }
    }
  }


  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>Open up App.js to start working on your app!</Text>

      <Button onPress={() => sendMyLocationToSystem(-23.66607628491495, -46.568542817776674)} title='Ir para ponto A'></Button>
      <Button onPress={() => sendMyLocationToSystem(-23.685585777812864, -46.57429754039646)} title='Ir para ponto B'></Button>
      <Button onPress={() => sendMyLocationToSystem(-23.645448172870353, -46.573548350274265)} title='Ir para ponto C'></Button>
      <TextInput placeholder='Latitude' keyboardType='numeric' onChange={txt => setLatitude(parseFloat(txt.target.value))} />
      <TextInput placeholder='Longitude' keyboardType='numeric' onChange={txt => setLongitude(parseFloat(txt.target.value))} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
