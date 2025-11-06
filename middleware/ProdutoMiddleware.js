const ErrorResponse = require("../utils/ErrorResponse");

module.exports = class ProdutoMiddleware {

    validateBody = (request, response, next) => {
        console.log("🔷 ProdutoMiddleware.validateBody()");
        const body = request.body;

        if (!body.produto) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'produto' é obrigatório!" });
        }

        const produto = body.produto;

        if (!produto.nomeProduto || produto.nomeProduto.trim() === "") {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'nomeProduto' é obrigatório!" });
        }

        if (!produto.precoProduto || produto.precoProduto <= 0) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'precoProduto' é obrigatório e deve ser maior que zero!" });
        }

        next();
    }

    validateIdParam = (request, response, next) => {
        console.log("🔷 ProdutoMiddleware.validateIdParam()");
        const { idProduto } = request.params;

        if (!idProduto) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O parâmetro 'idProduto' é obrigatório!" });
        }

        next();
    }
}