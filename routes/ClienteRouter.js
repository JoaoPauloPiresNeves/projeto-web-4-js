const express = require("express");
const JwtMiddleware = require("../middleware/JwtMiddleware");
const ClienteMiddleware = require("../middleware/ClienteMiddleware");
const ClienteControl = require("../control/ClienteControl");

module.exports = class ClienteRouter {
    #router;
    #clienteMiddleware;
    #clienteControl;
    #jwtMiddleware;

    /**
     * @param {JwtMiddleware} jwtMiddlewareDependency
     * @param {ClienteMiddleware} clienteMiddlewareDependency
     * @param {ClienteControl} clienteControlDependency
     */
    constructor(jwtMiddlewareDependency, clienteMiddlewareDependency, clienteControlDependency) {
        console.log("⬆️ ClienteRouter.constructor()");
        this.#router = express.Router();
        this.#jwtMiddleware = jwtMiddlewareDependency;
        this.#clienteMiddleware = clienteMiddlewareDependency;
        this.#clienteControl = clienteControlDependency;
    }

    createRoutes = () => {
        console.log("⬆️ ClienteRouter.createRoutes()");

        // POST /clientes - Criar cliente
        this.#router.post("/",
            this.#jwtMiddleware.validateToken,
            this.#clienteMiddleware.validateBody,
            this.#clienteControl.store
        );

        // GET /clientes - Listar todos clientes
        this.#router.get("/",
            this.#jwtMiddleware.validateToken,
            this.#clienteControl.index
        );

        // GET /clientes/:idCliente - Buscar cliente por ID
        this.#router.get("/:idCliente",
            this.#jwtMiddleware.validateToken,
            this.#clienteMiddleware.validateIdParam,
            this.#clienteControl.show
        );

        // PUT /clientes/:idCliente - Atualizar cliente
        this.#router.put("/:idCliente",
            this.#jwtMiddleware.validateToken,
            this.#clienteMiddleware.validateIdParam,
            this.#clienteMiddleware.validateBody,
            this.#clienteControl.update
        );

        // DELETE /clientes/:idCliente - Deletar cliente
        this.#router.delete("/:idCliente",
            this.#jwtMiddleware.validateToken,
            this.#clienteMiddleware.validateIdParam,
            this.#clienteControl.destroy
        );

        return this.#router;
    }
}