import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/pages/Login';
import MenuDrawer from './src/pages/MenuDrawer';
import { StatusBar } from 'react-native';
import CadContas from './src/pages/CadContas';
import { corSecundaria } from './src/styles/Estilos';

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<StatusBar barStyle="light-content" color={corSecundaria} />
			<Stack.Navigator
				screenOptions={{
					headerStyle: {
						backgroundColor: corSecundaria,
						elevation: 0,
					},
					headerTintColor: '#fff',
				}}
			>
				<Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
				<Stack.Screen name="MenuDrawer" component={MenuDrawer} options={{ headerShown: false }} />
				<Stack.Screen name="CadContas" component={CadContas}
					options={{ title: 'Cadastro de Contas' }} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}