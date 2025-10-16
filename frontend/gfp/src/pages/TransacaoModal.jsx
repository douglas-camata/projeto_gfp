import { useState, useEffect, useContext } from 'react';
import { UsuarioContext } from '../UsuarioContext'
import { enderecoServidor } from '../utils'
import { MdCreditCard, MdSave, MdClose } from 'react-icons/md';
import Estilos from '../styles/Estilos'

export default function TransacaoModal({ modalAberto, fecharModal, itemAlterar }) {
    const { dadosUsuario } = useContext(UsuarioContext);

    const [descricao, setDescricao] = useState('');
    const [tipo, setTipo] = useState('SAIDA');
    const [valor, setValor] = useState('');
    const [dataVencimento, setDataVencimento] = useState(new Date().toISOString().split('T')[0]);
    const [dataPagamento, setDataPagamento] = useState(null);
    const [idConta, setIdConta] = useState('');
    const [idCategoria, setIdCategoria] = useState('');
    const [idSubcategoria, setIdSubcategoria] = useState('');

    // Estados para armazenar os dados da API para os selects
    const [contas, setContas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);

    const carregarContas = async () => {
        try {
            const resposta = await fetch(`${enderecoServidor}/contas`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${dadosUsuario.token}`
                }
            });
            const dados = await resposta.json();
            setContas(dados);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    }

    const carregarCategorias = async () => {
        try {
            const resposta = await fetch(`${enderecoServidor}/categorias`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${dadosUsuario.token}`
                }
            });
            const dados = await resposta.json();
            setCategorias(dados);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    }

    const carregarSubcategorias = async (id) => {
        try {
            const resposta = await fetch(`${enderecoServidor}/subcategorias/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${dadosUsuario.token}`
                }
            });
            const dados = await resposta.json();
            setSubcategorias(dados);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    }

    useEffect(() => {
        if (itemAlterar) {

        } else {
            setDescricao('')
            setTipo('SAIDA')
            setValor('')
            setDataVencimento(new Date().toISOString().split('T')[0])
            setDataPagamento(null)
            setIdConta('')
            setIdCategoria('')
            setIdSubcategoria('')
        }

        if (modalAberto == true) {
            carregarContas()
            carregarCategorias()
        }
    }, [itemAlterar, modalAberto]);

    useEffect(() => {
        if (idCategoria != '') {
            carregarSubcategorias(idCategoria)
        } else {
            setSubcategorias([])
        }
    }, [idCategoria])

    if (modalAberto == false) {
        return null
    }

    const botaoSalvar = async () => {
        if (descricao.trim() == '' || !valor || !dataVencimento) {
            alert('Por favor, preencha os campos obrigatórios.')
            return
        }
        const dados = {
            descricao: descricao,
            valor: parseFloat(valor),
            data_vencimento: dataVencimento,
            data_pagamento: dataPagamento,
            tipo: tipo,
            id_conta: parseInt(idConta),
            id_categoria: parseInt(idCategoria),
            id_subcategoria: parseInt(idSubcategoria),
            id_usuario: parseInt(dadosUsuario.id_usuario)
        }

        try {
            let endpoint = `${enderecoServidor}/transacoes`
            let metodo = 'POST'

            if (itemAlterar) {
                endpoint = `${enderecoServidor}/transacoes/${itemAlterar.id_transacao}`
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
                alert('Transação gravada com sucesso!')
                fecharModal()
            }

        } catch (error) {
            alert('Erro ao salvar categoria: ' + error.message)
            console.error('Erro ao salvar categoria:', error);
        }
    }

    return (
        <div className='fixed inset-0 bg-black/80 py-6 px-4 flex justify-center items-center z-50'>
            <section className='w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg text-gray-800'>
                {/* Cabeçalho */}
                <header className='flex itens-center gap-2 mb-6 border-b border-gray-200 pb-4'>
                    <MdCreditCard className='text-cyan-600 h-8 w-8' />
                    <h2 className='text-2xl font-bold'>
                        {itemAlterar ? 'Editar Transação' : 'Nova Transação'}
                    </h2>
                </header>

                {/* Formulário de cadastro */}
                <div className='space-y-5'>
                    <div className='flex rounded-md shadow-sm'>
                        <button type='button' onClick={() => setTipo('ENTRADA')}
                            className={`flex-1 p-2 rounded-l-md 
                            ${tipo == 'ENTRADA' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>ENTRADA</button>

                        <button type='button' onClick={() => setTipo('SAIDA')}
                            className={`flex-1 p-2 rounded-r-md 
                            ${tipo == 'SAIDA' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>SAÍDA</button>
                    </div>

                    <div className='flex items-center gap-3 '>
                        <div className='w-2/3'>
                            <label className={Estilos.labelCadastro} >Descrição *</label>
                            <input type="text" value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                placeholder='Ex.: Escola, petshop, pizzaria...'
                                className={Estilos.inputCadastro} />
                        </div>
                        <div className='w-1/3'>
                            <label className={Estilos.labelCadastro} >Valor *</label>
                            <input type="number" value={valor}
                                onChange={(e) => setValor(e.target.value)}
                                placeholder='0,00'
                                className={Estilos.inputCadastro} />
                        </div>
                    </div>

                    <div className='flex items-center gap-3 '>
                        <div className='w-1/2'>
                            <label className={Estilos.labelCadastro} >Data Vencimento *</label>
                            <input type="date" value={dataVencimento}
                                onChange={(e) => setDataVencimento(e.target.value)}
                                className={Estilos.inputCadastro} />
                        </div>
                        <div className='w-1/2'>
                            <label className={Estilos.labelCadastro} >Data Pagamento</label>
                            <input type="date" value={dataPagamento}
                                onChange={(e) => setDataPagamento(e.target.value)}
                                className={Estilos.inputCadastro} />
                        </div>
                    </div>

                    <div>
                        <label className={Estilos.labelCadastro} >Conta / Cartão</label>
                        <select className={Estilos.inputCadastro}
                            value={idConta} onChange={(e) => { setIdConta(e.target.value) }} >
                            <option value="">Selecione uma conta...</option>
                            {
                                contas.map(item => (
                                    <option key={item.id_conta} value={item.id_conta}>{item.nome}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div className='flex gap-3'>
                        <div className='w-1/2'>
                            <label className={Estilos.labelCadastro} >Categorias</label>
                            <select className={Estilos.inputCadastro}
                                value={idCategoria} onChange={(e) => { setIdCategoria(e.target.value) }} >
                                <option value="">Selecione uma categoria...</option>
                                {
                                    categorias.filter(item => item.tipo_transacao == tipo).map(item => (
                                        <option key={item.id_categoria} value={item.id_categoria}>{item.nome}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className='w-1/2'>
                            <label className={Estilos.labelCadastro} >Subcategorias</label>
                            <select className={Estilos.inputCadastro}
                                value={idSubcategoria} onChange={(e) => { setIdSubcategoria(e.target.value) }} >
                                <option value="">Selecione uma subcategoria...</option>
                                {
                                    subcategorias.map(item => (
                                        <option key={item.id_subcategoria} value={item.id_subcategoria}>{item.nome}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>

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