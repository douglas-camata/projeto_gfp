--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias (
    id_categoria integer NOT NULL,
    nome character varying(100) NOT NULL,
    descricao text,
    tipo_transacao character varying(10) NOT NULL,
    id_usuario integer,
    cor character varying(10),
    icone character varying(30),
    gasto_fixo boolean DEFAULT false,
    ativo boolean DEFAULT true,
    CONSTRAINT categorias_tipo_check CHECK (((tipo_transacao)::text = ANY ((ARRAY['ENTRADA'::character varying, 'SAIDA'::character varying])::text[])))
);


ALTER TABLE public.categorias OWNER TO postgres;

--
-- Name: categorias_id_categoria_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categorias_id_categoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categorias_id_categoria_seq OWNER TO postgres;

--
-- Name: categorias_id_categoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categorias_id_categoria_seq OWNED BY public.categorias.id_categoria;


--
-- Name: contas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contas (
    id integer NOT NULL,
    nome character varying(50) NOT NULL,
    tipo_conta character varying(20) NOT NULL,
    saldo numeric(15,2) DEFAULT 0,
    conta_padrao boolean DEFAULT false,
    ativo boolean DEFAULT true,
    CONSTRAINT local_transacao_tipo_check CHECK (((tipo_conta)::text = ANY ((ARRAY['CONTA_CORRENTE'::character varying, 'POUPANCA'::character varying, 'CARTÃO_CREDITO'::character varying, 'CARTÃO_DEBITO'::character varying, 'DINHEIRO'::character varying, 'INVESTIMENTO'::character varying])::text[])))
);


ALTER TABLE public.contas OWNER TO postgres;

--
-- Name: local_transacao_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.local_transacao_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.local_transacao_id_seq OWNER TO postgres;

--
-- Name: local_transacao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.local_transacao_id_seq OWNED BY public.contas.id;


--
-- Name: subcategorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subcategorias (
    id_subcategorias integer NOT NULL,
    nome character varying(50) NOT NULL,
    id_categoria integer,
    id_usuario integer
);


ALTER TABLE public.subcategorias OWNER TO postgres;

--
-- Name: subcategorias_id_subcategorias_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subcategorias_id_subcategorias_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subcategorias_id_subcategorias_seq OWNER TO postgres;

--
-- Name: subcategorias_id_subcategorias_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subcategorias_id_subcategorias_seq OWNED BY public.subcategorias.id_subcategorias;


--
-- Name: transacoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transacoes (
    id_transacoes integer NOT NULL,
    valor numeric(15,2) NOT NULL,
    descricao text,
    data_transacao date NOT NULL,
    data_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tipo character varying(10) NOT NULL,
    id_local integer,
    id_categoria integer,
    id_subcategoria integer,
    id_usuario integer,
    recorrente boolean DEFAULT false,
    parcelado boolean DEFAULT false,
    num_parcelas integer DEFAULT 1,
    parcela_atual integer DEFAULT 1,
    CONSTRAINT transacoes_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['ENTRADA'::character varying, 'SAIDA'::character varying])::text[])))
);


ALTER TABLE public.transacoes OWNER TO postgres;

--
-- Name: transacoes_id_transacoes_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transacoes_id_transacoes_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transacoes_id_transacoes_seq OWNER TO postgres;

--
-- Name: transacoes_id_transacoes_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transacoes_id_transacoes_seq OWNED BY public.transacoes.id_transacoes;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id_usuario integer NOT NULL,
    nome character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    senha character varying(255) NOT NULL,
    tipo_acesso character varying(255) NOT NULL,
    ativo boolean DEFAULT true
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_usuario_seq OWNER TO postgres;

--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_usuario_seq OWNED BY public.usuarios.id_usuario;


--
-- Name: categorias id_categoria; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias ALTER COLUMN id_categoria SET DEFAULT nextval('public.categorias_id_categoria_seq'::regclass);


--
-- Name: contas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contas ALTER COLUMN id SET DEFAULT nextval('public.local_transacao_id_seq'::regclass);


--
-- Name: subcategorias id_subcategorias; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcategorias ALTER COLUMN id_subcategorias SET DEFAULT nextval('public.subcategorias_id_subcategorias_seq'::regclass);


--
-- Name: transacoes id_transacoes; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transacoes ALTER COLUMN id_transacoes SET DEFAULT nextval('public.transacoes_id_transacoes_seq'::regclass);


--
-- Name: usuarios id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuarios_id_usuario_seq'::regclass);


--
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categorias (id_categoria, nome, descricao, tipo_transacao, id_usuario, cor, icone, gasto_fixo, ativo) FROM stdin;
1	Combustível	\N	SAIDA	1	#33A1FF	directions-car	f	t
\.


--
-- Data for Name: contas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contas (id, nome, tipo_conta, saldo, conta_padrao, ativo) FROM stdin;
2	Carteira	DINHEIRO	0.00	f	t
\.


--
-- Data for Name: subcategorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subcategorias (id_subcategorias, nome, id_categoria, id_usuario) FROM stdin;
\.


--
-- Data for Name: transacoes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transacoes (id_transacoes, valor, descricao, data_transacao, data_registro, tipo, id_local, id_categoria, id_subcategoria, id_usuario, recorrente, parcelado, num_parcelas, parcela_atual) FROM stdin;
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id_usuario, nome, email, senha, tipo_acesso, ativo) FROM stdin;
1	SESI	sesi@sesi.br	$2b$10$9oG6YjAw73Mnzn.cmV2D1el9w1mKsQikXTAWA2NxDq7.KukAKhXsy	adm	t
\.


--
-- Name: categorias_id_categoria_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorias_id_categoria_seq', 1, true);


--
-- Name: local_transacao_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.local_transacao_id_seq', 2, true);


--
-- Name: subcategorias_id_subcategorias_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subcategorias_id_subcategorias_seq', 1, false);


--
-- Name: transacoes_id_transacoes_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transacoes_id_transacoes_seq', 1, false);


--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_usuario_seq', 1, true);


--
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id_categoria);


--
-- Name: contas local_transacao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contas
    ADD CONSTRAINT local_transacao_pkey PRIMARY KEY (id);


--
-- Name: subcategorias subcategorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcategorias
    ADD CONSTRAINT subcategorias_pkey PRIMARY KEY (id_subcategorias);


--
-- Name: transacoes transacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transacoes
    ADD CONSTRAINT transacoes_pkey PRIMARY KEY (id_transacoes);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);


--
-- Name: categorias categorias_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_usuario_id_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- Name: subcategorias subcategorias_id_categoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcategorias
    ADD CONSTRAINT subcategorias_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.categorias(id_categoria);


--
-- Name: subcategorias subcategorias_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcategorias
    ADD CONSTRAINT subcategorias_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- Name: transacoes transacoes_id_categoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transacoes
    ADD CONSTRAINT transacoes_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.categorias(id_categoria) ON DELETE SET NULL;


--
-- Name: transacoes transacoes_id_local_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transacoes
    ADD CONSTRAINT transacoes_id_local_fkey FOREIGN KEY (id_local) REFERENCES public.contas(id) ON DELETE SET NULL;


--
-- Name: transacoes transacoes_id_subcategoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transacoes
    ADD CONSTRAINT transacoes_id_subcategoria_fkey FOREIGN KEY (id_subcategoria) REFERENCES public.subcategorias(id_subcategorias) ON DELETE SET NULL;


--
-- Name: transacoes transacoes_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transacoes
    ADD CONSTRAINT transacoes_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

