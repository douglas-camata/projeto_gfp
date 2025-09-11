import React, { useState, useEffect, useContext } from 'react';
import { UsuarioContext } from '../UsuarioContext'
import { enderecoServidor } from '../utils'
import { MdCreditCard, MdSave, MdClose } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom'
import Estilos from '../styles/Estilos'

export default function SubCategoriasModal({ modalAberto, fecharModal, itemAlterar, categoriaPai }) {
    const { dadosUsuario } = useContext(UsuarioContext);

    const [nome, setNome] = useState('');

    useEffect(() => {
        if (itemAlterar) {
            setNome(itemAlterar.nome);
        } else {
            setNome('');
        }
    }, [itemAlterar, modalAberto]);

    if (modalAberto == false) {
        return null
    }

    const botaoSalvar = async () => {
        if (nome.trim() == '') {
            alert('Informe o nome da subcategoria')
            return
        }
        const dados = {
            nome: nome,
            id_categoria: categoriaPai,
            ativo: true
        }

        try {
            let endpoint = `${enderecoServidor}/subcategorias`
            let metodo = 'POST'

            if (itemAlterar) {
                endpoint = `${enderecoServidor}/subcategorias/${itemAlterar.id_subcategoria}`
                metodo = 'PUT'
            }

            const resposta = await fetch(endpoint, {
                method: metodo,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${dadosUsuario.token}`
                },
                body: JSON.stringify(dados)
            })

            if (resposta.ok) {
                alert('Subcategoria gravada com sucesso!')
                fecharModal()
            }

        } catch (error) {
            alert('Erro ao salvar subcategoria: ' + error.message)
            console.error('Erro ao salvar subcategoria:', error);
        }
    }

    return (
        <div className='fixed inset-0 bg-black/80 py-6 px-4 flex justify-center items-center z-50'>
            <section className='w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg text-gray-800'>
                {/* Cabeçalho */}
                <header className='flex itens-center gap-2 mb-6 border-b border-gray-200 pb-4'>
                    <MdCreditCard className='text-cyan-600 h-8 w-8' />
                    <h2 className='text-2xl font-bold'>
                        {itemAlterar ? 'Editar Subcategoria' : 'Nova Subcategoria'}
                    </h2>
                </header>

                {/* Formulário de cadastro */}
                <div className='space-y-5'>
                    <label className={Estilos.labelCadastro} >Nome da Subcategoria</label>
                    <input type="text" value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder='Ex.: Supermercado, escola, etc.'
                        className={Estilos.inputCadastro} />
                    
                    {/* Botões de controle */}
                    <div className='flex justify-end gap-3 mt-8'>
                        <button className={Estilos.botaoOutline} onClick={() => fecharModal()}>
                            <MdClose /> Cancelar
                        </button>
                        <button className={Estilos.botao} onClick={botaoSalvar}>
                            <MdSave /> Salvar
                        </button>
                    </div>
                </div>

            </section>
        </div>
    )

}