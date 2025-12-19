import React, { useState, useEffect, useContext } from 'react';
import { UsuarioContext } from '../UsuarioContext'
import { enderecoServidor, nomesTipoConta, iconesTipoConta, iconesCategoria, calcularDatasPeriodo, listaCores, formatarDinheiro, formatarData } from '../utils'
import { MdAdd, MdEdit, MdDelete, MdCreditCard, MdAccountBalance, MdEmail, MdFeaturedPlayList, MdAttachMoney, MdAutoGraph, MdDone, MdCheckCircle, MdError, MdAccessTime, MdSearch, MdAutoAwesome, MdTrendingUp, MdTrendingDown, MdWallet } from 'react-icons/md';
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Estilos from '../styles/Estilos'
import CardIndicador from '../components/CardIndicador';

export default function Dashboard() {
    const { dadosUsuario } = useContext(UsuarioContext);

    const [filtro, setFiltro] = useState({ periodo: 'esteMes' });
    const [carregando, setCarregando] = useState(true);

    const [dadosDashboard, setDadosDashboard] = useState({
        kpis: { despesas: 0, receitas: 0 },
        categorias: [],
        subcategorias: [],
        vencimentos: [],
        evolucao6meses: []
    });

    // Variáveis de estado para a Análise com IA
    const [analise, setAnalise] = useState('');
    const [carregandoAnalise, setCarregandoAnalise] = useState(null);
    const [erroAnalise, setErroAnalise] = useState(null);
    const [modalAnaliseAberto, setModalAnaliseAberto] = useState(false);

    const buscarDadosAPI = async () => {
        try {
            //Calcula e gera as datas de acordo com o filtro período selecionado 
            const { dataInicio, dataFim } = calcularDatasPeriodo(filtro.periodo)

            //Usa o URLSearchParams para construir a query de forma segura
            const parametros = new URLSearchParams();
            parametros.append('dataInicio', dataInicio);
            parametros.append('dataFim', dataFim);

            setCarregando(true);

            const resposta = await fetch(`${enderecoServidor}/transacoes/dadosDashboard?${parametros.toString()}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${dadosUsuario.token}`
                }
            });
            const dados = await resposta.json();
            setDadosDashboard(dados);
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

    // Função do modal de Análise com IA
    const ModalAnalise = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Análise Financeira com IA</h2>
                    <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
                </div>
                <div className="min-h-[200px]">
                    {carregandoAnalise && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="mt-4 text-gray-600">Analisando suas finanças...</p>
                        </div>
                    )}
                    {erroAnalise && <p className="text-red-700 bg-red-50 p-4 rounded-lg">{erroAnalise}</p>}
                    {analise && <div className="prose max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed">{analise}</div>}
                </div>
                <div className="flex justify-end mt-6 pt-4 border-t">
                    <button onClick={() => setModalAberto(false)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Fechar</button>
                </div>
            </div>
        </div>
    );

    // Função para chamar a API da OpenAI para análise
    // Última função em React do Curso que vcs terão
    const analiseComIA = async () => {
        setCarregandoAnalise(true);
        setErroAnalise(null);
        setAnalise('');
        setModalAnaliseAberto(true);

        try {
            // Criando o prompt para enviar para o ChatGPT
            const prompt = `
            Você é um consultor financeiro inteligente. Analise os dados que estou enviando:
            -Receitas: ${dadosDashboard.kpis.receitas}
            -Despesas: ${dadosDashboard.kpis.despesas}
            -Detalhamento de despesas por categoria: ${JSON.stringify(dadosDashboard.categorias)}
            -Detalhamento de despesas por subcategoria: ${JSON.stringify(dadosDashboard.subcategorias)}
            -Ultimos 6 meses: ${JSON.stringify(dadosDashboard.evolucao6meses)}
            Com base nisso, forneça uma análise objetiva e curta (máx 150 palavras):
            1. Uma avaliação geral da saúde financeira deste período.
            2. Aponte a categoria e subcategoria que mais impactou as despesas (se necessário)
            3. Dê uma dica prática e acionável para melhorar no próximo mês.
            4. Analise a evolução das despesas e tendências       
            `;

            // apiKey - é a chave secreta da OpenAI
            const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

            const resposta = await fetch(`https://api.openai.com/v1/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }, 
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 300,
                    temperature : 0.7
                })
            });
            const dados = await resposta.json();
            console.log('dadosIA', dados);
            setAnalise(dados.choices[0].message.content);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setCarregandoAnalise(false);
        }

    }

    const exibirItemLista = (item) => {
        return (
            <div
                key={item.id_transacao}
                className="flex justify-between items-center bg-white rounded-lg shadow-sm p-2 mb-2 hover:shadow-md transition"
            >
                <div
                    className="p-2 rounded-full text-white flex-shrink-0 mr-2"
                    style={{ backgroundColor: item.cor || '#38bdf8' }}
                >
                    {iconesCategoria[item.icone] || <MdAttachMoney className="w-5 h-5" />}
                </div>

                <div className=" flex-1 p-2">
                    <p className="font-semibold text-gray-800 truncate">
                        {item.descricao}
                    </p>
                    <div className='flex justify-between items-center  p-1'>
                        <div className=''>
                            {/* Conta */}
                            <div className="flex  text-gray-500 text-sm flex-col">
                                <span className="truncate max-w-[150px]">{item.nome_subcategoria}  </span>
                                <span className="truncate max-w-[150px]">Venc.: {formatarData(item.data_vencimento)} </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end flex-shrink-0 sm:ml-2">
                            <span className={`font-bold ${item.tipo === 'ENTRADA' ? 'text-green-600' : 'text-red-600'}`}>
                                R$ {parseFloat(item.valor).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            {/* Cabeçalho com filtro e botao de análise */}
            <section className='flex mb-6 justify-between items-center gap-4 sm:flex-row' >
                <div>
                    <h1 className='text-3xl font-bold mb-2'>Dashboard Financeiro</h1>
                    <p className='text-gray-200'>Resumo de suas finanças</p>
                </div>
                <div className='flex items-center gap-3'>
                    <div>
                        <select className={`${Estilos.inputCadastro}`}
                            value={filtro.periodo}
                            onChange={(e) => setFiltro({ ...filtro, periodo: e.target.value })}
                        >
                            <option value="esteMes" className='text-gray-800'>Este Mês</option>
                            <option value="mesPassado" className='text-gray-800'>Mês Passado</option>
                            <option value="ultimos7" className='text-gray-800'>Últimos 7 Dias</option>
                            <option value="ultimos30" className='text-gray-800'>Últimos 30 Dias</option>
                            <option value="Todos" className='text-gray-800'>Todos</option>
                        </select>
                    </div>
                    <button onClick={analiseComIA} className={`flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r  
                                        from-cyan-500 to-sky-600 font-semibold shadow-lg`}>
                        <MdAutoAwesome className='h-6 w-6' />
                        Analisar com IA
                    </button>
                </div>

            </section>

            {/* Seção 1 : CARDS DE INDICADORES - KPIs */}
            <section className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8' >
                <CardIndicador titulo="Total de Receitas" valor={formatarDinheiro(dadosDashboard.kpis.receitas)} cor='#10b981' icone={<MdTrendingUp className='h-9 w-9' />} />
                <CardIndicador titulo="Total de Despesas" valor={formatarDinheiro(dadosDashboard.kpis.despesas)} cor='#ef4444' icone={<MdTrendingDown className='h-9 w-9' />} />
                <CardIndicador titulo="Saldo do Período" valor={formatarDinheiro(dadosDashboard.kpis.receitas - dadosDashboard.kpis.despesas)} cor='#3b82f6' icone={<MdWallet className='h-9 w-9' />} />
            </section>

            {/* Seção 2 : Gráficos */}
            <section className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* DIV - Gráfico Categorias */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                    <h3 className='text-xl font-bold mb-4 text-gray-800'>Despesas por Categoria</h3>
                    {dadosDashboard.categorias.length == 0 ?
                        <p className='text-gray-500 text-center'>Nenhuma despesa registrada no período</p> :
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={dadosDashboard.categorias} dataKey={"valor"} nameKey={"nome"} label={(item) => item.nome}>
                                    {
                                        dadosDashboard.categorias.map((item, index) => (
                                            <Cell key={index} fill={listaCores[index % listaCores.length]} />
                                        ))
                                    }
                                    <Tooltip />
                                    <Legend />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    }


                </div>
                {/* DIV - Gráfico SubCategorias */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                    <h3 className='text-xl font-bold mb-4 text-gray-800'>Despesas por SubCategoria</h3>
                    {dadosDashboard.subcategorias.length == 0 ?
                        <p className='text-gray-500 text-center'>Nenhuma despesa registrada no período</p> :
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={dadosDashboard.subcategorias} dataKey={"valor"} nameKey={"nome"} label={(item) => item.nome}>
                                    {
                                        dadosDashboard.subcategorias.map((item, index) => (
                                            <Cell key={index} fill={listaCores[index % listaCores.length]} />
                                        ))
                                    }
                                    <Tooltip />
                                    
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    }


                </div>

                <div className='bg-white p-6 rounded-lg shadow-md'>
                    <h3 className='text-xl font-bold mb-4 text-gray-800'>Últimos 6 meses</h3>
                    <div className='space-y-3'>
                        {dadosDashboard.evolucao6meses.length == 0 ?
                            <p className='text-gray-500 text-center'>Nenhum registro no período</p> :
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={dadosDashboard.evolucao6meses}>
                                    <XAxis dataKey="mes" fontSize={12} />
                                    <YAxis />
                                    <Legend />
                                    <Tooltip />
                                    <Bar dataKey="total_receitas" fill="#10b981" name="Receitas" radius={[8, 8, 0, 0]} />
                                    <Bar dataKey="total_despesas" fill="#ef4444" name="Despesas" radius={[8, 8, 0, 0]} />
                                    
                                </BarChart>
                            </ResponsiveContainer>
                        }
                    </div>
                </div>

                <div className='bg-white p-6 rounded-lg shadow-md'>
                    <h3 className='text-xl font-bold mb-4 text-gray-800'>Próximos Vencimentos</h3>
                    <div className='space-y-3'>
                        {dadosDashboard.vencimentos.length > 0 ? (
                            dadosDashboard.vencimentos.map(item => (
                                exibirItemLista(item)
                            ))
                        ) : <p className="text-gray-500 text-center py-8">Nenhuma transação encontrada.</p>}
                    </div>
                </div>
            </section>

            {/* Inclindo na tela o Modal se a variável estiver true */}
            {modalAnaliseAberto == true ? <ModalAnalise /> : null }

        </div>
    )
}