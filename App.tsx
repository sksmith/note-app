import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GlobalStateProvider } from "./store/Store";

import Login from './screens/Login'
import List from './screens/List'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GlobalStateProvider>
      <NavigationContainer>
        <Stack.Navigator>

          <Stack.Screen
            name='Login'
            component={Login}
            options={{}} />

          <Stack.Screen
            name='List'
            component={List}
            options={{}} />
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalStateProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
