import { BD } from "../db.js";

const SECRET_KEY = 'chave_api_gfp';

class rotasCategorias {
    static async novaCategoria(req, res) {
        const { nome, tipo_transacao, gasto_fixo, descricao, id_usuario, cor, icone } = req.body;
        // Validando dados
        if (!nome || !tipo_transacao || !id_usuario) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
        }

        try {
            const categoria = await BD.query(`
                    INSERT INTO categorias (nome, tipo_transacao, id_usuario, cor, icone, gasto_fixo, descricao) 
                        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [nome, tipo_transacao, id_usuario, cor, icone, gasto_fixo, descricao]
            );

            res.status(201).json("Categoria Cadastrada");
        } catch (error) {
            console.error("Erro ao criar categoria:", error);
            res.status(500).json({ message: "Erro ao criar categoria", error: error.message });
        }
    }

    static async listarCategorias(req, res) {
        try {
            const categoria = await BD.query(`
                    SELECT * FROM categorias WHERE ativo = true ORDER BY nome`);
            res.status(200).json(categoria.rows);
        } catch (error) {
            console.error("Erro ao listar categorias:", error);
            res.status(500).json({ message: "Erro ao listar categorias", error: error.message });
        }
    }
    static async deletarCategoria(req, res) {
        const { id } = req.params;
        try {
            // Chama o metodo na classe usuario para deletar um usuario
            const categoria = await BD.query(
                `UPDATE categorias SET ativo = false WHERE id_categoria = $1 `,
                [id]
            );
            return res.status(200).json({ message: "Categoria desativada com sucesso!" });
        } catch (error) {
            console.error("Erro ao deletar categoria:", error);
            res.status(500).json({ message: "Erro ao deletar categoria", error: error.message });
        }
    }

    static async consultaPorId(req, res) {
        const { id } = req.params;

        try {
            const categoria = await BD.query(
                `SELECT ct. *, u.nome AS nome_usuario FROM categorias AS ct 
                    LEFT JOIN usuarios u ON ct.id_usuario = u.id_usuario WHERE ct.id_categoria = $1
                ORDER BY ct.id_categoria`,
                [id]
            );
            return res.status(200).json(categoria.rows[0]);
        } catch (error) {
            console.error("Erro ao consultar categoria:", error);
            res.status(500).json({ message: "Erro ao consultar categoria", error: error.message });
        }
    }

    static async atualizarTodosCampos(req, res) {
        const { id } = req.params;
        const { nome, tipo_transacao, id_usuario, cor, icone, descricao, gasto_fixo } = req.body;
        try {
            const categoria = await BD.query(
                `UPDATE categorias SET nome = $1, tipo_transacao = $2, id_usuario = $3, icone = $4, cor = $5, descricao = $7, gasto_fixo = $8 WHERE id_categoria = $6 RETURNING *`, // comando para atualizar o usuario
                [nome, tipo_transacao, id_usuario, icone, cor, id, descricao, gasto_fixo] // comando para atualizar o usuario
            )
            return res.status(200).json(categoria.rows[0]);
        } catch (error) {
            console.error("Erro ao atualizar categoria:", error);
            res.status(500).json({ message: "Erro ao atualizar categoria", error: error.message });
        }
    }

    static async atualizar(req, res) {
        const { id } = req.params;
        const { nome, tipo_transacao, id_usuario } = req.body;
        try {
            // Inicializar arrays(vetores) para armazenar os campos e valores que serão atualizados
            const campos = [];
            const valores = [];

            // Verificar quais campos foram fornecidos
            if (nome !== undefined) {
                campos.push(`nome = $${valores.length + 1}`);
                valores.push(nome);
            }
            if (tipo_transacao !== undefined) {
                campos.push(`tipo_transacao = $${valores.length + 1}`);
                valores.push(tipo_transacao);
            }
            if (id_usuario !== undefined) {
                campos.push(`id_usuario = $${valores.length + 1}`);
                valores.push(id_usuario);
            }

            if (campos.length === 0) {
                return res.status(400).json({ message: "Nenhum campo para atualizar foi fornecido." });
            }

            // adicionar o id ao final de valores

            // montamos a query dinamicamente
            const query = `UPDATE categorias SET ${campos.join(", ")}  
                              WHERE id_categoria = ${id} RETURNING *`;
            // Executando a query
            const categoria = await BD.query(query, valores);

            // Verifica se o uusario foi atualizado
            if (categoria.rows.length === 0) {
                return res.status(404).json({ message: "Categoria não encontrado" });
            }

            return res.status(200).json(categoria.rows[0]);
        } catch (error) {
            console.error("Erro ao atualizar categoria:", error);
            res.status(500).json({ message: "Erro ao atualizar categoria", error: error.message });
        }
    }
    static async filtrarCategorias(req, res) {
        const { tipo_transacao } = req.query
        try {
            const query = `
                select * from categorias 
                where tipo_transacao = $1 and ativo = true 
                order by nome    
            `
            
            const resposta = await BD.query(query, [tipo_transacao]);
            res.status(200).json(resposta.rows);
        } catch (error) {
            console.error("Erro ao listar categorias:", error);
            res.status(500).json({ message: "Erro ao listar categorias", error: error.message });
        }
    }
}

export default rotasCategorias;