import express from "express";
import { testarConexao } from './db.js';
import cors from 'cors';
import rotasUsuarios, { autenticarToken } from "./routes/rotasUsuarios.js";

const app = express();

app.use(cors());
app.use(express.json());

testarConexao();

app.get('/', (req, res) => {
    res.send('API funcionando!');
});

app.post('/usuarios', rotasUsuarios.novoUsuario);
app.post('/usuarios/login', rotasUsuarios.login);
app.get('/usuarios', autenticarToken, rotasUsuarios.listarUsuarios);
app.get('/usuarios/:id', autenticarToken, rotasUsuarios.listarUsuarios);
app.delete('/usuarios/:id', autenticarToken, rotasUsuarios.deletarUsuario);
app.patch('/usuarios/:id', autenticarToken, rotasUsuarios.deletarUsuario);
app.put('/usuarios/:id', autenticarToken, rotasUsuarios.deletarUsuario);

const porta = 3000;
app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
});
