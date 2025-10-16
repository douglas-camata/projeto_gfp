import React, { useState, useEffect, useContext } from 'react';
import { UsuarioContext } from '../UsuarioContext'
import { enderecoServidor, nomesTipoConta, iconesTipoConta, iconesCategoria, calcularDatasPeriodo } from '../utils'
import { MdAdd, MdEdit, MdDelete, MdCreditCard, MdAccountBalance, MdEmail, MdFeaturedPlayList, MdAttachMoney, MdAutoGraph, MdDone, MdCheckCircle, MdError, MdAccessTime, MdSearch } from 'react-icons/md';
import { data, useNavigate } from 'react-router-dom'
import Estilos from '../styles/Estilos'

export default function Transacoes() {
    //Guarda os dados do usuario logado, nome, id, email, token
    const { dadosUsuario, setDadosUsuario, carregando } = useContext(UsuarioContext);
    //Guardar os dados da lista vinda da API
    const [dadosLista, setDadosLista] = useState([]);

    //Guardando os dados dos filtros
    const [pesquisa, setPesquisa] = useState('');
    const [filtro, setFiltro] = useState(
    {
        tipo: 'Todos',
        status: 'Todos', 
        periodo: 'esteMes'
    });

    const navigate = useNavigate();

    const buscarDadosAPI = async () => {
        try {
            //Calcula e gera as datas de acordo com o filtro período selecionado 
            const { dataInicio, dataFim } = calcularDatasPeriodo(filtro.periodo)

            //Usa o URLSearchParams para construir a query de forma segura
            const parametros = new URLSearchParams();
            parametros.append('dataInicio', dataInicio);
            parametros.append('dataFim', dataFim);

            console.log(dataInicio, dataFim);
            console.log(`${enderecoServidor}/transacoes?${parametros.toString()}`);

            const resposta = await fetch(`${enderecoServidor}/transacoes?${parametros.toString()}`, {
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
    }, [dadosUsuario, filtro.periodo])

    const botaoExcluir = async (id) => {
        try {
            if (!window.confirm("Tem certeza que deseja excluir esta transação?")) return;

            const resposta = await fetch(`${enderecoServidor}/transacoes/${id}`, {
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

    const botaoQuitar = async (id) => {
        try {
            if (!window.confirm("Tem certeza que deseja quitar esta conta?")) return;

            // Criando objeto para atualizar a data de pagamento da transação
            const dados = {
                data_pagamento: new Date().toISOString().slice(0, 10)
            }

            const resposta = await fetch(`${enderecoServidor}/transacoes/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${dadosUsuario.token}`
                },
                body: JSON.stringify(dados)
            });

            if (resposta.ok) buscarDadosAPI();

        } catch (error) {
            console.error('Erro ao excluir:', error);
        }
    }

    const montarStatus = (item) => {
        const hoje = new Date();
        const vencimento = new Date(item.data_vencimento);
        let status = {};

        if (item.data_pagamento != null) {
            status = {
                cor: 'text-green-600',
                icone: <MdCheckCircle className='h-4 w-4' />,
                texto: `Pago em ${formatarData(item.data_pagamento)}`
            }
        } else if (vencimento < hoje) {
            status = {
                cor: 'text-red-600',
                icone: <MdError className='h-4 w-4' />,
                texto: `Vencido em ${formatarData(item.data_vencimento)}`
            }
        } else {
            status = {
                cor: 'text-yellow-600',
                icone: <MdAccessTime className='h-4 w-4' />,
                texto: `Vence em ${formatarData(item.data_vencimento)}`
            }
        }
        return status
    }

    const formatarData = (data) => {
        const dataFormatada = new Date(data);
        return dataFormatada.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }

    const exibirItemLista = (item) => {
        const status = montarStatus(item);

        return (
            <section key={item.id_transacao} className={Estilos.linhaListagem}>
                <div className={`p-2 text-white rounded-full`} style={{ backgroundColor: item.cor }}>
                    {iconesCategoria[item.icone]}
                </div>

                <div className='flex-1 p-2' >
                    {/* Descrição */}
                    <p className='text-gray-800 font-semibold text-sm truncate'>{item.descricao}</p>
                    <div className='flex justify-between items-center'>
                        <div >
                            {/* SubCategoria */}
                            <p className='text-sm text-gray-500 truncate'>{item.nome_subcategoria}</p>

                            {/* Conta */}
                            <p className="text-sm text-gray-500 truncate flex" >{item.nome_conta}</p>

                            {/* Status */}
                            <div className={`flex items-center text-xs gap-1 ${status.cor} `}>
                                {status.icone}
                                <span>{status.texto}</span>
                            </div>

                        </div>
                        <div className='flex flex-col items-end'>
                            {/* Valor */}
                            <p className={`font-bold ${item.tipo == 'ENTRADA' ? 'text-green-600' : 'text-red-600'}`}>
                                R$ {parseFloat(item.valor).toFixed(2)}
                            </p>
                            {/* Botões de Ação */}
                            <div className='flex items-center space-x-2'>
                                {/* Condição para exibir o botão de quitar */}
                                {/*if (!item.data_pagamento) { <button > } */}
                                {!item.data_pagamento && <button className={Estilos.botaoQuitar} onClick={() => botaoQuitar(item.id_transacao)}> <MdDone className='h-6 w-6' /></button>}

                                <button className={Estilos.botaoExcluir} onClick={() => botaoExcluir(item.id_transacao)} > <MdDelete className='h-6 w-6' /></button>
                            </div>

                        </div>
                    </div>
                </div>

            </section>
        )
    }

    return (
        <div>
            <p className='text-3xl font-bold mb-6' >Transações</p>
            <section className='bg-white p-4 rounded-lg shadow-md text-gray-800'>
                {/*  Filtros */}
                <div className='flex mb-3 gap-2 flex-wrap items-end  '>
                    {/* Div da barra de pesquisa */}
                    <div className='flex-1 min-w-48' >
                        <label>Busca: </label>
                        <div className='relative'>
                            <MdSearch className='absolute top-3 left-3 text-gray-400 w-5 h-5' />
                            <input type="text" placeholder='Buscar transação...'
                                className={`${Estilos.inputCadastro} pl-9`}
                                value = {pesquisa}
                                onChange={(e) => setPesquisa(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* Div da seleção de período */}
                    <div className='flex-1 min-w-48' >
                        <label>Período: </label>
                        <select className={`${Estilos.inputCadastro}`} 
                            value={filtro.periodo}
                            onChange={(e) => setFiltro({...filtro, periodo: e.target.value})}
                        >
                            <option value="esteMes">Este Mês</option>
                            <option value="mesPassado">Mês Passado</option>
                            <option value="ultimos7">Últimos 7 Dias</option>
                            <option value="ultimos30">Últimos 30 Dias</option>
                            <option value="Todos">Todos</option>
                        </select>
                    </div>
                    {/* Div da seleção de TIPO */}
                    <div className='flex-1 min-w-48' >
                        <label>Tipo: </label>
                        <select className={`${Estilos.inputCadastro}`} 
                            value={filtro.tipo}
                            onChange={(e) => setFiltro({...filtro, tipo: e.target.value})}
                        >
                            <option value="Todos">Todos</option>
                            <option value="ENTRADA">Entrada</option>
                            <option value="SAIDA">Saída</option>                            
                        </select>
                    </div>
                    {/* Div da seleção de Status */}
                    <div className='flex-1 min-w-48' >
                        <label>Status: </label>
                        <select className={`${Estilos.inputCadastro}`} 
                            value={filtro.status}
                            onChange={(e) => setFiltro({...filtro, status: e.target.value})}
                        >
                            <option value="Todos">Todos</option>
                            <option value="aberto">Em Aberto</option>
                            <option value="vencido">Vencidos</option>                            
                            <option value="pagos">Pagos</option>                            
                        </select>
                    </div>

                </div>

                {/* Listas das Contas cadastradas */}
                <section>
                    {dadosLista
                    .filter(item => item.descricao.toLowerCase().includes(pesquisa.toLowerCase()))
                    .filter(item => filtro.tipo == 'Todos' ? true : item.tipo == filtro.tipo )
                    .filter(item => filtro.status == 'Todos' || 
                                (filtro.status == 'pagos' && item.data_pagamento != null) || 
                                (filtro.status == 'aberto' && item.data_pagamento == null && new Date(item.data_vencimento) >= new Date()) ||
                                (filtro.status == 'vencido' && item.data_pagamento == null && new Date(item.data_vencimento) < new Date()) 
                     )
                    .map(item => exibirItemLista(item))}
                </section>
            </section>
        </div>
    )
}