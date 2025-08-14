import React, { useState, useEffect, useLayoutEffect} from 'react';
import  {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Estilos, { corPrincipal } from '../styles/Estilos';
import {enderecoServidor, buscarUsuarioLogado} from '../utils';
import { useIsFocused } from '@react-navigation/native';

export default function Contas({navigation}) {
    const [dadosLista, setDadosLista] = useState([]);
    const [usuario, setUsuario] = useState({});

    // Hook para verificar se a tela está em foco
    const isFocused = useIsFocused();

    const buscarDadosAPI = async () => {
        try {
            setUsuario(await buscarUsuarioLogado()); 
            
            const resposta = await fetch(`${enderecoServidor}/contas`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${usuario.token}`
                }
            });
            const dados = await resposta.json();
            setDadosLista(dados);
            console.log('dados', dados);
            
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    }

    //Executa essa função quando o componente é criado [] vazio
    useEffect(() => {
        buscarDadosAPI();
    }, [])

    //Executa essa função quando o usuario é alterado
    useEffect(() => {
        if (isFocused == true) {
            buscarDadosAPI();
        }
    }, [isFocused])

    const botaoExcluir = async (id) => {
        try {
            if (!confirm("Tem certeza que deseja excluir esta conta?")) return;

            const resposta = await fetch(`${enderecoServidor}/contas/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${usuario.token}`
                }
            });

            if (resposta.ok) {
                buscarDadosAPI();
            }            

        } catch (error) {
            console.error('Erro ao excluir:', error);
        }
    }

    const exibirItemLista = ({item}) => {
        return (
            <TouchableOpacity style={Estilos.itemLista}>
                <Image source={require('../assets/logo2.png')} 
                    style={Estilos.imagemLista} />
                <View style={Estilos.textContainer}>
                    <Text>{item.tipo_conta}</Text>
                    <Text style={Estilos.nomeLista}>{item.nome}</Text>
                </View>
                <MaterialIcons name='edit' size={24} color={corPrincipal} 
                    onPress={() => navigation.navigate('CadContas', {Conta: item})}
                />
                <MaterialIcons name='delete' size={24} color={corPrincipal} 
                    onPress={() => botaoExcluir(item.id_conta)}
                />
            </TouchableOpacity>
        )
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('CadContas')}>
                    <MaterialIcons name="add" size={28} color="#fff"  
                        style={{marginRight: 15}} />                    
                </TouchableOpacity>
            )
        })
    }, [navigation])

    return (
        <View style={Estilos.conteudoHeader}>
            <View style={Estilos.conteudoCorpo}>
                <FlatList 
                    data={dadosLista}
                    renderItem={exibirItemLista}
                    keyExtractor={(item) => item.id_conta}
                />
            </View>
        </View>
    )
}