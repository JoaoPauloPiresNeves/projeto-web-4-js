const express = require("express");
const JwtMiddleware = require("../middleware/JwtMiddleware");
const LogarMiddleware = require("../middleware/LogarMiddleware");
const LogarControl = require("../control/LogarControl");

module.exports = class LogarRouter {
    #router;
    #logarMiddleware;
    #logarControl;
    #jwtMiddleware;

    /**
     * @param {JwtMiddleware} jwtMiddlewareDependency
     * @param {LogarMiddleware} logarMiddlewareDependency
     * @param {LogarControl} logarControlDependency
     */
    constructor(jwtMiddlewareDependency, logarMiddlewareDependency, logarControlDependency) {
        console.log("⬆️ LogarRouter.constructor()");
        this.#router = express.Router();
        this.#jwtMiddleware = jwtMiddlewareDependency;
        this.#logarMiddleware = logarMiddlewareDependency;
        this.#logarControl = logarControlDependency;
    }

    createRoutes = () => {
        console.log("⬆️ LogarRouter.createRoutes()");

        // POST /logar/login - Login de usuário (SEM JWT)
        this.#router.post("/login",
            this.#logarMiddleware.validateLoginBody,
            this.#logarControl.login
        );

        // POST /logar - Criar usuário (COM JWT)
        this.#router.post("/",
            this.#jwtMiddleware.validateToken,
            this.#logarMiddleware.validateCreateBody,
            this.#logarControl.store
        );

        // GET /logar - Listar todos usuários (COM JWT)
        this.#router.get("/",
            this.#jwtMiddleware.validateToken,
            this.#logarControl.index
        );

        // GET /logar/:idLogar - Buscar usuário por ID (COM JWT)
        this.#router.get("/:idLogar",
            this.#jwtMiddleware.validateToken,
            this.#logarMiddleware.validateIdParam,
            this.#logarControl.show
        );

        // PUT /logar/:idLogar - Atualizar usuário (COM JWT)
        this.#router.put("/:idLogar",
            this.#jwtMiddleware.validateToken,
            this.#logarMiddleware.validateIdParam,
            this.#logarMiddleware.validateCreateBody,
            this.#logarControl.update
        );

        // DELETE /logar/:idLogar - Deletar usuário (COM JWT)
        this.#router.delete("/:idLogar",
            this.#jwtMiddleware.validateToken,
            this.#logarMiddleware.validateIdParam,
            this.#logarControl.destroy
        );

        return this.#router;
    }
}