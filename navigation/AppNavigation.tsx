// navigation/AppNavigation.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import StartScreen from '../components/StartScreen'; // Đổi tên phần mở rộng thành '.tsx' nếu cần
import SignIn from '../authority/SignIn'; // Đổi tên phần mở rộng thành '.tsx' nếu cần
import SignUp from '../authority/SignUp'; // Đổi tên phần mở rộng thành '.tsx' nếu cần

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StartScreen">
        <Stack.Screen name="StartScreen" component={StartScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }}/>
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
