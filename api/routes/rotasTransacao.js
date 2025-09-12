import { BD } from "../db.js";

class rotasTransacao {
  static async novaTransacao(req, res) {
    const { valor, descricao, data_vencimento, data_pagamento, tipo, id_conta, id_categoria, id_subcategoria, id_usuario} = req.body;
    try {
      const transacao = await BD.query(`
                INSERT INTO transacoes (valor, descricao, data_vencimento, data_pagamento, tipo, id_conta, id_categoria, id_subcategoria, id_usuario)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [valor, descricao, data_vencimento, data_pagamento, tipo, id_conta, id_categoria, id_subcategoria, id_usuario]
      );

      res.status(201).json(transacao.rows[0]);
    } catch (error) {
      console.error("Erro ao criar transação:", error);
      res.status(500).json({ message: "Erro ao criar transação", error: error.message });
    }
  }

  static async listarTransacao(req, res) {
    try {
      const transacoes = await BD.query(`
            SELECT t. *, u.nome AS nome_usuario, lt.nome AS nome_localTransacao, ct.nome AS nome_categoria, sct.nome AS nome_subcategoria 
            	FROM transacoes AS t 
            	LEFT JOIN usuarios u ON t.id_usuario = u.id_usuario 
            	JOIN contas lt on t.id_conta = lt.id_conta
            	JOIN categorias ct on t.id_categoria = ct.id_categoria
            	JOIN subcategorias sct on t.id_subcategoria = sct.id_subcategoria
            ORDER BY t.valor DESC`);
      res.status(200).json(transacoes.rows);
    } catch (error) {
      console.error("Erro ao listar locais:", error);
      res.status(500).json({ message: "Erro ao listar locais", error: error.message });
    }
  }

  static async deletarTransacao(req, res) {
    const { id } = req.params;
    try {
      // Chama o metodo na classe usuario para deletar um usuario
      const transacao = await BD.query(
        `DELETE FROM transacoes WHERE id_transacao = $1 `,
        [id]
      );
      return res.status(200).json({ message: "Transação deletada com sucesso!" });
    } catch (error) {
      console.error("Erro ao deletar transação:", error);
      res.status(500).json({ message: "Erro ao deletar transação", error: error.message });
    }
  }

  static async consultaPorId(req, res) {
    const { id } = req.params;

    try {
      const transacao = await BD.query(
        `SELECT * FROM transacoes WHERE id_transacao = $1`,
        [id]
      );
      return res.status(200).json(transacao.rows[0]);
    } catch (error) {
      console.error("Erro ao consultar transação:", error);
      res.status(500).json({ message: "Erro ao consultar transação", error: error.message });
    }
  }

  static async atualizarTodosCampos(req, res) {
    const { id } = req.params;
    const { valor,
      descricao,
      data_transacao,
      data_vencimento,
      data_pagamento,
      tipo_transacao,
      id_local_transacao,
      id_categoria,
      id_subcategoria,
      id_usuario,
      num_parcelas,
      parcela_atual } = req.body;
    try {
      const transacao = await BD.query(
        `UPDATE transacoes SET valor = $1
                 descricao = $2,
                  data_transacao = $3,
                   data_vencimento = $4,
                    data_pagamento = $5,
                     tipo_transacao = $6,
                      id_local_transacao = $7,
                       id_categoria = $8,
                        id_subcategoria = $9,
                         id_usuario = $10,
                         num_parcelas = $11,
                          parcela_atual = $12   WHERE id_transacao = $13 RETURNING *`, // comando para atualizar o usuario
        [valor,
          descricao,
          data_transacao,
          data_vencimento,
          data_pagamento,
          tipo_transacao,
          id_local_transacao,
          id_categoria,
          id_subcategoria,
          id_usuario,
          num_parcelas,
          parcela_atual, id] // comando para atualizar o usuario
      )
      return res.status(200).json(transacao.rows[0]);
    } catch (error) {
      console.error("Erro ao atualizar transação:", error);
      res.status(500).json({ message: "Erro ao atualizar transação", error: error.message });
    }
  }

  static async atualizar(req, res) {
    const { id } = req.params;
    const { valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual } = req.body;
    try {
      // Inicializar arrays(vetores) para armazenar os campos e valores que serão atualizados
      const campos = [];
      const valores = [];

      // Verificar quais campos foram fornecidos
      if (valor !== undefined) {
        campos.push(`valor = $${valores.length + 1}`);
        valores.push(valor);
      }
      if (descricao !== undefined) {
        campos.push(`descricao = $${valores.length + 1}`);
        valores.push(descricao);
      }
      if (data_transacao !== undefined) {
        campos.push(`data_transacao = $${valores.length + 1}`);
        valores.push(data_transacao);
      }
      if (data_vencimento !== undefined) {
        campos.push(`data_vencimento = $${valores.length + 1}`);
        valores.push(data_vencimento);
      }
      if (data_pagamento !== undefined) {
        campos.push(`data_pagamento = $${valores.length + 1}`);
        valores.push(data_pagamento);
      }
      if (tipo_transacao !== undefined) {
        campos.push(`tipo_transacao = $${valores.length + 1}`);
        valores.push(tipo_transacao);
      }
      if (id_local_transacao !== undefined) {
        campos.push(`id_local_transacao = $${valores.length + 1}`);
        valores.push(id_local_transacao);
      }
      if (id_categoria !== undefined) {
        campos.push(`id_categoria = $${valores.length + 1}`);
        valores.push(id_categoria);
      }
      if (id_subcategoria !== undefined) {
        campos.push(`id_subcategoria = $${valores.length + 1}`);
        valores.push(id_subcategoria);
      }
      if (id_usuario !== undefined) {
        campos.push(`id_usuario = $${valores.length + 1}`);
        valores.push(id_usuario);
      }
      if (num_parcelas !== undefined) {
        campos.push(`num_parcelas = $${valores.length + 1}`);
        valores.push(num_parcelas);
      }
      if (parcela_atual !== undefined) {
        campos.push(`parcela_atual = $${valores.length + 1}`);
        valores.push(parcela_atual);
      }
      if (campos.length === 0) {
        return res.status(400).json({ message: "Nenhum campo para atualizar foi fornecido." });
      }

      // adicionar o id ao final de valores

      // montamos a query dinamicamente
      const query = `UPDATE transacoes SET ${campos.join(", ")}  
                          WHERE id_transacao = ${id} RETURNING *`;
      // Executando a query
      const transacao = await BD.query(query, valores);

      // Verifica se o uusario foi atualizado
      if (transacao.rows.length === 0) {
        return res.status(404).json({ message: "Transação não encontrado" });
      }

      return res.status(200).json(transacao.rows[0]);
    } catch (error) {
      console.error("Erro ao atualizar transação:", error);
      res.status(500).json({ message: "Erro ao atualizar transação", error: error.message });
    }
  }
}

export default rotasTransacao;