const ClienteService = require("../service/ClienteService");

module.exports = class ClienteControl {
    #clienteService;

    /**
     * @param {ClienteService} clienteServiceDependency
     */
    constructor(clienteServiceDependency) {
        console.log("⬆️ ClienteControl.constructor()");
        this.#clienteService = clienteServiceDependency;
    }

    store = async (request, response, next) => {
        console.log("🔵 ClienteControl.store()");
        try {
            const clienteBodyRequest = request.body.cliente;
            const novoId = await this.#clienteService.createCliente(clienteBodyRequest);

            const objResposta = {
                success: true,
                message: "Cliente cadastrado com sucesso",
                data: {
                    clientes: [{
                        idCliente: novoId,
                        nomeCliente: clienteBodyRequest.nomeCliente,
                        emailCliente: clienteBodyRequest.emailCliente
                    }]
                }
            };
            
            response.status(201).send(objResposta);
        } catch (error) {
            next(error);
        }
    }

    index = async (request, response, next) => {
        console.log("🔵 ClienteControl.index()");
        try {
            const arrayClientes = await this.#clienteService.findAll();

            response.status(200).send({
                success: true,
                message: "Busca realizada com sucesso",
                data: {
                    clientes: arrayClientes
                },
            });
        } catch (error) {
            next(error);
        }
    }

    show = async (request, response, next) => {
        console.log("🔵 ClienteControl.show()");
        try {
            const clienteId = request.params.idCliente;
            const cliente = await this.#clienteService.findById(clienteId);

            const objResposta = {
                success: true,
                message: "Executado com sucesso",
                data: {
                    clientes: [cliente]
                }
            }

            response.status(200).send(objResposta);
        } catch (error) {
            next(error);
        }
    }

    update = async (request, response, next) => {
        console.log("🔵 ClienteControl.update()");
        try {
            const clienteBodyRequest = request.body.cliente;
            clienteBodyRequest.idCliente = request.params.idCliente;
            
            const atualizou = await this.#clienteService.updateCliente(clienteBodyRequest);

            if (atualizou) {
                return response.status(200).send({
                    success: true,
                    message: 'Cliente atualizado com sucesso',
                    data: {
                        clientes: [{
                            idCliente: clienteBodyRequest.idCliente,
                            nomeCliente: clienteBodyRequest.nomeCliente,
                            emailCliente: clienteBodyRequest.emailCliente
                        }]
                    }
                })
            } else {
                return response.status(404).send({
                    success: false,
                    message: 'Cliente não encontrado para atualização',
                    data: {
                        clientes: [{
                            idCliente: clienteBodyRequest.idCliente
                        }]
                    }
                })
            }
        } catch (error) {
            next(error);
        }
    }

    destroy = async (request, response, next) => {
        console.log("🔵 ClienteControl.destroy()");
        try {
            const clienteId = request.params.idCliente;
            const pedidoDAO = request.app.get('pedidoDAO'); // Injetado via app
            const excluiu = await this.#clienteService.deleteCliente(clienteId, pedidoDAO);

            if (excluiu) {
                return response.status(204).send({
                    success: true,
                    message: 'Cliente excluído com sucesso',
                    data: {
                        clientes: [{
                            idCliente: clienteId
                        }]
                    }
                })
            } else {
                return response.status(404).send({
                    success: false,
                    message: 'Cliente não encontrado para exclusão',
                    data: {
                        clientes: [{
                            idCliente: clienteId,
                        }]
                    }
                })
            }
        } catch (error) {
            next(error);
        }
    }
}