import { BD } from "../db.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'chave_api_gfp';

class rotasUsuarios {
	static async login(req, res) {
		const { email, senha } = req.body;

		try {
			
			const resultado = await BD.query(
				`SELECT * FROM usuarios WHERE email = $1 and ativo = true`,
				[email]
			);

			if (resultado.rows.length === 0) {
				return res.status(401).json({ message: "Email ou senha inválidos" });
			}

			const usuario = resultado.rows[0];
			const senhaValida = await bcrypt.compare(senha, usuario.senha)

			if (!senhaValida) {
				return res.status(401).json({ message: "Email ou senha inválidos" });
			}

			// Gerar um novo token para o usuario
			const token = jwt.sign(
				//payload
				{ id: usuario.id, nome: usuario.nome, email: usuario.email },
				//signature
				SECRET_KEY,
				// { expiresIn: '1h' }
			)

			// console.log(token);
			

			return res.status(200).json({ token, id_usuario: usuario.id_usuario, nome: usuario.nome, email: usuario.email, tipo_acesso: usuario.tipo_acesso });
			// return res.status(200).json({message: "Login bem-sucedido", usuario});

		} catch (error) {
			console.error("Erro ao logar:", error);
			res.status(500).json({ message: "Erro ao logar", error: error.message });
		}
	}

	static async novoUsuario(req, res) {
		const { nome, email, senha, tipo_acesso } = req.body;

		const saltRounds = 10;
		const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

		// Validando dados
		if (!nome || !email || !senha) {
			return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
		}

		try {
			const usuario = await BD.query(`
                INSERT INTO usuarios (nome, email, senha, tipo_acesso) 
                    VALUES ($1, $2, $3, $4) RETURNING *`,
				[nome, email, senhaCriptografada, tipo_acesso]
			);

			res.status(201).json("Usuário Cadastrado");
		} catch (error) {
			console.error("Erro ao criar usuário:", error);
			res.status(500).json({ message: "Erro ao criar usuário", error: error.message });
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
	// Extrair do token o cabeçalho da requisição
	const token = req.headers['authorization']; // Bearer<token>

	// Verificar se o token foi fornecido na requisição
	if (!token) return res.status(403).json({ message: "Token não fornecido" })

	// Verificar a validade do token
	//jwt.verify que valida se o token é legitimo
	jwt.verify(token.split(" ")[1], SECRET_KEY, (err, usuario) => {
		if (err) return res.status(403).json({ message: "Token inválido" })

		// Se o token for válido, adiciona os dados do usuario(decodificados no token)
		// tornando essas informações disponíveis nas rotas que precisam da autenticação
		req.usuario = usuario;
		next();

	})
}

export default rotasUsuarios;