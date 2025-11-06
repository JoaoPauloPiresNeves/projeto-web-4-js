const ErrorResponse = require("../utils/ErrorResponse");

module.exports = class LogarMiddleware {

    validateLoginBody = (request, response, next) => {
        console.log("🔷 LogarMiddleware.validateLoginBody()");
        const body = request.body;

        if (!body.logar) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'logar' é obrigatório!" });
        }

        const logar = body.logar;

        if (!logar.emailLogar || logar.emailLogar.trim() === "") {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'emailLogar' é obrigatório!" });
        }

        if (!logar.senhaLogar || logar.senhaLogar.trim() === "") {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'senhaLogar' é obrigatório!" });
        }

        // Valida formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(logar.emailLogar)) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'emailLogar' não é um e-mail válido" });
        }

        // Valida tamanho mínimo da senha
        if (logar.senhaLogar.length < 6) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "A senha deve ter pelo menos 6 caracteres" });
        }

        next();
    }

    validateCreateBody = (request, response, next) => {
        console.log("🔷 LogarMiddleware.validateCreateBody()");
        const body = request.body;

        if (!body.logar) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'logar' é obrigatório!" });
        }

        const logar = body.logar;

        const camposObrigatorios = ["emailLogar", "senhaLogar"];
        for (const campo of camposObrigatorios) {
            if (!logar[campo] || logar[campo].toString().trim() === "") {
                throw new ErrorResponse(400, "Erro na validação de dados", { message: `O campo '${campo}' é obrigatório!` });
            }
        }

        // Valida formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(logar.emailLogar)) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'emailLogar' não é um e-mail válido" });
        }

        // Valida tamanho mínimo da senha
        if (logar.senhaLogar.length < 6) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "A senha deve ter pelo menos 6 caracteres" });
        }

        next();
    }

    validateIdParam = (request, response, next) => {
        console.log("🔷 LogarMiddleware.validateIdParam()");
        const { idLogar } = request.params;

        if (!idLogar) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O parâmetro 'idLogar' é obrigatório!" });
        }

        next();
    }
}