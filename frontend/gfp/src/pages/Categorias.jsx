import React, { useState, useEffect, useContext } from 'react';
import { UsuarioContext } from '../UsuarioContext'
import { enderecoServidor, iconesCategoria } from '../utils'
import { MdAdd, MdEdit, MdDelete} from 'react-icons/md';
import { useNavigate } from 'react-router-dom'
import Estilos from '../styles/Estilos'
import CategoriasModal from './CategoriasModal';

export default function Categorias() {
    const { dadosUsuario, setDadosUsuario, carregando } = useContext(UsuarioContext);
    const [dadosLista, setDadosLista] = useState([]);

    // Variaveis para controle do modal
    const [modalAberto, setModalAberto] = useState(false);
    const [itemAlterar, setItemAlterar] = useState(null);
    
    const fecharModal =() => {
        setModalAberto(false)
        setItemAlterar(null)
        buscarDadosAPI()
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
        return (
            <div key={item.id_categoria} className={Estilos.linhaListagem}>
                <div className='p-2 text-white rounded-full' style={{backgroundColor: item.cor}} >
                    { iconesCategoria[item.icone] }
                </div>
                <div className='flex-1 ml-4'>
                    <p className='font-bold text-gray-800'>{item.nome}</p>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full 
                        ${item.tipo_transacao == 'SAIDA' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'} `}>
                        {item.tipo_transacao}
                    </span>
                </div>
                <div className='flex items-center space-x-2'>
                    <button className={Estilos.botaoAlterar} onClick={() => botaoAlterar(item)}> <MdEdit className='h-6 w-6' /></button>
                    <button className={Estilos.botaoExcluir} onClick={() => botaoExcluir(item.id_categoria)} > <MdDelete className='h-6 w-6' /></button>
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
        </div>
    )
}