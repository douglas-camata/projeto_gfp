import AsyncStorage from '@react-native-async-storage/async-storage';

export const enderecoServidor = 'http://localhost:3000';
// export const enderecoServidor = 'http://10.130.42.19:3000';
// export const enderecoServidor = 'http://192.168.0.114:3000';

export const listaCores = ['#FF5733', '#FFC300', '#DAF7A6', '#33FF57', '#33A1FF', '#8D33FF', '#FF33EC', '#FF33A1', '#33FFF6', '#FF7F50'];
export const listaIcones = ['restaurant', 'directions-car', 'school', 'home', 'sports-soccer', 'shopping-cart', 'pets', 'favorite',
    'fitness-center', 'wallet', '4k'];







export const buscarUsuarioLogado = async  () => {
    const usuarioLogado = await AsyncStorage.getItem('UsuarioLogado');
    // console.log('Usuario Logado:', usuarioLogado);
    
    if (usuarioLogado) {
        return JSON.parse(usuarioLogado);
    } else {
        return null;
    }
}