import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthWebView from './src/AuthWebView';
import PairTester from './src/PairTester';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="AuthWebView" component={AuthWebView} options={{ title: 'Login to SavelyCLOUD' }} />
        <Stack.Screen name="PairTester" component={PairTester} options={{ title: 'Pairing tester' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
