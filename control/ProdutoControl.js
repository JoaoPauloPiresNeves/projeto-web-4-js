const ProdutoService = require("../service/ProdutoService");

module.exports = class ProdutoControl {
    #produtoService;

    /**
     * @param {ProdutoService} produtoServiceDependency
     */
    constructor(produtoServiceDependency) {
        console.log("⬆️ ProdutoControl.constructor()");
        this.#produtoService = produtoServiceDependency;
    }

    store = async (request, response, next) => {
        console.log("🔵 ProdutoControl.store()");
        try {
            const produtoBodyRequest = request.body.produto;
            const novoId = await this.#produtoService.createProduto(produtoBodyRequest);

            const objResposta = {
                success: true,
                message: "Produto cadastrado com sucesso",
                data: {
                    produtos: [{
                        idProduto: novoId,
                        nomeProduto: produtoBodyRequest.nomeProduto,
                        precoProduto: produtoBodyRequest.precoProduto
                    }]
                }
            };
            
            response.status(201).send(objResposta);
        } catch (error) {
            next(error);
        }
    }

    index = async (request, response, next) => {
        console.log("🔵 ProdutoControl.index()");
        try {
            const arrayProdutos = await this.#produtoService.listAllProdutos();

            response.status(200).send({
                success: true,
                message: "Busca realizada com sucesso",
                data: {
                    produtos: arrayProdutos
                },
            });
        } catch (error) {
            next(error);
        }
    }

    show = async (request, response, next) => {
        console.log("🔵 ProdutoControl.show()");
        try {
            const produtoId = request.params.idProduto;
            const produto = await this.#produtoService.findByIdProdutos(produtoId);

            const objResposta = {
                success: true,
                message: "Executado com sucesso",
                data: {
                    produtos: [produto]
                }
            }

            response.status(200).send(objResposta);
        } catch (error) {
            next(error);
        }
    }

    update = async (request, response, next) => {
        console.log("🔵 ProdutoControl.update()");
        try {
            const produtoBodyRequest = request.body.produto;
            produtoBodyRequest.idProduto = request.params.idProduto;
            
            const atualizou = await this.#produtoService.updateProduto(produtoBodyRequest);

            if (atualizou) {
                return response.status(200).send({
                    success: true,
                    message: 'Produto atualizado com sucesso',
                    data: {
                        produtos: [{
                            idProduto: produtoBodyRequest.idProduto,
                            nomeProduto: produtoBodyRequest.nomeProduto,
                            precoProduto: produtoBodyRequest.precoProduto
                        }]
                    }
                })
            } else {
                return response.status(404).send({
                    success: false,
                    message: 'Produto não encontrado para atualização',
                    data: {
                        produtos: [{
                            idProduto: produtoBodyRequest.idProduto
                        }]
                    }
                })
            }
        } catch (error) {
            next(error);
        }
    }

    destroy = async (request, response, next) => {
        console.log("🔵 ProdutoControl.destroy()");
        try {
            const produtoId = request.params.idProduto;
            const pedidoDAO = request.app.get('pedidoDAO'); // Injetado via app
            const excluiu = await this.#produtoService.deleteProduto(produtoId, pedidoDAO);

            if (excluiu) {
                return response.status(204).send({
                    success: true,
                    message: 'Produto excluído com sucesso',
                    data: {
                        produtos: [{
                            idProduto: produtoId
                        }]
                    }
                })
            } else {
                return response.status(404).send({
                    success: false,
                    message: 'Produto não encontrado para exclusão',
                    data: {
                        produtos: [{
                            idProduto: produtoId,
                        }]
                    }
                })
            }
        } catch (error) {
            next(error);
        }
    }
}