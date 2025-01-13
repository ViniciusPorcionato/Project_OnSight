import { useCallback, useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

export default function App() {
  const [connection, setConnection] = useState();
  const [technicianToken, setTechnicianToken] = useState("");
  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxODczMWE0MC0yMzMxLTQ1ZDEtODhiOC05ZGJlYWViM2M0ZDkiLCJ1bmlxdWVfbmFtZSI6Ikx1Y2FzIE9saXZlaXJhIiwicHJvZmlsZV9pbWFnZV91cmwiOiJodHRwczovL29uc2lnaHRibG9ic3RvcmFnZS5ibG9iLmNvcmUud2luZG93cy5uZXQvb25zaWdodGNvbnRhaW5lci8yZjFiMDI4MzIwNWI0M2Y0OTY3MDI5Y2Q3YmRiZTM2ZS5wbmciLCJyb2xlIjoiMiIsImluZGl2aWR1YWxfcGVyc29uX2lkIjoiNjcwMTg4ODktNzYxOC00ODA2LWI2MmMtZTUyNGViYjI2NTU3IiwidGVjaG5pY2lhX2lkIjoiYzU0YjUzODUtMjNhYy00YTBhLWJjYjAtNzYxOGY2MjRmN2M3IiwibmJmIjoxNzM0NDA3NzQ4LCJleHAiOjE3MzQ0MTQ5NDgsImlhdCI6MTczNDQwNzc0OH0.h6U4J_OjO_BJE22jVVxkd6pRoUoy1CDUpX-HNpthGtk

  const startConnection = useCallback(async () => {
    try {
      // Instancia e configura o objeto HubConnection
      const connectionBuilder = new signalR.HubConnectionBuilder()
        .configureLogging(signalR.LogLevel.Debug)  // add this for diagnostic clues
        .withUrl(`http://localhost:5288/communicationHub`, {
          accessTokenFactory: () => technicianToken,
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

  useEffect(() => {
    // startConnection();
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

  const [technicianId, setTechnicianId] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [location, setLocation] = useState(0);
  const sendMyLocationToSystem = (lat, long) => {
    if (connection) {
      try {
        // console.log(`Envia a loc ${Number(latitude)}, ${Number(longitude)}`);

        setLatitude(lat);
        setLongitude(long);

        connection.invoke('SendMyLocationToSystem', {
          idTechnician: technicianId,
          latitude: lat,
          longitude: long
        });
      } catch (error) {
        console.error('Erro ao enviar localização:', error);
      }
    }
  }

  const connectWithServer = async () => {
    await startConnection();
    return () => {
      if (connection) {
        console.log('Cleaning up connection...');
        connection.stop();
      }
    };
  }

  // Atualiza a localização com base na direção
  // : "up" | "down" | "left" | "right"
  const updateLocation = (direction) => {
    // if (location) {
    const movementDelta = 0.001; // Define a distância de movimento

    let newLatitude = latitude;
    let newLongitude = longitude;

    switch (direction) {
      case "up":
        newLatitude += movementDelta; // Movimento para o norte
        break;
      case "down":
        newLatitude -= movementDelta; // Movimento para o sul
        break;
      case "left":
        newLongitude -= movementDelta; // Movimento para o oeste
        break;
      case "right":
        newLongitude += movementDelta; // Movimento para o leste
        break;
    }

    setLocation({ latitude: newLatitude, longitude: newLongitude });
    // }
  };

  useEffect(() => {
    sendMyLocationToSystem(location.latitude, location.longitude);
  }, [location])



  return (
    <div>
      <h1>Technician APP</h1>

      <button onClick={() => connectWithServer()}>Conectar</button>

      <label htmlFor="">Token do técnico</label>
      <input type="text" value={technicianToken} onChange={txt => setTechnicianToken(txt.target.value)} />


      <label htmlFor="technicianId">ID do Técnico</label>
      <input
        type="text"
        value={technicianId}
        onChange={e => setTechnicianId(e.target.value)}
        placeholder="Digite o ID do técnico"
      />


      <button onClick={() => sendMyLocationToSystem(-23.66607628491495, -46.568542817776674)}>Ir para o ponto A</button>

      <div>
        <button onClick={() => updateLocation("up")}>Subir (Norte)</button>
        <button onClick={() => updateLocation("down")}>Descer (Sul)</button>
        <button onClick={() => updateLocation("left")}>
          Esquerda (Oeste)
        </button>
        <button onClick={() => updateLocation("right")}>
          Direita (Leste)
        </button>
      </div>

    </div>
  );
}