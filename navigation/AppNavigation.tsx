import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import StartScreen from '../components/StartScreen';
import SignIn from '../authority/SignIn';
import SignUp from '../authority/SignUp';
import HomePage from '../components/HomePage';
import Movie from '../components/Movie';
import Ticket from '../components/Ticket';
import Payment from '../screen/Payment';
import PaymentMethod from '../screen/PaymentMethod';
import Profile from '../authority/Profile';
import UserDetail from '../authority/UserDetail';
import ChatBot from '../chatbot/ChatBot'
import FilmDetail from '../screen/FilmDetail';
import Screen from '../screen/Screen'
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StartScreen">
        <Stack.Screen name="StartScreen" component={StartScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
        <Stack.Screen name="Movie" component={Movie} options={{ headerShown: false }} />
        <Stack.Screen name="Ticket" component={Ticket} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} options={{headerShown:false}} />
        <Stack.Screen name="ChatBot" component={ChatBot} options={{headerShown:false}} />
        <Stack.Screen name="Payment" component={Payment} options={{headerShown:false}} />
        <Stack.Screen
          name="PaymentMethod"
          children={(props) => (
            <PaymentMethod {...props} onPaymentComplete={(isSelected) => {
              console.log("Payment selected:", isSelected);
            }} />
          )}
        />
        <Stack.Screen name="UserDetail" component={UserDetail} options={{headerShown:false}} />
        <Stack.Screen name="FilmDetail" component={FilmDetail} options={{ headerShown: false }} />
        <Stack.Screen name="Screen" component={Screen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
