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

export const calcularDatasPeriodo = (periodo) => {
    const hoje = new Date(); //Obtendo a data de hoje
    let dataInicio = new Date();
    let dataFim = new Date();

    switch (periodo) {
        case 'esteMes':
            dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            dataFim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
            break;
        case 'mesPassado':
            dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
            dataFim = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
            break;
        case 'ultimos7':
            dataInicio.setDate(hoje.getDate() - 6);
            dataFim = hoje;
            break;
        case 'ultimos30':
            dataInicio.setDate(hoje.getDate() - 29);
            dataFim = hoje;
            break;
        case 'Todos':
            dataInicio = new Date(2000, 1, 1);
            dataFim = new Date(2100, 12, 31);
            break;
    }

    dataInicio = dataInicio.toISOString().split('T')[0];
    dataFim = dataFim.toISOString().split('T')[0];

    return { dataInicio, dataFim }
}

export const formatarDinheiro = (valor) => {
    valor = Number(valor);
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export const formatarData = (data) => {
        const dataFormatada = new Date(data);
        return dataFormatada.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }