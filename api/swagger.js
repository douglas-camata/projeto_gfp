import { response } from "express";
import SwaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.4",
  info: {
    title: "API do Gestor Financeiro Pessoal",
    version: "1.0.0",
    description: `API para gerenciamento financeiro pessoal desenvolvida no curso Técnico de Desenvolvimento de Sistemas do SENAI`,
  },
  servers: [
    {
      url: "http://localhost:3000/",
      description: "Servidor Local",
    },
    {
      url: "http://192.168.0.237:3000",
      description: "Servidor de API do Douglas",
    },
  ],
  tags: [
    {
      name: "Usuarios",
      description:
        "Rotas para cadastro, login, atualização e desativação de usuários",
    },
    {
      name: "Categorias",
      description:
        "Rotas para cadastro, leitura, atualização e desativação de categorias",
    },
    {
      name: "Subcategorias",
      description:
        "Rotas para cadastro, leitura, atualização e desativação de subcategorias",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    "/usuarios": {
      post: {
        tags: ["Usuarios"],
        summary: "Cadastrar novo usuário",
        description: "Método utilizado para cadastrar novos usuários",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["nome", "email", "senha", "tipo_acesso"],
                properties: {
                  nome: { type: "string", example: "João Silva" },
                  email: { type: "string", example: "joao@example.com" },
                  senha: { type: "string", example: "123" },
                  tipo_acesso: { type: "string", example: "adm" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Usuário cadastrado com sucesso",
          },
          400: {
            description: "Erro ao cadastrar usuário",
          },
          500: {
            description: "Erro interno do servidor",
          },
        },
      },
      get: {
        tags: ["Usuarios"],
        summary: "Listar todos os usuários",
        description:
          "Método utilizado para listar todos os usuários cadastrados",
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Lista de usuários",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id_usuario: { type: "integer", example: 1 },
                      nome: { type: "string", example: "João Silva" },
                      email: { type: "string", example: "joao@example.com" },
                      senha: { type: "string", example: "123" },
                      tipo_acesso: { type: "string", example: "adm" },
                      ativo: { type: "boolean", example: true },
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Erro interno do servidor",
          },
        },
      },
    },
    "/usuarios/{id_usuario}": {
      delete: {
        tags: ["Usuarios"],
        summary: "Desativar usuário",
        description: "Método utilizado para desativar um usuário",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id_usuario",
            in: "path",
            required: true,
            description: "ID do usuário a ser deletado",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "Usuário deletado com sucesso",
          },
          400: {
            description: "Erro ao deletar usuário",
          },
          500: {
            description: "Erro interno do servidor",
          },
        },
      },
      put: {
        tags: ["Usuarios"],
        summary: "Atualizar usuário",
        description: "Método utilizado para atualizar os dados de um usuário",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id_usuario",
            in: "path",
            required: true,
            description: "ID do usuário a ser atualizado",
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nome: { type: "string", example: "João Silva" },
                  email: { type: "string", example: "joao@senai.br" },
                  senha: { type: "string", example: "123" },
                  tipo_acesso: { type: "string", example: "adm" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Usuário atualizado com sucesso",
          },
          400: {
            description: "Erro ao atualizar usuário",
          },
          500: {
            description: "Erro interno do servidor",
          },
        },
      },
      get: {
        tags: ["Usuarios"],
        summary: "Listar usuário por ID",
        description: "Método utilizado para listar um usuário pelo ID",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id_usuario",
            in: "path",
            required: true,
            description: "ID do usuário a ser listado",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "Usuário encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id_usuario: { type: "integer", example: 1 },
                    nome: { type: "string", example: "João Silva" },
                    email: { type: "string", example: "joao@senai.com" },
                    senha: { type: "string", example: "123" },
                  },
                },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Usuarios"],
        summary: "Atualizar usuário",
        description: "Método utilizado para atualizar os dados de um usuário",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id_usuario",
            in: "path",
            required: true,
            description: "ID do usuário a ser atualizado",
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nome: { type: "string", example: "João Silva" },
                  email: { type: "string", example: "joao@senai.br" },
                  senha: { type: "string", example: "123" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Usuário atualizado com sucesso",
          },
          400: {
            description: "Erro ao atualizar usuário",
          },
          500: {
            description: "Erro interno do servidor",
          },
        },
      },
    },
    "/usuarios/login": {
      post: {
        tags: ["Usuarios"],
        summary: "Login do usuário",
        description:
          "Método utilizado para efetuar o login do usuário e gerar o token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "senha"],
                properties: {
                  email: { type: "string", example: "sesi@sesi.br" },
                  senha: { type: "string", example: "123" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Usuário encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      token: {
                        type: "string",
                        example:
                          "jkdnaskjdbaskjndlaksnmmlmcaj21lekn1lkn213n12jb3kj 21",
                      },
                      id_usuario: { type: "integer", example: 1 },
                      nome: { type: "string", example: "João Silva" },
                      email: { type: "string", example: "joao@example.com" },
                      senha: { type: "string", example: "123" },
                      tipo_acesso: { type: "string", example: "adm" },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Erro ao encontrar usuário",
          },
          500: {
            description: "Erro interno do servidor",
          },
        },
      },
    },
    "/categorias": {
      post: {
        tags: ["Categorias"],
        summary: "Nova Categoria",
        description: "Rota para cadastrar nova categoria",
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "nome",
                  "tipo_transacao",
                  "gasto_fixo",
                  "id_usuario",
                  "cor",
                  "icone",
                ],
                properties: {
                  nome: { type: "string", example: "Alimentação" },
                  tipo_transacao: {
                    type: "string",
                    example: "ENTRADA OU SAIDA",
                  },
                  gasto_fixo: { type: "boolean", example: true },
                  id_usuario: { type: "integer", example: 1 },
                  cor: { type: "string", example: "#FF5733" },
                  icone: { type: "string", example: "plus" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Categoria cadastrada com sucesso",
          },
          400: {
            description: "Erro ao cadastrar categoria",
          },
          500: {
            description: "Erro interno do servidor",
          },
        },
      },
      get: {
        tags: ["Categorias"],
        summary: "Listar todas as categorias",
        description: "Rota para listar todas as categorias cadastradas",
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Lista de categorias",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id_categoria: { type: "integer", example: 1 },
                      nome: { type: "string", example: "Alimentação" },
                      tipo_transacao: {
                        type: "string",
                        example: "ENTRADA OU SAIDA",
                      },
                      gasto_fixo: { type: "boolean", example: true },
                      id_usuario: { type: "integer", example: 1 },
                      cor: { type: "string", example: "#FF5733" },
                      icone: { type: "string", example: "plus" },
                    },
                  },
                },
              },
            },
          },
          200: {
            description: "Categoria listada com sucesso",
          },
          400: {
            description: "Erro ao listar categorias",
          },
          500: {
            description: "Erro interno do servidor",
          },
        },
      },
    },
    "/categorias/{id_categoria}": {
      put: {
        tags: ["Categorias"],
        summary: "Atualizar categoria",
        description: "Rota para atualizar uma categoria",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id_categoria",
            in: "path",
            required: true,
            description: "ID da categoria a ser atualizada",
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nome: { type: "string", example: "Alimentação" },
                  tipo_transacao: {
                    type: "string",
                    example: "ENTRADA OU SAIDA",
                  },
                  gasto_fixo: { type: "boolean", example: true },
                  id_usuario: { type: "integer", example: 1 },
                  cor: { type: "string", example: "#FF5733" },
                  icone: { type: "string", example: "plus" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Categoria atualizada com sucesso",
          },
          400: {
            description: "Erro ao atualizar categoria",
          },
          500: {
            description: "Erro interno do servidor",
          },
        },
      },
      patch: {
        tags: ["Categorias"],
        summary: "Atualizar categoria",
        description: "Rota para atualizar uma categoria",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id_categoria",
            in: "path",
            required: true,
            description: "ID da categoria a ser atualizada",
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nome: { type: "string", example: "Alimentação" },
                  tipo_transacao: {
                    type: "string",
                    example: "ENTRADA OU SAIDA",
                  },
                  gasto_fixo: { type: "boolean", example: true },
                  id_usuario: { type: "integer", example: 1 },
                  cor: { type: "string", example: "#FF5733" },
                  icone: { type: "string", example: "plus" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Categoria atualizada com sucesso",
          },
          400: {
            description: "Erro ao atualizar categoria",
          },
          500: {
            description: "Erro interno do servidor",
          },
        },
      },
      delete: {
        tags: ["Categorias"],
        summary: "Deletar categoria",
        description: "Rota para deletar uma categoria",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id_categoria",
            in: "path",
            required: true,
            description: "ID da categoria a ser deletada",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "Categoria deletada com sucesso",
          },
          400: {
            description: "Erro ao deletar categoria",
          },
          500: {
            description: "Erro interno do servidor",
          },
        },
      },
      get: {
        tags: ["Categorias"],
        summary: "Listar categoria por ID",
        description: "Rota para listar uma categoria pelo ID",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id_categoria",
            in: "path",
            required: true,
            description: "ID da categoria a ser listada",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "Categoria encontrada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id_categoria: { type: "integer", example: 1 },
                    nome: { type: "string", example: "Alimentação" },
                    tipo_transacao: {
                      type: "string",
                      example: "ENTRADA OU SAIDA",
                    },
                    gasto_fixo: { type: "boolean", example: true },
                    id_usuario: { type: "integer", example: 1 },
                    cor: { type: "string", example: "#FF5733" },
                    icone: { type: "string", example: "plus" },
                  },
                },
              },
            },
          },
          400: {
            description: "Erro ao listar categoria",
          },
          500: {
            description: "Erro interno do servidor",
          },
        },
      },
      get: {
        tags: ["Categorias"],
        summary: "Filtrar categoria",
        description: "Rota para filtrar categorias",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id_usuario",
            in: "query",
            required: true,
            description: "ID do usuário para filtrar as categorias",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "Categorias filtradas com sucesso",
          },
          400: {
            description: "Erro ao filtrar categorias",
          },
          500: {
            description: "Erro interno do servidor",
          },
        },
      },
    },
    "/subcategorias": {
      post: {
        tags: ["Subcategorias"],
        summary: "Nova Subcategoria",
        description: "Rota para cadastrar nova subcategoria",
        security: [
          {
            bearerAuth: [],
          },
        ],
        
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "nome",
                  "id_categoria",
                  "gasto_fixo",
                  "cor",
                  "icone",
                ],
                properties: {
                  nome: { type: "string", example: "Alimentação" },
                  id_categoria: { type: "integer", example: 1 },
                  gasto_fixo: { type: "boolean", example: true },
                  cor: { type: "string", example: "#FF5733" },
                  icone: { type: "string", example: "plus" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Subcategoria cadastrada com sucesso",
          },
          400: {
            description: "Erro ao cadastrar subcategoria",
          },
          500: {
            description: "Erro interno do servidor",
          },
        },
      },
      get: {
        tags: ["Subcategorias"],
        summary: "Listar Subcategorias",
        description: "Rota para listar todas as subcategorias",
        security: [
          {
            bearerAuth: [],
          },
        ],

        responses: {
          200: {
            description: "Lista de categorias",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id_categoria: { type: "integer", example: 1 },
                      nome: { type: "string", example: "Alimentação" },
                      tipo_transacao: {
                        type: "string",
                        example: "ENTRADA OU SAIDA",
                      },
                      gasto_fixo: { type: "boolean", example: true },
                      id_usuario: { type: "integer", example: 1 },
                      cor: { type: "string", example: "#FF5733" },
                      icone: { type: "string", example: "plus" },
                    },
                  },
                },
              },
            },
          },
          200: {
            description: "Categoria listada com sucesso",
          },
          400: {
            description: "Erro ao listar subcategorias",
          },
          500: {
            description: "Erro interno do servidor",
          },
        },
      }
    },
    '/subcategorias/{id_subcategoria}': {
        put: {
            tags: ['Subcategorias'],
            summary: 'Atualizar subcategoria',
            description: 'Rota para atualizar uma subcategoria',
            security: [
                {
                    bearerAuth: []
                }
            ],
            parameters: [
                {
                    name: 'id_subcategoria',
                    in: 'path',
                    required: true,
                    description: 'ID da subcategoria a ser atualizada',
                    schema: {
                        type: 'integer'
                    }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                nome: { type: 'string', example: 'Alimentação' },
                                id_categoria: { type: 'integer', example: 1 },
                                gasto_fixo: { type: 'boolean', example: true },
                                cor: { type: 'string', example: '#FF5733' },
                                icone: { type: 'string', example: 'plus' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Subcategoria atualizada com sucesso'
                },
                400: {
                    description: 'Erro ao atualizar subcategoria'
                },
                500: {
                    description: 'Erro interno do servidor'
                }
            }
        },
        patch: {
            tags: ['Subcategorias'],
            summary: 'Atualizar subcategoria',
            description: 'Rota para atualizar uma subcategoria',
            security: [
                {
                    bearerAuth: []
                }
            ],
            parameters: [
                {
                    name: 'id_subcategoria',
                    in: 'path',
                    required: true,
                    description: 'ID da subcategoria a ser atualizada',
                    schema: {
                        type: 'integer'
                    }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                nome: { type: 'string', example: 'Alimentação' },
                                id_categoria: { type: 'integer', example: 1 },
                                gasto_fixo: { type: 'boolean', example: true },
                                cor: { type: 'string', example: '#FF5733' },
                                icone: { type: 'string', example: 'plus' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Subcategoria atualizada com sucesso'
                },
                400: {
                    description: 'Erro ao atualizar subcategoria'
                },
                500: {
                    description: 'Erro interno do servidor'
                }
            }
        }
    }
  },
};

const options = {
  swaggerDefinition,
  apis: [],
};

const swaggerSpec = SwaggerJSDoc(options);
export default swaggerSpec;