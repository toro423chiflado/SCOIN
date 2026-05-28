import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen   from '../screens/SplashScreen';
import WelcomeScreen  from '../screens/WelcomeScreen';
import HomeScreen     from '../screens/HomeScreen';
import ScannerScreen  from '../screens/ScannerScreen';
import ResultScreen   from '../screens/ResultScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="Splash"   component={SplashScreen} />
        <Stack.Screen name="Welcome"  component={WelcomeScreen} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ animation: 'fade', gestureEnabled: false }}
        />
        <Stack.Screen
          name="Scanner"
          component={ScannerScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}