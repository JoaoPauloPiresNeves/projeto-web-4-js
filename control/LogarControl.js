const LogarService = require("../service/LogarService");

module.exports = class LogarControl {
    #logarService;

    /**
     * @param {LogarService} logarServiceDependency
     */
    constructor(logarServiceDependency) {
        console.log("⬆️ LogarControl.constructor()");
        this.#logarService = logarServiceDependency;
    }

    login = async (request, response, next) => {
        console.log("🔵 LogarControl.login()");
        try {
            const loginBodyRequest = request.body.logar;
            const resultado = await this.#logarService.loginUsuario(loginBodyRequest);

            response.status(200).json({
                success: true,
                message: "Login efetuado com sucesso!",
                data: resultado
            });
        } catch (error) {
            next(error);
        }
    }

    store = async (request, response, next) => {
        console.log("🔵 LogarControl.store()");
        try {
            const logarBodyRequest = request.body.logar;
            const novoId = await this.#logarService.createUsuario(logarBodyRequest);

            const objResposta = {
                success: true,
                message: "Usuário cadastrado com sucesso",
                data: {
                    logar: [{
                        idLogar: novoId,
                        emailLogar: logarBodyRequest.emailLogar
                    }]
                }
            };
            
            response.status(201).send(objResposta);
        } catch (error) {
            next(error);
        }
    }

    index = async (request, response, next) => {
        console.log("🔵 LogarControl.index()");
        try {
            const arrayUsuarios = await this.#logarService.findAllUsuarios();

            response.status(200).send({
                success: true,
                message: "Busca realizada com sucesso",
                data: {
                    logar: arrayUsuarios
                },
            });
        } catch (error) {
            next(error);
        }
    }

    show = async (request, response, next) => {
        console.log("🔵 LogarControl.show()");
        try {
            const usuarioId = request.params.idLogar;
            const usuario = await this.#logarService.findByIdUsuario(usuarioId);

            const objResposta = {
                success: true,
                message: "Executado com sucesso",
                data: {
                    logar: [usuario]
                }
            }

            response.status(200).send(objResposta);
        } catch (error) {
            next(error);
        }
    }

    update = async (request, response, next) => {
        console.log("🔵 LogarControl.update()");
        try {
            const logarBodyRequest = request.body.logar;
            logarBodyRequest.idLogar = request.params.idLogar;
            
            const atualizou = await this.#logarService.updateUsuario(logarBodyRequest);

            if (atualizou) {
                return response.status(200).send({
                    success: true,
                    message: 'Usuário atualizado com sucesso',
                    data: {
                        logar: [{
                            idLogar: logarBodyRequest.idLogar,
                            emailLogar: logarBodyRequest.emailLogar
                        }]
                    }
                })
            } else {
                return response.status(404).send({
                    success: false,
                    message: 'Usuário não encontrado para atualização',
                    data: {
                        logar: [{
                            idLogar: logarBodyRequest.idLogar
                        }]
                    }
                })
            }
        } catch (error) {
            next(error);
        }
    }

    destroy = async (request, response, next) => {
        console.log("🔵 LogarControl.destroy()");
        try {
            const usuarioId = request.params.idLogar;
            const excluiu = await this.#logarService.deleteUsuario(usuarioId);

            if (excluiu) {
                return response.status(204).send({
                    success: true,
                    message: 'Usuário excluído com sucesso',
                    data: {
                        logar: [{
                            idLogar: usuarioId
                        }]
                    }
                })
            } else {
                return response.status(404).send({
                    success: false,
                    message: 'Usuário não encontrado para exclusão',
                    data: {
                        logar: [{
                            idLogar: usuarioId,
                        }]
                    }
                })
            }
        } catch (error) {
            next(error);
        }
    }
}