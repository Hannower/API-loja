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
app.get("/produtos/:id", buscarDadosId);

// EDITAR PELO ID (PUT: ID)
app.put("/produtos/editar/:id", editarDados)

// EXCLUIR PELO ID (DELETE: ID)

// ===== FUNCTIONS ===== //

async function editarDados(request, response) {
    const dados = await fs.readFile(nomeArquivo, "utf-8");
    const listaProdutos = dados && dados.trim() ? JSON.parse(dados) : [];

    const idBuscado = Number(request.params.id);

    const indice = listaProdutos.findIndex((p) => p.id === idBuscado);

    if (indice === -1) {
        return response.status(404).send("<p>Produto não encontrado.</p>");
    }

    const produtoAtualizado = { ...listaProdutos[indice], ...request.body };

    listaProdutos[indice] = produtoAtualizado;

    await fs.writeFile(nomeArquivo, JSON.stringify(listaProdutos));

    response.status(200).json({
        mensagem: "Produto atualizado com sucesso!",
        data: produtoAtualizado
    });
}

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

async function buscarDados(response) {
    const dados = await fs.readFile(nomeArquivo, "utf-8") || [];
    const listaProdutos = dados.trim() ? JSON.parse(dados) : [];

    const nomeProduto = listaProdutos.map((produto) => {
        return (
                    "<div class='produto'>" +
                            "<p>Id: " + produto.id + "</p>" +
                            "<p>Produto: " + produto.nome + "</p>" +
                            "<p>Descrição: " + produto.descricao + "</p>" +
                            "<p>Preço: R$ " + produto.preco.toFixed(2).replace(".", ",") + "</p>" +
                    "</div>"
                )
    }).join(); 

    response.send(nomeProduto);
      
}

async function buscarDadosId(request, response) {
    const dados = await fs.readFile(nomeArquivo, "utf-8");
    const listaProdutos = dados && dados.trim() ? JSON.parse(dados) : [];

    const idBuscado = Number(request.params.id);

    const produto = listaProdutos.find((p) => p.id === idBuscado);

    if (!produto) {
        return response.status(404).send("<p>Produto não encontrado.</p>");
    }

    const html = `
        <div class="produto">
            <p>Id: ${produto.id}</p>
            <p>Produto: ${produto.nome}</p>
            <p>Descrição: ${produto.descricao}</p>
            <p>Preço: R$ ${produto.preco.toFixed(2).replace(".", ",")}</p>
        </div>
    `;

    response.send(html);   
}



// ===== RODA O SERVER ===== //

app.listen(porta, () => {
    console.log(`Servidor Express rodando em http://localhost:${porta}`);
});