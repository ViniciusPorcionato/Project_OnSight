import { useCallback, useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

export default function App() {
  const [connection, setConnection] = useState();

  // function useSignalRConnection(connection) {
  //   useEffect(() => {
  //     const handleAppStateChange = (nextAppState) => {
  //       console.log('App State:', nextAppState); // Log para verificar os estados

  //       if (nextAppState === 'background') {
  //         try {
  //           if (connection && connection.state === signalR.HubConnectionState.Connected) {
  //             connection.stop()
  //               .then(() => console.log('Expo: SignalR connection stopped'))
  //               .catch(err => console.error('Expo: Error stopping SignalR connection', err));
  //           }
  //         } catch (error) {
  //           console.error('Expo: Error handling app state change', error);
  //         }
  //       } else if (nextAppState === 'active') {
  //         try {
  //           if (connection && connection.state === signalR.HubConnectionState.Disconnected) {
  //             connection.start()
  //               .then(() => console.log('Expo: SignalR connection restarted'))
  //               .catch(err => console.error('Expo: Error restarting SignalR connection', err));
  //           }
  //         } catch (error) {
  //           console.error('Expo: Error restarting connection', error);
  //         }
  //       }
  //     };

  //     const subscription = AppState.addEventListener('change', handleAppStateChange);

  //     return () => {
  //       subscription.remove();

  //       if (connection) {
  //         connection.stop()
  //           .catch(err => console.error('Expo: Error stopping connection on cleanup', err));
  //       }
  //     };
  //   }, [connection]);
  // }

  const startConnection = useCallback(async () => {
    try {
      // Instancia e configura o objeto HubConnection
      const connectionBuilder = new signalR.HubConnectionBuilder()
        .configureLogging(signalR.LogLevel.Debug)  // add this for diagnostic clues
        .withUrl(`http://192.168.15.144:5288/communicationHub`, {
          accessTokenFactory: () => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjMDk4YjgxYy1lMTBkLTRmYjUtOTY3ZC00ZjRkOWMzNjg0ZGUiLCJ1bmlxdWVfbmFtZSI6InRvbWFzIiwicHJvZmlsZV9pbWFnZV91cmwiOiJodHRwczovL29uc2lnaHRibG9ic3RvcmFnZS5ibG9iLmNvcmUud2luZG93cy5uZXQvb25zaWdodGNvbnRhaW5lci9lMzE2ZDFlY2FjNGM0NWE2ODFlZjc0YTg3MjMxYzg4YS5wbmciLCJyb2xlIjoiMiIsImluZGl2aWR1YWxfcGVyc29uX2lkIjoiMGIzMGU0MTQtZjI5My00Yjk0LTlkYTctZTdhNjU5NzkwOWRkIiwidGVjaG5pY2lhX2lkIjoiNjFlMzVkYzItMDFkOS00NzllLTlkMWEtN2Y5MmM3Yzk3OTNhIiwibmJmIjoxNzMzNDQ2MTc4LCJleHAiOjE3MzM0NTMzNzgsImlhdCI6MTczMzQ0NjE3OH0.IulCk7LNh1grfTs_-DWDXagW66uqXFMgtyhZGMKyqOo',
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

  // useSignalRConnection(connection)

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
    <div>
      <h1>Technician APP</h1>

      <button onClick={() => sendMyLocationToSystem(-23.66607628491495, -46.568542817776674)}>Ir para o ponto A</button>
      <button onClick={() => sendMyLocationToSystem(-23.685585777812864, -46.57429754039646)}>Ir para o ponto B</button>
      <button onClick={() => sendMyLocationToSystem(-23.645448172870353, -46.573548350274265)}>Ir para o ponto C</button>
    </div>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });