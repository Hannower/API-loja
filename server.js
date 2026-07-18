// Importa o Express e FS
import express from "express";
import fs from "fs/promises";

const porta = 3000;
const app = express();
const nomeArquivo = "listaProdutos.json";

// Converte para JSON
app.use(express.json());


// ===== ROTAS ===== //

app.get("/", (request, response) => {
    response.send("<h2>Bem-vindo(a) à nossa Loja</h2>");
});

// Cadastra um novo produto
app.post("/produtos/registro", validarDados, cadastrarProduto);


// ===== CRIAR OS DEMAIS MÉTODOS DA API ===== //

// BUSCAR TODOS (GET)

app.get("/produtos",(request, response) => {
    buscarDados(response);
})
// BUSCAR PELO ID (GET: ID)
// EDITAR PELO ID (PUT: ID)
// EXCLUIR PELO ID (DELETE: ID)

async function buscarDados(response) {
    const dados = await fs.readFile(nomeArquivo, "utf-8") || [];
    const listaProdutos = dados.trim() ? JSON.parse(dados) : [];

    const nomeProduto = listaProdutos.map((produtos) => {
        return (`<p>${produtos.nome}</p>`);
    }).join(); 

    response.send(nomeProduto);
      
}

// ===== FUNCTIONS ===== //

function validarDados(request, response, next) {
    // Recebe os dados vindos do POST (formulário)
    const {
        nome, descricao, fotos,
        preco, categoria
    } = request.body || {};

    // Verifica se os campos foram preenchidos
    if (!nome || !descricao || !fotos || !preco || !categoria) {
        return response.status(400).json(
            {
                erro: "Preencha todos os campos"
            }
        );
    }

    // Chama a próxima function (cadastrarProduto)
    next();
}

async function cadastrarProduto(request, response) {
    try {
        // Desestruturação 
        const { nome, descricao, fotos, preco, categoria, disponivel = true } = request.body;
        
        // É o equivalente à:
        // const nome = request.body.nome;
        // const descricao = request.body.descricao;
        // const fotos = request.body.fotos;
        // const preco = request.body.preco;
        // const categoria = request.body.categoria;
        // const disponivel = request.body.disponivel || true; // valor default

        // Lê o arquivo atual
        const dados = await fs.readFile(nomeArquivo, "utf-8") || [];
        // const listaProdutos = JSON.parse(dados);
        const listaProdutos = dados.trim() ? JSON.parse(dados) : [];
        
        // Cria o novo produto
        const novoProduto = {
            id: Date.now(),  // Timestamp
            // nomeProduto: nome, // o mesmo que:
            nome,
            // descricao: descricao, // o mesmo que:
            descricao: descricao,
            // fotosProdutos: fotos; // o mesmo que:
            fotos,
            preco,
            categoria,
            disponivel,
            createdAt: Date()
        };

        // Adiciona o novo produto na lista
        listaProdutos.push(novoProduto);
        
        // Adiciona e grava de volta no arquivo
        await fs.writeFile(nomeArquivo, JSON.stringify(listaProdutos));
        // await fs.writeFile(nomeArquivo, JSON.stringify(listaProdutos, null, 2   ));

        // Response
        response.status(201).json({
            mensagem: "Produto cadastrado com sucesso!",
            data: novoProduto
        });

    } catch (erro) {
        console.error(erro);
        response.status(500).json({ erro: "Erro interno ao cadastrar produto" });
    }
}



// ===== RODA O SERVER ===== //

app.listen(porta, () => {
    console.log(`Servidor Express rodando em http://localhost:${porta}`);
});