import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, RefreshControl, Modal, TextInput, Button } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Estilos, { corPrincipal, corSecundaria } from '../styles/Estilos';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { enderecoServidor, listaCores, listaIcones, buscarUsuarioLogado } from '../utils';

export default function Categorias({ navigation }) {
    const [dadosLista, setDadosLista] = useState([]);
    const [usuario, setUsuario] = useState({});
    const [atualizando, setAtualizando] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [nomeCategoria, setNomeCategoria] = useState('');
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);

    const [corModalVisible, setCorModalVisible] = useState(false);
    const [iconeModalVisible, setIconeModalVisible] = useState(false);
    const [cor, setCor] = useState('#f00');
    const [icone, setIcone] = useState('wallet');

    const buscarDadosAPI = async () => {
        try {
            setUsuario(await buscarUsuarioLogado());

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
        buscarDadosAPI();
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginRight: 15 }}>
                    <MaterialIcons name="add" size={28} color="#fff" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]); // Adicione setModalVisible como dependência


    const exibirItemLista = ({ item }) => {
        return (
            <View style={Estilos.itemLista}>
                <View
                    style={{
                        backgroundColor: item.cor,
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <MaterialIcons name={item.icone} size={20} color="#fff" />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={Estilos.nomeLista}>{item.nome}</Text>
                    <Text>R$ 0,00</Text>
                </View>
                <MaterialIcons name='edit' size={24} color={corPrincipal}
                    onPress={() => botaoEditar(item)} />
                <MaterialIcons name='delete' size={24} color={corPrincipal}
                    onPress={() => botaoExcluir(item.id_categoria)}
                />
            </View>
        )
    }

    const botaoEditar = (item) => {
        setNomeCategoria(item.nome);
        setCor(item.cor);
        setIcone(item.icone);
        setCategoriaSelecionada(item);
        setModalVisible(true);
    }

    const botaoSalvarCategoria = async () => {
        try {
            const dados = {
                nome: nomeCategoria,
                tipo_transacao: 'SAIDA',
                cor: cor,
                icone: icone,
                id_usuario: usuario.id_usuario
            }

            let endpoint = `${enderecoServidor}/categorias`
            let metodo = 'POST'

            if (categoriaSelecionada) {
                endpoint = `${enderecoServidor}/categorias/${categoriaSelecionada.id_categoria}`
                metodo = 'PUT'
            }

            const resposta = await fetch(endpoint, {
                method: metodo,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usuario.token}`
                },
                body: JSON.stringify(dados)
            });

            if (resposta.ok) {
                alert('Categoria salva com sucesso!')
                setModalVisible(false);
                buscarDadosAPI();
                setNomeCategoria('');
                setCategoriaSelecionada(null);
            } else {
                const erro = await resposta.json();
                alert(`Erro ao salvar categoria: ${erro.message}`);
            }
        } catch (error) {
            console.error('Erro ao salvar categoria:', error);
        }
    };

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
            } else {
                const erro = await resposta.json();
                alert(`Erro ao excluir categoria: ${erro.message}`);
            }
        } catch (error) {
            console.error('Erro ao excluir categoria:', error);
        }
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

            {/* Modal principal */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}>
                <View style={Estilos.modalFundo}>
                    <View style={Estilos.modalConteudo}>
                        <Text style={Estilos.modalTitulo}>Nova Categoria</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <TextInput
                                style={Estilos.inputModal}
                                placeholder="Categoria"
                                placeholderTextColor="#aaa"
                                value={nomeCategoria}
                                onChangeText={setNomeCategoria}
                            />
                            <TouchableOpacity
                                style={[Estilos.corBotao, { backgroundColor: cor }]}
                                onPress={() => setCorModalVisible(true)}
                            />
                            <TouchableOpacity
                                style={Estilos.iconeBotao}
                                onPress={() => setIconeModalVisible(true)}>
                                <MaterialIcons name={icone} size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>


                        {/* Botões de ação */}
                        <View style={Estilos.modalBotoes}>
                            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                            <Button title="Salvar" onPress={botaoSalvarCategoria} />
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
    );
}

const styles = StyleSheet.create({

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    colorOption: {
        padding: 12,
        borderRadius: 10,
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconOption: {
        padding: 12,
        backgroundColor: '#333',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    optionText: { color: '#FFF' },
    colorSelectorContainer: {
        backgroundColor: '#1E1E1E',
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    colorPalette: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    colorButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        margin: 8,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    iconSelectorContainer: {
        backgroundColor: '#1E1E1E',
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    iconGrid: { alignItems: 'center' },
    iconButton: {
        padding: 12,
        margin: 10,
        backgroundColor: '#333',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

});
