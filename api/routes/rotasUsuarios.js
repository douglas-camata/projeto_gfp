import { BD } from "../db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const SECRET_KEY = 'Senai'

class rotasUsuarios {

    static async novoUsuario(req, res) {
        const { nome, email, senha, tipo_acesso } = req.body;
        const senhaHash = await bcrypt.hash(senha, 10); // Criptografa a senha
        try {
            const sql = 'INSERT INTO usuarios (nome, email, senha, tipo_acesso) VALUES ($1, $2, $3, $4) RETURNING *';
            const valores = [nome, email, senhaHash, tipo_acesso];
            const resultado = await BD.query(sql, valores);
            res.status(201).json(resultado.rows[0]);
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            res.status(500).json({ error: 'Erro ao criar usuário' });
        }
    }

    static async login(req, res) {
        const { email, senha } = req.body;

        try {
            const sql = `SELECT id_usuario, nome, email, senha, tipo_acesso FROM usuarios WHERE email = $1`;
            const valores = [email];
            const resultado = await BD.query(sql, valores);
            if (resultado.rows.length === 0) {
                throw new Error("Usuário não encontrado");
            }
            const usuario = resultado.rows[0];
            const senhaValida = await bcrypt.compare(senha, usuario.senha)

            if (!senhaValida) {
                throw new Error("Senha inválida");
            }
            console.log({ id_usuario: usuario.id_usuario, nome: usuario.nome, email: usuario.email });

            //Gerar um novo token para o usuário
            const token = jwt.sign(
                { id_usuario: usuario.id_usuario, nome: usuario.nome, email: usuario.email },
                SECRET_KEY
            )

            return res.status(200).json({ message: 'Login realizado com sucesso', token });
        }
        catch (error) {
            console.error('Erro ao realizar login:', error)
            return res.status(500).json({ message: 'Erro ao realizar login', erro: error.message })
        }
    }

    static async listarUsuarios(req, res) {
        try {
            const usuarios = await BD.query("SELECT * FROM usuarios");
            res.status(200).json(usuarios.rows);
        } catch (error) {
            console.error("Erro ao listar usuários:", error);
            res.status(500).json({ message: "Erro ao listar usuários", error: error.message });
        }
    }

    static async deletarUsuario(req, res) {
        const { id } = req.params;
        try {
            // Chama o metodo na classe usuario para deletar um usuario
            const usuario = await BD.query(
                `UPDATE usuarios SET ativo = false WHERE id_usuario = $1 `,
                [id]
            );
            return res.status(200).json({ message: "Usuário desativado com sucesso!" });
        } catch (error) {
            console.error("Erro ao deletar usuário:", error);
            res.status(500).json({ message: "Erro ao deletar usuário", error: error.message });
        }
    }

    static async consultaPorId(req, res) {
        const { id } = req.params;

        try {
            const usuario = await BD.query(
                `SELECT * FROM usuarios WHERE id_usuario = $1`,
                [id]
            );
            return res.status(200).json(usuario.rows[0]);
        } catch (error) {
            console.error("Erro ao consultar usuário:", error);
            res.status(500).json({ message: "Erro ao consultar usuário", error: error.message });
        }
    }
    static async atualizarTodosCampos(req, res) {
        const { id } = req.params;
        const { nome, email, senha, tipo_acesso } = req.body;
        try {
            const usuario = await BD.query(
                `UPDATE usuarios SET nome = $1, email = $2, senha = $3, tipo_acesso = $4 WHERE id_usuario = $5 RETURNING *`, // comando para atualizar o usuario
                [nome, email, senha, tipo_acesso, id] // comando para atualizar o usuario
            )
            return res.status(200).json(usuario.rows[0]);
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            res.status(500).json({ message: "Erro ao atualizar usuário", error: error.message });
        }
    }

    static async atualizar(req, res) {
        const { id } = req.params;
        const { nome, email, senha, tipo_acesso } = req.body;
        try {
            // Inicializar arrays(vetores) para armazenar os campos e valores que serão atualizados
            const campos = [];
            const valores = [];

            // Verificar quais campos foram fornecidos
            if (nome !== undefined) {
                campos.push(`nome = $${valores.length + 1}`);
                valores.push(nome);
            }
            if (email !== undefined) {
                campos.push(`email = $${valores.length + 1}`);
                valores.push(email);
            }
            if (senha !== undefined) {
                campos.push(`senha = $${valores.length + 1}`);
                valores.push(senha);
            }
            if (tipo_acesso !== undefined) {
                campos.push(`tipo_acesso = $${valores.length + 1}`);
                valores.push(tipo_acesso);
            }
            if (campos.length === 0) {
                return res.status(400).json({ message: "Nenhum campo para atualizar foi fornecido." });
            }

            // adicionar o id ao final de valores

            // montamos a query dinamicamente
            const query = `UPDATE usuarios SET ${campos.join(", ")}  
                          WHERE id_usuario = ${id} RETURNING *`;
            // Executando a query
            const usuario = await BD.query(query, valores);

            // Verifica se o uusario foi atualizado
            if (usuario.rows.length === 0) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            return res.status(200).json(usuario.rows[0]);
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            res.status(500).json({ message: "Erro ao atualizar usuário", error: error.message });
        }
    }
}

export function autenticarToken(req, res, next) {
    //Extrair o token do cabeçalho da requisição
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Token de autenticação ausente' });
    }
    try {
        //Verificar e decodificar o token
        // const decoded = jwt.verify(token, SECRET_KEY);
        // req.id_usuario = decoded.id_usuario;
        // next(); // Continuar para a rota protegida

        // return
        //Como o Ricardo fez:
        jwt.verify(token.split(' ')[1], SECRET_KEY, (err, usuario) => {
            if (err) {
                return res.status(401).json({ message: 'Token de autenticação inválido' });
            } else {
                req.usuarioLogado = usuario;
                next(); // Continuar para a rota protegida
            }
        })
    } catch (error) {
        return res.status(401).json({ message: 'Token de autenticação inválido', erro: error.message });
    }
}

export default rotasUsuarios;