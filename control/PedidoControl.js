const PedidoService = require("../service/PedidoService");

module.exports = class PedidoControl {
    #pedidoService;

    /**
     * @param {PedidoService} pedidoServiceDependency
     */
    constructor(pedidoServiceDependency) {
        console.log("⬆️ PedidoControl.constructor()");
        this.#pedidoService = pedidoServiceDependency;
    }

    store = async (request, response, next) => {
        console.log("🔵 PedidoControl.store()");
        try {
            const pedidoBodyRequest = request.body.pedido;
            const clienteDAO = request.app.get('clienteDAO');
            const produtoDAO = request.app.get('produtoDAO');
            
            const novoId = await this.#pedidoService.createPedido(pedidoBodyRequest, clienteDAO, produtoDAO);

            const objResposta = {
                success: true,
                message: "Pedido cadastrado com sucesso",
                data: {
                    pedidos: [{
                        idPedido: novoId,
                        dataPedido: pedidoBodyRequest.dataPedido,
                        clienteIdCliente: pedidoBodyRequest.clienteIdCliente,
                        produtoIdProduto: pedidoBodyRequest.produtoIdProduto
                    }]
                }
            };
            
            response.status(201).send(objResposta);
        } catch (error) {
            next(error);
        }
    }

    index = async (request, response, next) => {
        console.log("🔵 PedidoControl.index()");
        try {
            const arrayPedidos = await this.#pedidoService.findAllPedidos();

            response.status(200).send({
                success: true,
                message: "Busca realizada com sucesso",
                data: {
                    pedidos: arrayPedidos
                },
            });
        } catch (error) {
            next(error);
        }
    }

    show = async (request, response, next) => {
        console.log("🔵 PedidoControl.show()");
        try {
            const pedidoId = request.params.idPedido;
            const pedido = await this.#pedidoService.findByIdPedido(pedidoId);

            const objResposta = {
                success: true,
                message: "Executado com sucesso",
                data: {
                    pedidos: [pedido]
                }
            }

            response.status(200).send(objResposta);
        } catch (error) {
            next(error);
        }
    }

    update = async (request, response, next) => {
        console.log("🔵 PedidoControl.update()");
        try {
            const pedidoBodyRequest = request.body.pedido;
            pedidoBodyRequest.idPedido = request.params.idPedido;
            
            const clienteDAO = request.app.get('clienteDAO');
            const produtoDAO = request.app.get('produtoDAO');
            const atualizou = await this.#pedidoService.updatePedido(pedidoBodyRequest, clienteDAO, produtoDAO);

            if (atualizou) {
                return response.status(200).send({
                    success: true,
                    message: 'Pedido atualizado com sucesso',
                    data: {
                        pedidos: [{
                            idPedido: pedidoBodyRequest.idPedido,
                            dataPedido: pedidoBodyRequest.dataPedido,
                            clienteIdCliente: pedidoBodyRequest.clienteIdCliente,
                            produtoIdProduto: pedidoBodyRequest.produtoIdProduto
                        }]
                    }
                })
            } else {
                return response.status(404).send({
                    success: false,
                    message: 'Pedido não encontrado para atualização',
                    data: {
                        pedidos: [{
                            idPedido: pedidoBodyRequest.idPedido
                        }]
                    }
                })
            }
        } catch (error) {
            next(error);
        }
    }

    destroy = async (request, response, next) => {
        console.log("🔵 PedidoControl.destroy()");
        try {
            const pedidoId = request.params.idPedido;
            const excluiu = await this.#pedidoService.deletePedido(pedidoId);

            if (excluiu) {
                return response.status(204).send({
                    success: true,
                    message: 'Pedido excluído com sucesso',
                    data: {
                        pedidos: [{
                            idPedido: pedidoId
                        }]
                    }
                })
            } else {
                return response.status(404).send({
                    success: false,
                    message: 'Pedido não encontrado para exclusão',
                    data: {
                        pedidos: [{
                            idPedido: pedidoId,
                        }]
                    }
                })
            }
        } catch (error) {
            next(error);
        }
    }
}