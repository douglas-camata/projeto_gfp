import { BD } from "../db.js";

class rotasSubCategorias {
	static async novaSubCategoria(req, res) {
		const { nome, id_categoria } = req.body;
		// Validando dados
		if (!nome || !id_categoria) {
			return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
		}

		try {
			const categoria = await BD.query(`
                INSERT INTO subcategorias (nome, id_categoria) 
                    VALUES ($1, $2) RETURNING *`,
				[nome, id_categoria]
			);

			res.status(201).json("Sub-Categoria Cadastrada");
		} catch (error) {
			console.error("Erro ao criar sub-categoria:", error);
			res.status(500).json({ message: "Erro ao criar sub-categoria", error: error.message });
		}
	}

	static async listarSubCategorias(req, res) {
		try {
			const subcategorias = await BD.query(`
                SELECT sct. *, ct.nome AS nome_categoria FROM subcategorias AS sct 
                    LEFT JOIN categorias ct ON sct.id_categoria = ct.id_categoria 
                ORDER BY sct.id_subcategoria `);
			res.status(200).json(subcategorias.rows);
		} catch (error) {
			console.error("Erro ao listar sub-categorias:", error);
			res.status(500).json({ message: "Erro ao listar sub-categorias", error: error.message });
		}
	}

	static async deletarSubCategoria(req, res) {
		const { id } = req.params;
		try {
			// Chama o metodo na classe usuario para deletar um usuario
			const subcategoria = await BD.query(
				`UPDATE subcategorias SET ativo = false WHERE id_subcategoria = $1 `,
				[id]
			);
			return res.status(200).json({ message: "Sub-Categoria desativada com sucesso!" });
		} catch (error) {
			console.error("Erro ao deletar sub-categoria:", error);
			res.status(500).json({ message: "Erro ao deletar sub-categoria", error: error.message });
		}
	}

	static async consultaPorId(req, res) {
		const { id } = req.params;

		try {
			const subcategoria = await BD.query(
				`SELECT sct. *, ct.nome AS nome_categoria FROM subcategorias AS sct 
                    LEFT JOIN categorias ct ON sct.id_categoria = ct.id_categoria WHERE  sct.id_subcategoria = $1
                ORDER BY sct.id_subcategoria `,
				[id]
			);
			return res.status(200).json(subcategoria.rows[0]);
		} catch (error) {
			console.error("Erro ao consultar sub-categoria:", error);
			res.status(500).json({ message: "Erro ao consultar sub-categoria", error: error.message });
		}
	}

	static async atualizarTodosCampos(req, res) {
		const { id } = req.params;
		const { nome, id_categoria } = req.body;
		try {
			const subcategoria = await BD.query(
				`UPDATE subcategorias SET nome = $1, id_categoria = $2 WHERE id_subcategoria = $3 RETURNING *`, // comando para atualizar o usuario
				[nome, id_categoria, id] // comando para atualizar o usuario
			)
			return res.status(200).json(subcategoria.rows[0]);
		} catch (error) {
			console.error("Erro ao atualizar sub-categoria:", error);
			res.status(500).json({ message: "Erro ao atualizar sub-categoria", error: error.message });
		}
	}

	static async atualizar(req, res) {
		const { id } = req.params;
		const { nome, id_categoria } = req.body;
		try {
			// Inicializar arrays(vetores) para armazenar os campos e valores que serão atualizados
			const campos = [];
			const valores = [];

			// Verificar quais campos foram fornecidos
			if (nome !== undefined) {
				campos.push(`nome = $${valores.length + 1}`);
				valores.push(nome);
			}
			if (id_categoria !== undefined) {
				campos.push(`tipo_transacao = $${valores.length + 1}`);
				valores.push(tipo_transacao);
			}

			if (campos.length === 0) {
				return res.status(400).json({ message: "Nenhum campo para atualizar foi fornecido." });
			}

			// adicionar o id ao final de valores

			// montamos a query dinamicamente
			const query = `UPDATE subcategorias SET ${campos.join(", ")}  
                          WHERE id_subcategoria = ${id} RETURNING *`;
			// Executando a query
			const subcategoria = await BD.query(query, valores);

			// Verifica se o uusario foi atualizado
			if (subcategoria.rows.length === 0) {
				return res.status(404).json({ message: "Sub-Categoria não encontrado" });
			}

			return res.status(200).json(subcategoria.rows[0]);
		} catch (error) {
			console.error("Erro ao atualizar sub-categoria:", error);
			res.status(500).json({ message: "Erro ao atualizar sub-categoria", error: error.message });
		}
	}
}


export default rotasSubCategorias;