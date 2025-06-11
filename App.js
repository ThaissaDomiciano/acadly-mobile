import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts, Rajdhani_400Regular, Rajdhani_700Bold } from '@expo-google-fonts/rajdhani';

import Login from './screens/Login';
import DashboardAluno from './screens/DashboardAluno';
import NotificacoesAluno from './screens/NotificacoesAluno'; 

const Stack = createStackNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({
  Rajdhani_400Regular,
  Rajdhani_700Bold,
});
if (!fontsLoaded) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
        <Stack.Screen name="DashboardAluno" component={DashboardAluno} options={{ headerShown: false }}/>
        <Stack.Screen
          name="NotificacoesAluno"
          component={NotificacoesAluno}
           options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
