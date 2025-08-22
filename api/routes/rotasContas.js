import { BD } from "../db.js";

class rotasContas {
	static async novoConta(req, res) {
		const { nome, tipo_conta, saldo, conta_padrao } = req.body;
		
		try {
			const contas = await BD.query(`
                INSERT INTO contas (nome, tipo_conta, saldo, conta_padrao) 
                    VALUES ($1, $2, $3, $4) RETURNING *`,
				[nome, tipo_conta, saldo, conta_padrao]
			);

			res.status(201).json("Conta Cadastrada");
		} catch (error) {
			console.error("Erro ao criar conta:", error);
			res.status(500).json({ message: "Erro ao criar conta", error: error.message });
		}
	}

	static async listarContas(req, res) {
		try {
			const contas = await BD.query("SELECT * FROM contas where ativo = true order by nome");
			res.status(200).json(contas.rows);
		} catch (error) {
			console.error("Erro ao listar locais:", error);
			res.status(500).json({ message: "Erro ao listar locais", error: error.message });
		}
	}

	static async deletarContas(req, res) {
		const { id } = req.params;
		try {
			// Chama o metodo na classe usuario para deletar um usuario
			const contas = await BD.query(
				`UPDATE contas SET ativo = false WHERE id_conta = $1 `,
				[id]
			);
			return res.status(200).json({ message: "Conta desativada com sucesso!" });
		} catch (error) {
			console.error("Erro ao desativar conta:", error);
			res.status(500).json({ message: "Erro ao desativar conta", error: error.message });
		}
	}

	static async consultaPorId(req, res) {
		const { id } = req.params;

		try {
			const contas = await BD.query(
				`SELECT * FROM contas WHERE id_conta = $1`,
				[id]
			);
			return res.status(200).json(contas.rows[0]);
		} catch (error) {
			console.error("Erro ao consultar conta:", error);
			res.status(500).json({ message: "Erro ao consultar conta", error: error.message });
		}
	}

	static async atualizarTodosCampos(req, res) {
		const { id } = req.params;
		const { nome, tipo_conta, saldo, conta_padrao } = req.body;
		try {
			const contas = await BD.query(
				`UPDATE contas SET nome = $1, tipo_conta = $2, saldo = $3, conta_padrao = $4 WHERE id_conta = $5 RETURNING *`, // comando para atualizar o usuario
				[nome, tipo_conta, saldo, conta_padrao, id] // comando para atualizar o usuario
			)
			return res.status(200).json(contas.rows[0]);
		} catch (error) {
			console.error("Erro ao atualizar conta:", error);
			res.status(500).json({ message: "Erro ao atualizar conta", error: error.message });
		}
	}

	static async atualizar(req, res) {
		const { id } = req.params;
		const { nome, tipo_conta, saldo } = req.body;
		try {
			// Inicializar arrays(vetores) para armazenar os campos e valores que serão atualizados
			const campos = [];
			const valores = [];

			// Verificar quais campos foram fornecidos
			if (nome !== undefined) {
				campos.push(`nome = $${valores.length + 1}`);
				valores.push(nome);
			}
			if (tipo_conta !== undefined) {
				campos.push(`tipo_conta = $${valores.length + 1}`);
				valores.push(tipo_conta);
			}
			if (saldo !== undefined) {
				campos.push(`saldo = $${valores.length + 1}`);
				valores.push(saldo);
			}
			if (campos.length === 0) {
				return res.status(400).json({ message: "Nenhum campo para atualizar foi fornecido." });
			}

			// adicionar o id ao final de valores

			// montamos a query dinamicamente
			const query = `UPDATE contas SET ${campos.join(", ")}  
                          WHERE id_conta = ${id} RETURNING *`;
			// Executando a query
			const contas = await BD.query(query, valores);

			// Verifica se o uusario foi atualizado
			if (contas.rows.length === 0) {
				return res.status(404).json({ message: "Conta não encontrado" });
			}

			return res.status(200).json(contas.rows[0]);
		} catch (error) {
			console.error("Erro ao atualizar conta:", error);
			res.status(500).json({ message: "Erro ao atualizar conta", error: error.message });
		}
	}
}


export default rotasContas;