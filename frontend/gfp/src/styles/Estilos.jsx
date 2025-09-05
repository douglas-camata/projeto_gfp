export const corPrincipal = '#59b6ff';
export const corSecundaria = '#706ef9';
export const corTextos = '#f2f2f2';
export const corFundo = '#0d0d0d';
export const corFundo2 = '#262626';

const Estilos = {
    conteudo : {
        flex : 1,
        width : '100%',
        backgroundColor: corFundo
    },
    botaoCadastro: 'sm:w-auto bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 flex items-center justify-center shadow-sm',
    linhaListagem: 'flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow my-2',
    botaoAlterar: 'flex items-center p-1 text-cyan-700 bg-cyan-100 hover:bg-cyan-200 rounded-md transition-colors',
    botaoExcluir: 'flex items-center p-1 text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors',
    labelCadastro: 'block mb-1 font-medium text-gray-700',
    inputCadastro: 'w-full border border-gray-300 px-4 py-2 rounded-lg shadow-lg focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500',
    botaoOutline: 'flex items-center gap-2 px-4 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-200',
    botao: 'flex items-center gap-2 px-4 py-2 border text-white bg-cyan-600 rounded-lg hover:bg-cyan-700',
    listaItensModalCategorias: 'flex gap-2 justify-center flex-wrap',
    iconeCorBotaoModal:`w-10 h-10 p-1 rounded-full text-white flex items-center justify-center 
                            cursor-pointer hover:scale-110 transition-transform`,
}

export default Estilos;