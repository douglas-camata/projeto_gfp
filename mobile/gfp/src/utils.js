import AsyncStorage from '@react-native-async-storage/async-storage';

// export const enderecoServidor = 'http://192.168.0.237:3000';
export const enderecoServidor = 'http://192.168.0.114:3000';

export const buscarUsuarioLogado = async  () => {
    const usuarioLogado = await AsyncStorage.getItem('UsuarioLogado');
    console.log('Usuario Logado:', usuarioLogado);
    
    if (usuarioLogado) {
        return JSON.parse(usuarioLogado);
    } else {
        return null;
    }
}