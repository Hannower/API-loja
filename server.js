// Importa o Express
import express from "express";

const app = express();
const porta = 3000;

// Converte para JSON
app.use(express.json());


// ===== ROTAS ===== //

app.get("/", (request, response) => {
    response.send("<h2>Bem-vindo(a) à nossa Loja</h2>");
});

// Chama o método inicial
app.post("/produtos/registro", validarDados, cadastrarProduto, (request, response) => {					
    const {
        id, nome, descricao,
        fotos, preco, categoria,
        disponivel, createdAt

    } = request.produtoCadastrado;

    // response.json({
    //     mensagem: "Login efetuado com sucesso!",
    //     data: { id, nome, email }
    // });
});


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

function cadastrarProduto() {}


// ===== RODA O SERVER ===== //

app.listen(porta, () => {
    console.log(`Servidor Express rodando em http://localhost:${porta}`);
});