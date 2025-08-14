import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, RefreshControl, Modal, TextInput, Button } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Estilos, { corPrincipal } from '../styles/Estilos';
import { enderecoServidor, listaCores, listaIcones } from '../utils';

export default function Categorias({ navigation }) {
    const [dadosLista, setDadosLista] = useState([]);
    const [usuario, setUsuario] = useState({});
    const [atualizando, setAtualizando] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [nomeCategoria, setNomeCategoria] = useState('');
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);

    const [corModalVisible, setCorModalVisible] = useState(false);
    const [iconeModalVisible, setIconeModalVisible] = useState(false);
    const [cor, setCor] = useState('#ff80aa');
    const [icone, setIcone] = useState('wallet');

    const buscarDadosAPI = async () => {
        try {
            const resposta = await fetch(`${enderecoServidor}/categorias`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${usuario.token}`
                }
            });
            const dados = await resposta.json();
            setDadosLista(dados);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    }

    useEffect(() => {
        buscarUsuarioLogado();
    }, [])

    //Executa essa função quando o usuario é alterado
    useEffect(() => {
        buscarDadosAPI();
    }, [usuario])

    const buscarUsuarioLogado = async () => {
        const usuarioLogado = await AsyncStorage.getItem('UsuarioLogado');
        if (usuarioLogado) {
            setUsuario(JSON.parse(usuarioLogado));
        } else {
            navigation.navigate('Login');
        }
    }

    const botaoExcluir = async (id) => {
        try {
            const resposta = await fetch(`${enderecoServidor}/categorias/${id}`, {
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

    const botaoEditar = (item) => {
        setCategoriaSelecionada(item);
        setNomeCategoria(item.nome);
        setCor(item.cor);
        setIcone(item.icone);
        setModalVisible(true);
    }

    const exibirItemLista = ({ item }) => {
        return (
            <TouchableOpacity style={Estilos.itemLista}>
                <View style={{
                    backgroundColor: item.cor,
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 10
                }}>
                    <MaterialIcons name={item.icone} size={20} color={'#fff'} />
                </View>
                <View style={Estilos.textContainer}>
                    <Text style={Estilos.nomeLista}>{item.nome}</Text>
                    <Text>0,00</Text>
                </View>
                <MaterialIcons name='edit' size={24} color={corPrincipal}
                    onPress={() => botaoEditar(item)}
                />
                <MaterialIcons name='delete' size={24} color={corPrincipal}
                    onPress={() => botaoExcluir(item.id_categoria)}
                />
            </TouchableOpacity>
        )
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity >
                    <MaterialIcons name="add" size={28} color="#fff"
                        style={{ marginRight: 15 }}
                        onPress={() => setModalVisible(true)} />
                </TouchableOpacity>
            )
        })
    }, [navigation])

    const botaoSalvar = async () => {
        try {
            const dados = {
                nome: nomeCategoria,
                tipo_transacao: 'SAIDA',
                id_usuario: usuario.id_usuario,
                icone: icone,
                cor: cor
            }

            let endpoint = `${enderecoServidor}/categorias`;
            let metodo = 'POST';

            if (categoriaSelecionada) {
                endpoint = `${enderecoServidor}/categorias/${categoriaSelecionada.id_categoria}`;
                metodo = 'PUT';
            }

            const resposta = await fetch(endpoint, {
                method: metodo,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usuario.token}`
                },
                body: JSON.stringify(dados)
            })

            if (resposta.ok) {
                alert('Categoria salva com sucesso!');
                setModalVisible(false);
                setNomeCategoria('');
                buscarDadosAPI();
                setCategoriaSelecionada(null);
            }

        } catch (error) {
            alert('Erro ao salvar categoria: ' + error);
            console.error('Erro ao salvar categoria:', error);
        }
    }

    const botaoCancelar = () => {
        setModalVisible(false);
        setNomeCategoria('');
        setCategoriaSelecionada(null);
    }

    return (
        <View style={Estilos.conteudoHeader}>
            <View style={Estilos.conteudoCorpo}>
                <FlatList
                    data={dadosLista}
                    renderItem={exibirItemLista}
                    keyExtractor={(item) => item.id_categoria}
                    refreshControl={
                        <RefreshControl refreshing={atualizando} onRefresh={buscarDadosAPI} colors={[corPrincipal]} />
                    }
                />
            </View>
            <Modal visible={modalVisible} transparent={true} animationType="slide"
                onRequestClose={() => setModalVisible(false)} >
                <View style={Estilos.modalFundo}>
                    <View style={Estilos.modalConteudo}>
                        <Text style={Estilos.modalTitulo}>Categoria</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput style={Estilos.inputModal}
                                placeholder='Nome da categoria'
                                placeholderTextColor={'#aaa'}
                                value={nomeCategoria}
                                onChangeText={setNomeCategoria}
                            />
                            <TouchableOpacity style={[Estilos.corBotao, { backgroundColor: cor }]} onPress={() => setCorModalVisible(true)} />
                            <TouchableOpacity style={Estilos.iconeBotao} onPress={() => setIconeModalVisible(true)}>
                                <MaterialIcons name={icone} size={24} color={'#fff'} />
                            </TouchableOpacity>

                        </View>
                        <View style={Estilos.modalBotoes}>
                            <Button title='Cancelar' onPress={botaoCancelar} />
                            <Button title='Salvar' onPress={botaoSalvar} />
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Modal de seleção de cor */}
            <Modal
                visible={corModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setCorModalVisible(false)}>
                <View style={Estilos.modalFundo}>
                    <View style={Estilos.SeletorContainer}>
                        <Text style={Estilos.modalTitulo}>Escolha uma cor</Text>
                        <View style={Estilos.listaModal}>
                            {listaCores.map((corItem) => (
                                <TouchableOpacity
                                    key={corItem}
                                    style={[Estilos.corBotao, { backgroundColor: corItem }]}
                                    onPress={() => {
                                        setCor(corItem);
                                        setCorModalVisible(false);
                                    }}
                                />
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal de seleção de ícone */}
            <Modal
                visible={iconeModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIconeModalVisible(false)}>

                <View style={Estilos.modalFundo}>
                    <View style={Estilos.SeletorContainer}>
                        <Text style={Estilos.modalTitulo}>Escolha um ícone</Text>
                        <View style={Estilos.listaModal}>
                            {listaIcones.map((iconeItem) => (
                                <TouchableOpacity
                                    key={iconeItem}
                                    style={Estilos.iconeBotao}
                                    onPress={() => {
                                        setIcone(iconeItem);
                                        setIconeModalVisible(false);
                                    }}>
                                    <MaterialIcons name={iconeItem} size={24} color="#FFF" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}