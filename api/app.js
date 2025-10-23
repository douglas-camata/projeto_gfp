import express from "express";
import { testarConexao } from "./db.js";
import cors from "cors";

import rotasUsuarios, {autenticarToken} from "./routes/rotasUsuarios.js";
import rotasCategorias from "./routes/rotasCategorias.js";
import rotasSubCategorias from "./routes/rotasSubCategorias.js";
import rotasContas from "./routes/rotasContas.js";
import rotasTransacao from "./routes/rotasTransacao.js";

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';


const app = express();

testarConexao();
app.use(express.json());
app.use(cors());


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
    // res.send("API rodando!");    
    res.redirect('/api-docs');
});

// Rotas de Usuários {autenticarToken}
app.get("/usuarios",  rotasUsuarios.listarUsuarios);
app.post("/usuarios", rotasUsuarios.novoUsuario);
app.post('/usuarios/login', rotasUsuarios.login);
app.delete('/usuarios/:id', autenticarToken, rotasUsuarios.deletarUsuario);
app.patch('/usuarios/:id', autenticarToken, rotasUsuarios.atualizar);
app.put('/usuarios/:id', autenticarToken, rotasUsuarios.atualizarTodosCampos);
app.get('/usuarios/:id', autenticarToken, rotasUsuarios.consultaPorId);


// Rotas de categorias {autenticarToken}
app.get("/categorias", autenticarToken, rotasCategorias.listarCategorias);
app.get("/categorias/filtrarCategoria/:tipo_transacao", autenticarToken, rotasCategorias.filtrarCategorias);
app.post("/categorias", autenticarToken, rotasCategorias.novaCategoria);
app.delete('/categorias/:id', autenticarToken, rotasCategorias.deletarCategoria);
app.get('/categorias/:id',  autenticarToken, rotasCategorias.consultaPorId);
app.put('/categorias/:id', autenticarToken, rotasCategorias.atualizarTodosCampos);
app.patch('/categorias/:id', autenticarToken, rotasCategorias.atualizar);

// Rotas de subcategorias {autenticarToken}
app.get('/subcategorias', autenticarToken, rotasSubCategorias.listarSubCategorias);
app.post('/subcategorias', autenticarToken, rotasSubCategorias.novaSubCategoria);
app.delete('/subcategorias/:id', autenticarToken, rotasSubCategorias.deletarSubCategoria);
app.get('/subcategorias/:id', autenticarToken, rotasSubCategorias.consultaPorId);
app.put('/subcategorias/:id', autenticarToken, rotasSubCategorias.atualizarTodosCampos);
app.patch('/subcategorias/:id', autenticarToken, rotasSubCategorias.atualizar);

// Rotas de contas {autenticarToken}
app.get('/contas', autenticarToken,  rotasContas.listarContas);
app.post('/contas', autenticarToken, rotasContas.novoConta);
app.delete('/contas/:id', autenticarToken, rotasContas.deletarContas);
app.get('/contas/:id', autenticarToken, rotasContas.consultaPorId);
app.put('/contas/:id', autenticarToken, rotasContas.atualizarTodosCampos);
app.patch('/contas/:id', autenticarToken, rotasContas.atualizar);

// Rotas de transação {autenticarToken}
app.get('/transacoes', autenticarToken, rotasTransacao.listarTransacao);
app.get('/transacoes/dadosDashboard', rotasTransacao.dadosDashboard);
app.post('/transacoes', autenticarToken, rotasTransacao.novaTransacao);
app.delete('/transacoes/:id', autenticarToken, rotasTransacao.deletarTransacao);
app.get('/transacoes/:id', autenticarToken, rotasTransacao.consultaPorId);
app.put('/transacoes/:id', autenticarToken, rotasTransacao.atualizarTodosCampos);
app.patch('/transacoes/:id', autenticarToken, rotasTransacao.atualizar);

const porta = 3000;
app.listen(porta, () => {
    console.log(`Api rodando em http://localhost:${porta}`);
});
