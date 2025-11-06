const ErrorResponse = require("../utils/ErrorResponse");

module.exports = class PedidoMiddleware {

    validateBody = (request, response, next) => {
        console.log("🔷 PedidoMiddleware.validateBody()");
        const body = request.body;

        if (!body.pedido) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'pedido' é obrigatório!" });
        }

        const pedido = body.pedido;

        if (!pedido.dataPedido || pedido.dataPedido.trim() === "") {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'dataPedido' é obrigatório!" });
        }

        if (!pedido.clienteIdCliente || pedido.clienteIdCliente <= 0) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'clienteIdCliente' é obrigatório e deve ser maior que zero!" });
        }

        if (!pedido.produtoIdProduto || pedido.produtoIdProduto <= 0) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'produtoIdProduto' é obrigatório e deve ser maior que zero!" });
        }

        // Valida formato da data (YYYY-MM-DD)
        const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dataRegex.test(pedido.dataPedido)) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'dataPedido' deve estar no formato YYYY-MM-DD" });
        }

        next();
    }

    validateIdParam = (request, response, next) => {
        console.log("🔷 PedidoMiddleware.validateIdParam()");
        const { idPedido } = request.params;

        if (!idPedido) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O parâmetro 'idPedido' é obrigatório!" });
        }

        next();
    }
}