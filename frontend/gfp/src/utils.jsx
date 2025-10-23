import { Md4K, MdAccountBalance, MdAttachMoney, MdAutoGraph, MdCreditCard, MdDirectionsCar, MdEmail, MdFavorite, MdFeaturedPlayList, MdFitnessCenter, MdHome, MdPets, MdRestaurant, MdSchool, MdShoppingCart, MdSportsSoccer, MdWallet } from "react-icons/md";

export const enderecoServidor = 'http://localhost:3000'

export const CORES_GRAFICO = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const listaCores = ['#FF5733', '#FFC300', '#DAF7A6', '#33FF57', '#33A1FF', '#8D33FF', '#FF33EC', '#FF33A1', '#33FFF6', '#FF7F50'];
export const listaIcones = ['restaurant', 'directions-car', 'school', 'home', 'sports-soccer',
    'shopping-cart', 'pets', 'favorite', 'fitness-center', 'wallet', '4k'];

export const iconesCategoria = {
    'restaurant': <MdRestaurant className="w-6 h-6" />,
    'directions-car': <MdDirectionsCar className="w-6 h-6" />,
    'school': <MdSchool className="w-6 h-6" />,
    'home': <MdHome className="w-6 h-6" />,
    'sports-soccer': <MdSportsSoccer className="w-6 h-6" />,
    'shopping-cart': <MdShoppingCart className="w-6 h-6" />,
    'pets': <MdPets className="w-6 h-6" />,
    'favorite': <MdFavorite className="w-6 h-6" />,
    'fitness-center': <MdFitnessCenter className="w-6 h-6" />,
    'wallet': <MdWallet className="w-6 h-6" />,
    '4k': <Md4K className="w-6 h-6" />,
}

export const iconesTipoConta = {
    'CONTA_CORRENTE': <MdAccountBalance className="w-6 h-6" />,
    'POUPANCA': <MdEmail className="w-6 h-6" />,
    'CARTÃO_CREDITO': <MdCreditCard className="w-6 h-6" />,
    'CARTAO_DEBITO': <MdFeaturedPlayList className="w-6 h-6" />,
    'DINHEIRO': <MdAttachMoney className="w-6 h-6" />,
    'INVESTIMENTO': <MdAutoGraph className="w-6 h-6" />,
}

export const nomesTipoConta = {
    'CONTA_CORRENTE': 'Conta Corrente',
    'POUPANCA': 'Poupança',
    'CARTÃO_CREDITO': 'Cartão de Crédito',
    'CARTAO_DEBITO': 'Cartão de Débito',
    'DINHEIRO': 'Dinheiro',
    'INVESTIMENTO': 'Investimento',
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