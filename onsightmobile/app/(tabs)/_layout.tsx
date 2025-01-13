import { Tabs } from 'expo-router';
import { TabBarIcon } from '../../components/TabBarIcon';
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useModal } from '~/Service/Context';

export default function TabLayout() {

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const { isModalVisible } = useModal();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >

      <Tabs
        screenOptions={{
          tabBarStyle: [{
            backgroundColor: '#03558C',
            borderTopWidth: 1,
            borderTopColor: '#ccc',
            width: '48%',
            // width: 174,
            left: '26%', 
            height: 80,
            alignSelf: 'center',
            borderRadius: 100,
            position: 'absolute', 
            bottom: isKeyboardVisible || isModalVisible ? -100 : 10, 
          },],
          //tabBarBackground: () => (<View style={{ flex: 1, backgroundColor: 'pink' }} />),
          tabBarActiveTintColor: '#03558C',
          tabBarLabelStyle: { display: 'none' },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused }) =>
              <View className={`w-[100%] rounded-full h-[100%] justify-center items-center ${focused ? "bg-[#F0F0F0]" : ""}`}>
                <TabBarIcon name={'home'} color={focused ? "#03558C" : "#F0F0F0"} />
              </View>
            ,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            tabBarIcon: ({ focused }) =>
              <View className={`w-[100%] rounded-full h-[100%] justify-center items-center ${focused ? "bg-[#F0F0F0]" : ""}`}>
                <TabBarIcon name={'user'} color={focused ? "#03558C" : "#F0F0F0"} />
              </View>,
            headerShown: false,
          }}
        />
      </Tabs>
    </KeyboardAvoidingView>
  );
}
