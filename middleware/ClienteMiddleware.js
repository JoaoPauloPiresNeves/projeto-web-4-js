const ErrorResponse = require("../utils/ErrorResponse");

module.exports = class ClienteMiddleware {

    validateBody = (request, response, next) => {
        console.log("🔷 ClienteMiddleware.validateBody()");
        const body = request.body;

        if (!body.cliente) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'cliente' é obrigatório!" });
        }

        const cliente = body.cliente;

        if (!cliente.nomeCliente || cliente.nomeCliente.trim() === "") {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'nomeCliente' é obrigatório!" });
        }

        if (!cliente.emailCliente || cliente.emailCliente.trim() === "") {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'emailCliente' é obrigatório!" });
        }

        // Valida formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cliente.emailCliente)) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'emailCliente' não é um e-mail válido" });
        }

        next();
    }

    validateIdParam = (request, response, next) => {
        console.log("🔷 ClienteMiddleware.validateIdParam()");
        const { idCliente } = request.params;

        if (!idCliente) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O parâmetro 'idCliente' é obrigatório!" });
        }

        next();
    }
}