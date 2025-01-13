import { router, Stack } from 'expo-router';
import {
  Alert,
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import InputComponent from '~/components/Input';
import { ButtonComponent } from '../components/ButtonComponent';
import { SubtitleText, TextBold, TitleText } from '~/components/Text';
import { useState } from 'react';
import { Logo } from '~/components/Logo';
import { Container, ContainerBox, ContainerText, Content } from '~/components/Container';
import api from '~/Service/service';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useForm, Controller } from 'react-hook-form';
import LottieView from 'lottie-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type LoginInputs = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();
  const [loading, setLoading] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState(false);

  // States da Animação
  const [showErrorAnimation, setShowErrorAnimation] = useState<boolean>(false);

  const handleLogin = async (data: LoginInputs) => {
    try {
      setLoading(true);
      setShowErrorAnimation(false);

      await api
        .post('/user/login', {
          userEmail: data.email.toLowerCase(),
          userPassword: data.password,
        })
        .then(async (response) => {
          interface DecodedToken {
            role: number;
            exp?: number;
            iat?: number;
            [key: string]: any;
          }

          await AsyncStorage.setItem('token', JSON.stringify(response.data.authenticationToken));

          const decodedToken = jwtDecode<DecodedToken>(response.data.authenticationToken);

          //console.log("No log: " + JSON.stringify(decodedToken));

          if (decodedToken.role == 2) {
            if (decodedToken.role == 2) {
              setTimeout;
              router.replace('/');
              setLoading(false);
            }
          }
        })
        .catch(() => {
          // Alert.alert("Erro no login", "Credenciais inválidas. Tente novamente.");

          console.log('Erro ao logar');

          setShowErrorAnimation(true);
          setTimeout(() => setLoading(false), 1500);
        });
    } catch (error) {
      setLoading(false);
      console.error('Erro durante o login:', error);
    }
  };

  // Arrumar o redirecionamento
  const handleRecoverPassword = () => {
    router.navigate('/not-found');
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <Container>
      <Content style="w-[100%] h-[70%] justify-between">
        <Logo />

        <ContainerText style="">
          <TitleText title="Olá, técnico" style="text-start" />

          <SubtitleText text="Acesse sua conta para contar com todas as funcionades do OnSight." />
        </ContainerText>

        <View className="w-[100%] items-center">
          <ContainerBox style={'w-[90%]'}>
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'O email é obrigatório.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Digite um email válido.',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputComponent
                  placeholder="Email"
                  style={'w-[100%] '}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.email && (
              <Text className=" mb-[5%] mt-[-10px] text-red-500">{errors.email.message}</Text>
            )}

            <Controller
              control={control}
              name="password"
              rules={{
                required: 'A senha é obrigatória.',
                minLength: {
                  value: 3,
                  message: 'A senha deve ter pelo menos 3 caracteres.',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <View className={`mb-4 justify-between items-center h-[60px] flex-row rounded-lg border bg-white p-2`}>
                    <TextInput
                      placeholder="Senha"
                      secureTextEntry={showPassword}
                      value={value}
                      className='flex-1'
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                    <MaterialCommunityIcons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={24}
                      className='right-[10%]'
                      color="#aaa"
                      onPress={toggleShowPassword}
                    />
                  </View>
                </>
              )}
            />
            {errors.password && (
              <Text className="mt-[-10px] text-red-500">{errors.password.message}</Text>
            )}
          </ContainerBox>
        </View>

        <ContainerBox style={'items-center gap-[20px] w-[100%]'}>
          <ButtonComponent
            titleButton={loading ? 'Carregando...' : 'Logar'}
            style={'w-[90%]'}
            handlePress={handleSubmit(handleLogin)}
            disabled={loading}
          />

          {/* <View className='flex-row'>
                        <Text className='text-[18px]'>Esqueceu sua senha? </Text>
                        <ButtonLink handlePress={handleRecoverPassword} text='Clique Aqui!' style='text-[18px]' />
                    </View> */}
        </ContainerBox>
      </Content>

      {/* Animação de erro */}
      {showErrorAnimation && (
        <View className="absolute h-[100%] w-[100%] items-center justify-center bg-[rgba(255,255,255,0.7)] blur-3xl">
          <LottieView
            source={require('../assets/animation/Animation - 1733427055564.json')}
            autoPlay
            loop={false}
            style={{ width: 150, height: 150 }}
            onAnimationFinish={() => setShowErrorAnimation(false)}
          />
          <TextBold style="text-[18px] color-red-600">
            Erro no login. Email e/ou Senha inválidos!
          </TextBold>
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 70,
    margin: 40,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    color: '#333',
    paddingVertical: 10,
    paddingRight: 10,
    fontSize: 16,
  },
  icon: {
    marginLeft: 10,
  },
  heading: {
    alignItems: 'center',
    fontSize: 20,
    color: 'green',
    marginBottom: 20,
  },
});
