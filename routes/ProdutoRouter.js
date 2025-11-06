const express = require("express");
const JwtMiddleware = require("../middleware/JwtMiddleware");
const ProdutoMiddleware = require("../middleware/ProdutoMiddleware");
const ProdutoControl = require("../control/ProdutoControl");

module.exports = class ProdutoRouter {
    #router;
    #produtoMiddleware;
    #produtoControl;
    #jwtMiddleware;

    /**
     * @param {JwtMiddleware} jwtMiddlewareDependency
     * @param {ProdutoMiddleware} produtoMiddlewareDependency
     * @param {ProdutoControl} produtoControlDependency
     */
    constructor(jwtMiddlewareDependency, produtoMiddlewareDependency, produtoControlDependency) {
        console.log("⬆️ ProdutoRouter.constructor()");
        this.#router = express.Router();
        this.#jwtMiddleware = jwtMiddlewareDependency;
        this.#produtoMiddleware = produtoMiddlewareDependency;
        this.#produtoControl = produtoControlDependency;
    }

    createRoutes = () => {
        console.log("⬆️ ProdutoRouter.createRoutes()");

        // POST /produtos - Criar produto
        this.#router.post("/",
            this.#jwtMiddleware.validateToken,
            this.#produtoMiddleware.validateBody,
            this.#produtoControl.store
        );

        // GET /produtos - Listar todos produtos
        this.#router.get("/",
            this.#jwtMiddleware.validateToken,
            this.#produtoControl.index
        );

        // GET /produtos/:idProduto - Buscar produto por ID
        this.#router.get("/:idProduto",
            this.#jwtMiddleware.validateToken,
            this.#produtoMiddleware.validateIdParam,
            this.#produtoControl.show
        );

        // PUT /produtos/:idProduto - Atualizar produto
        this.#router.put("/:idProduto",
            this.#jwtMiddleware.validateToken,
            this.#produtoMiddleware.validateIdParam,
            this.#produtoMiddleware.validateBody,
            this.#produtoControl.update
        );

        // DELETE /produtos/:idProduto - Deletar produto
        this.#router.delete("/:idProduto",
            this.#jwtMiddleware.validateToken,
            this.#produtoMiddleware.validateIdParam,
            this.#produtoControl.destroy
        );

        return this.#router;
    }
}