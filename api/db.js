import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;
dotenv.config()

// const BD = new Pool({
//     connectionString: "postgres://postgres.mqummcywcufspxnsnbfw:7BJO09KfLcBzT3sX@aws-1-us-east-1.pooler.supabase.com:5432/postgres",
//     ssl:{
//         rejectUnauthorized: false
//     }
// })

const BD = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'gfp',
    password: 'admin',
    port: 5432,
})

const testarConexao = async () =>{
    try{
        const client = await BD.connect();//tenta estabelecer a conexao com o banco de dados
        console.log("✔ Conexao com o banco de dados estabelecida");       
        client.release(); // libera o client
    }catch(error)
    {
        console.error("Erro ao conectar ao banco de dados", error.message)
    }
}


export { BD, testarConexao};