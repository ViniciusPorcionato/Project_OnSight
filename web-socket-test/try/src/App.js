import * as signalR from '@microsoft/signalr';
import { useState, useEffect } from 'react';

function App() {
  const [connection, setConnection] = useState();

  useEffect(() => {
    const startConnection = async () => {
      try {
        // Instancia e configura o objeto HubConnection
        const connectionBuilder = new signalR.HubConnectionBuilder()
          .withUrl("http://localhost:5288/communicationHub", {
            transport: signalR.HttpTransportType.WebSockets,
            accessTokenFactory: () => "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMTA1MWIyYy1lODgzLTRhYzYtYTYwMy0zODlmMmQxM2NhOGIiLCJ1bmlxdWVfbmFtZSI6IlZpbmljaXVzIFBvcmNpb25hdG8iLCJwcm9maWxlX2ltYWdlX3VybCI6Imh0dHBzOi8vYmxvYnZpdGFsaHViZzE1LmJsb2IuY29yZS53aW5kb3dzLm5ldC9jb250YWluZXJ2aXRhbGh1YnBlZHJvL2ltYWdlbVBhZHJhby5qcGciLCJyb2xlIjoiMiIsImluZGl2aWR1YWxfcGVyc29uX2lkIjoiYWZjNDdhZDktYjNhMC00NmJlLWFkM2ItMTczYmRhZTI0ZDZmIiwidGVjaG5pY2lhX2lkIjoiZGY5NTRhODYtMjBlMy00ODA5LTlhMDYtMWZlNTViZjE3NTU3IiwibmJmIjoxNzMzNDU3MzgyLCJleHAiOjE3MzM0NjQ1ODIsImlhdCI6MTczMzQ1NzM4Mn0.czDU4wwv2KoHwBf1KrwGkULPsaFwiqIl_UB7h-3VGxU"
          }) // URL da API
          .withAutomaticReconnect()
          .configureLogging(signalR.LogLevel.Information)
          .build();

        // Inicia a conexão
        await connectionBuilder.start();

        // Guarda a conexão no state
        await setConnection(connectionBuilder);

        // Caso necessário a execução de um método ao iniciar a conexão, poderá inserir aqui
        // await connectionBuilder.invoke('ConnectToGroup', user.idConversation);

      } catch (error) {
        console.log(error);
      }
    }

    startConnection();
  }, [])

  useEffect(() => {
    if (connection) {
      connection.on('ReceiveFeedback', data => {
        console.log(data);
      });
        
        connection.on('SendSpecificTechnician', data => {
            // console.log(data);
        });

        connection.on('SendAllTechnicians', data => {
            // console.log(data);
        });

        connection.on('SendAllServiceCalls', data => {
            // console.log(data);
        });

        connection.on('SendSpecificServiceCall', data => {
            // console.log(data);
        });
    }
  }, [connection])

    function Get() {
        try {
            // connection.invoke('GetSpecificTechnician', "df954a86-20e3-4809-9a06-1fe55bf17557")
            //     .then(() => {
            //         console.log("Message sent successfully");
            //     })
            //     .catch(err => {
            //         console.error("Failed to send message:", err);
            //     });

            // connection.invoke('GetAllTechnicians')
            //     .then(() => {
            //         console.log("Message sent successfully");
            //     })
            //     .catch(err => {
            //         console.error("Failed to send message:", err);
            //     });

            // connection.invoke('GetAllServiceCalls')
            //     .then(() => {
            //         console.log("Message sent successfully");
            //     })
            //     .catch(err => {
            //         console.error("Failed to send message:", err);
            //     });
            //
            // connection.invoke('GetSpecificServiceCall', 'a69ced95-524f-49c3-9452-5359ffcbbaad')
            //     .then(() => {
            //         console.log("Message sent successfully");
            //     })
            //     .catch(err => {
            //         console.error("Failed to send message:", err);
            //     });

            connection.invoke('SendMyLocationToSystem', { idTechnician: "5c75b381-747b-4773-a60b-c41b50b3aa0d", latitude: -23.6560, longitude: -46.4388})
                .then(() => {
                    console.log("Message sent successfully");
                })
                .catch(err => {
                    console.error("Failed to send message:", err);
                });
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => Get()}>Get</button>
      </header>
    </div>
  );
}

export default App;
