import { createDrawerNavigator } from '@react-navigation/drawer'
import Principal from './Principal'
import { corSecundaria } from '../styles/Estilos';
import Contas from './Contas';
import Categorias from './Categorias';

const Drawer = createDrawerNavigator();

export default function MenuDrawer() {
    return (
        <Drawer.Navigator
            // Estilizando os barra de navegação do drawer
            screenOptions={{
                headerStyle: {
                    backgroundColor: corSecundaria,
                    elevation: 0,
                },
                headerTintColor: '#fff',
            }}
        >
            <Drawer.Screen name="Principal" component={Principal} />
            <Drawer.Screen name="Contas" component={Contas} />
            <Drawer.Screen name="Categorias" component={Categorias} />
            
        </Drawer.Navigator>
    )
}