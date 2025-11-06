const express = require("express");
const JwtMiddleware = require("../middleware/JwtMiddleware");
const PedidoMiddleware = require("../middleware/PedidoMiddleware");
const PedidoControl = require("../control/PedidoControl");

module.exports = class PedidoRouter {
    #router;
    #pedidoMiddleware;
    #pedidoControl;
    #jwtMiddleware;

    /**
     * @param {JwtMiddleware} jwtMiddlewareDependency
     * @param {PedidoMiddleware} pedidoMiddlewareDependency
     * @param {PedidoControl} pedidoControlDependency
     */
    constructor(jwtMiddlewareDependency, pedidoMiddlewareDependency, pedidoControlDependency) {
        console.log("⬆️ PedidoRouter.constructor()");
        this.#router = express.Router();
        this.#jwtMiddleware = jwtMiddlewareDependency;
        this.#pedidoMiddleware = pedidoMiddlewareDependency;
        this.#pedidoControl = pedidoControlDependency;
    }

    createRoutes = () => {
        console.log("⬆️ PedidoRouter.createRoutes()");

        // POST /pedidos - Criar pedido
        this.#router.post("/",
            this.#jwtMiddleware.validateToken,
            this.#pedidoMiddleware.validateBody,
            this.#pedidoControl.store
        );

        // GET /pedidos - Listar todos pedidos
        this.#router.get("/",
            this.#jwtMiddleware.validateToken,
            this.#pedidoControl.index
        );

        // GET /pedidos/:idPedido - Buscar pedido por ID
        this.#router.get("/:idPedido",
            this.#jwtMiddleware.validateToken,
            this.#pedidoMiddleware.validateIdParam,
            this.#pedidoControl.show
        );

        // PUT /pedidos/:idPedido - Atualizar pedido
        this.#router.put("/:idPedido",
            this.#jwtMiddleware.validateToken,
            this.#pedidoMiddleware.validateIdParam,
            this.#pedidoMiddleware.validateBody,
            this.#pedidoControl.update
        );

        // DELETE /pedidos/:idPedido - Deletar pedido
        this.#router.delete("/:idPedido",
            this.#jwtMiddleware.validateToken,
            this.#pedidoMiddleware.validateIdParam,
            this.#pedidoControl.destroy
        );

        return this.#router;
    }
}