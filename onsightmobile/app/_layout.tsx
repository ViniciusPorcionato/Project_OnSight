import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black_Italic, useFonts } from '@expo-google-fonts/nunito';
import '../global.css';
import { router, Stack, useRouter, } from 'expo-router';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { userDecodeToken } from '~/Service/Auth';
import { ModalProvider } from '~/Service/Context';


// Ocultar Log's
import { LogBox } from 'react-native';

// Ignore log notification by message
LogBox.ignoreLogs(['Warning: ...']);

//Ignore all log notifications
LogBox.ignoreAllLogs();




export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '/login'
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

export default function RootLayout() {
  const [tokenUser, setTokenUser] = useState<tokenProps | undefined>();

  const router = useRouter();

  useEffect(() => {


    async function getUser() {
      const token = await userDecodeToken();

      console.log(token);


      if (token == null) {
        router.navigate('./login')
      }
      if (token != null) {
        setTokenUser(token)
      }
    }
    getUser()



  }, [1000])

  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (

    <ModalProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack >
          <Stack.Screen name={"login"} options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </GestureHandlerRootView>
    </ModalProvider>
  );
}


