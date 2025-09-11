import React, { useState, useEffect, useContext } from 'react';
import { UsuarioContext } from '../UsuarioContext'
import { enderecoServidor, iconesCategoria } from '../utils'
import { MdAdd, MdEdit, MdDelete, MdExpandMore, MdChevronRight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom'
import Estilos from '../styles/Estilos'
import CategoriasModal from './CategoriasModal';
import SubCategoriasModal from './SubCategoriasModal';

export default function Categorias() {
    const { dadosUsuario, setDadosUsuario, carregando } = useContext(UsuarioContext);
    const [dadosLista, setDadosLista] = useState([]);

    // Novo estados para a subcategoria
    const [categoriaAbertaId, setCategoriaAbertaId] = useState(null);
    const [subcategoriaLista, setSubcategoriaLista] = useState([]);
    const [subcategoriaModalAberto, setSubcategoriaModalAberto] = useState(false);
    const [subcategoriaItemAlterar, setSubcategoriaItemAlterar] = useState(null);

    // Variaveis para controle do modal
    const [modalAberto, setModalAberto] = useState(false);
    const [itemAlterar, setItemAlterar] = useState(null);

    const fecharModal = () => {
        setModalAberto(false)
        setItemAlterar(null)
        buscarDadosAPI()
    }

    const fecharModalSubcategoria = () => {
        setSubcategoriaModalAberto(false)
        setSubcategoriaItemAlterar(null)
        if (categoriaAbertaId != null) {
            buscarDadosSubCategoriasAPI(categoriaAbertaId)
        }
    }

    const botaoAlterar = (item) => {
        setItemAlterar(item)
        setModalAberto(true)
    }

    const buscarDadosAPI = async () => {
        try {
            const resposta = await fetch(`${enderecoServidor}/categorias`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${dadosUsuario.token}`
                }
            });
            const dados = await resposta.json();
            setDadosLista(dados);
            console.log('dados', dados);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    }

    useEffect(() => {
        if (!carregando || dadosUsuario) {
            buscarDadosAPI();
        }
    }, [dadosUsuario])

    const botaoExcluir = async (id) => {
        try {
            if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) return;

            const resposta = await fetch(`${enderecoServidor}/categorias/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${dadosUsuario.token}`
                }
            });

            if (resposta.ok) buscarDadosAPI();

        } catch (error) {
            console.error('Erro ao excluir:', error);
        }
    }

    const exibirItemLista = (item) => {
        const estaAberta = categoriaAbertaId == item.id_categoria
        // if (categoriaAbertaId == item.id_categoria) {
        //     const estaAberta = true
        // } else {
        //     const estaAberta = false
        // }

        return (
            <section key={item.id_categoria} >
                <div className={Estilos.linhaListagem} onClick={() => exibirListagemSubCategorias(item.id_categoria)}>
                    <div className='p-2 text-white rounded-full' style={{ backgroundColor: item.cor }} >
                        {iconesCategoria[item.icone]}
                    </div>
                    <div className='flex-1 ml-4'>
                        <p className='font-bold text-gray-800'>{item.nome}</p>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full 
                        ${item.tipo_transacao == 'SAIDA' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'} `}>
                            {item.tipo_transacao}
                        </span>
                    </div>
                    <div className='flex items-center space-x-2'>
                        {estaAberta
                            ? <MdExpandMore className='h-7 w-7 text-gray-500' />
                            : <MdChevronRight className='h-7 w-7 text-gray-500' />}

                        <button className={Estilos.botaoAlterar} onClick={() => botaoAlterar(item)}> <MdEdit className='h-6 w-6' /></button>
                        <button className={Estilos.botaoExcluir} onClick={() => botaoExcluir(item.id_categoria)} > <MdDelete className='h-6 w-6' /></button>
                    </div>
                </div>
                {/* Exibindo listagem das subcategorias */}
                {estaAberta ? exibirSubCategorias(item) : null}
            </section>
        )
    }

    // Funções para a subcategoria
    const exibirListagemSubCategorias = (id) => {
        if (categoriaAbertaId == id) {
            setCategoriaAbertaId(null)
        } else {
            setCategoriaAbertaId(id)
            buscarDadosSubCategoriasAPI(id)
        }
    }

    const buscarDadosSubCategoriasAPI = async (id) => {
        try {
            const resposta = await fetch(`${enderecoServidor}/subcategorias/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${dadosUsuario.token}`
                }
            });
            const dados = await resposta.json();
            setSubcategoriaLista(dados);
            console.log('dados', dados);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    }

    const botaoNovaSubcategoria = () => {
        setSubcategoriaItemAlterar(null)
        setSubcategoriaModalAberto(true)
    }

    const botaoAlterarSubcategoria = (item) => {
        setSubcategoriaItemAlterar(item)
        setSubcategoriaModalAberto(true)
    }

    const botaoExcluirSubcategoria = async (id) => {
        try {
            if (!window.confirm("Tem certeza que deseja excluir esta subcategoria?")) return;

            const resposta = await fetch(`${enderecoServidor}/subcategorias/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${dadosUsuario.token}`
                }
            });

            if (resposta.ok) buscarDadosSubCategoriasAPI(categoriaAbertaId);

        } catch (error) {
            console.error('Erro ao excluir:', error);
        }
    }

    const exibirSubCategorias = (categoria) => {
        return (
            <div className='bg-gray-50 p-4 mt-2 ml-10 rounded-lg border border-gray-200'>
                <div className='flex justify-between items-center mb-3'>
                    <h4 className='font-bold text-gray-700'>Subcategorias de {categoria.nome}</h4>
                    <button className='bg-sky-600 px-3 py-1 rounded-md flex items-center'
                        onClick={botaoNovaSubcategoria}>
                        <MdAdd className='h-5 w-5 mr-1' /> Nova Subcategoria
                    </button>
                </div>

                {
                    subcategoriaLista.length == 0 ? <p className='text-gray-800'>Nenhuma subcategoria cadastrada</p> : null
                }

                <div className='space-y-2'>
                    {
                        subcategoriaLista.map(subcategoria => (
                            <div key={subcategoria.id_subcategoria}
                                className='flex justify-between items-center p-2 bg-white rounded shadow-sm'>
                                <p className='text-gray-800'>{subcategoria.nome} </p>
                                <div className='flex items-center space-x-2'>
                                    <button className={Estilos.botaoAlterar} onClick={() => botaoAlterarSubcategoria(subcategoria)}> <MdEdit className='h-6 w-6' /></button>
                                    <button className={Estilos.botaoExcluir} onClick={() => botaoExcluirSubcategoria(subcategoria.id_subcategoria)} > <MdDelete className='h-6 w-6' /></button>
                                </div>
                            </div>
                        ))
                    }
                </div>

            </div>
        )
    }

    return (
        <div>
            <p className='text-3xl font-bold mb-6' >Categorias</p>
            <section className='bg-white p-4 rounded-lg shadow-md'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='text-xl font-bold text-gray-800'>Gerenciar Categorias</h3>
                    <button onClick={() => setModalAberto(true)} className={Estilos.botaoCadastro}>
                        <MdAdd className='h-8 w-8' /> Nova Categoria
                    </button>
                </div>

                {/* Listas das Contas cadastradas */}
                <section>
                    {dadosLista.map(item => exibirItemLista(item))}
                </section>
            </section>

            <CategoriasModal
                modalAberto={modalAberto}
                fecharModal={fecharModal}
                itemAlterar={itemAlterar}
            />

            <SubCategoriasModal 
                modalAberto={subcategoriaModalAberto}
                fecharModal={fecharModalSubcategoria}
                itemAlterar={subcategoriaItemAlterar}
                categoriaPai={categoriaAbertaId}
            />
        </div>
    )
}