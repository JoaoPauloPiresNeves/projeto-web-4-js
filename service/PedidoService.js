const PedidoDAO = require("../dao/PedidoDAO");
const Pedido = require("../model/Pedido");
const ClienteDAO = require("../dao/ClienteDAO");
const ProdutoDAO = require("../dao/ProdutoDAO");
const ErrorResponse = require("../utils/ErrorResponse");

module.exports = class PedidoService {

    #pedidoDAO;
    #clienteDAO;
    #produtoDAO;

    /**
     * 
     * @param {PedidoDAO} pedidoDAODependency 
     */
    constructor(pedidoDAODependency) {
        console.log("🆙 PedidoService.constructor();");
        this.#pedidoDAO = pedidoDAODependency;
    }

    /**
     * Cria um novo pedido
     * 
     * @param {Object} jsonPedido - Objeto contendo dados do pedido
     * @param {string} jsonPedido.dataPedido - Data do pedido
     * @param {number} jsonPedido.clienteIdCliente - ID do cliente
     * @param {number} jsonPedido.produtoIdProduto - ID do produto
     * 
     * @returns {Promise<number>} - ID do pedido criado
     * @throws {ErrorResponse} - Em caso de cliente/produto não existente
     */
    createPedido = async (jsonPedido, clienteDAODependency, produtoDAODependency) => {
        console.log("🚨 PedidoService.createPedido();");

        this.#clienteDAO = clienteDAODependency;
        this.#produtoDAO = produtoDAODependency;

        const objPedido = new Pedido();
        objPedido.dataPedido = jsonPedido.dataPedido;
        objPedido.clienteIdCliente = jsonPedido.clienteIdCliente;
        objPedido.produtoIdProduto = jsonPedido.produtoIdProduto;

        // Verifica se cliente existe
        const clienteExiste = await this.#clienteDAO.findById(objPedido.clienteIdCliente);
        if (clienteExiste.length <= 0) {
            throw new ErrorResponse(
                400,
                "Cliente não encontrado",
                { message: `O cliente ID ${objPedido.clienteIdCliente} não existe` }
            );
        }

        // Verifica se produto existe
        const produtoExiste = await this.#produtoDAO.findById(objPedido.produtoIdProduto);
        if (produtoExiste.length <= 0) {
            throw new ErrorResponse(
                400,
                "Produto não encontrado",
                { message: `O produto ID ${objPedido.produtoIdProduto} não existe` }
            );
        }

        return this.#pedidoDAO.create(objPedido);
    }

    /**
     * Atualiza um pedido existente
     * 
     * @param {Object} jsonPedido - Objeto contendo dados atualizados do pedido
     * @param {number} jsonPedido.idPedido - ID do pedido
     * @param {string} jsonPedido.dataPedido - Nova data do pedido
     * @param {number} jsonPedido.clienteIdCliente - Novo ID do cliente
     * @param {number} jsonPedido.produtoIdProduto - Novo ID do produto
     * 
     * @returns {Promise<boolean>} - True se atualizado com sucesso
     * @throws {ErrorResponse} - Em caso de pedido/cliente/produto não encontrado
     */
    updatePedido = async (jsonPedido, clienteDAODependency, produtoDAODependency) => {
        console.log("🚨 PedidoService.updatePedido();");

        this.#clienteDAO = clienteDAODependency;
        this.#produtoDAO = produtoDAODependency;

        const objPedido = new Pedido();
        objPedido.idPedido = jsonPedido.idPedido;
        objPedido.dataPedido = jsonPedido.dataPedido;
        objPedido.clienteIdCliente = jsonPedido.clienteIdCliente;
        objPedido.produtoIdProduto = jsonPedido.produtoIdProduto;

        // Verifica se pedido existe
        const pedidoExiste = await this.#pedidoDAO.findByField("idpedidos", objPedido.idPedido);
        if (pedidoExiste.length <= 0) {
            throw new ErrorResponse(
                400,
                "Pedido não encontrado",
                { message: `O pedido ID ${objPedido.idPedido} não existe` }
            );
        }

        // Verifica se cliente existe
        const clienteExiste = await this.#clienteDAO.findById(objPedido.clienteIdCliente);
        if (clienteExiste.length <= 0) {
            throw new ErrorResponse(
                400,
                "Cliente não encontrado",
                { message: `O cliente ID ${objPedido.clienteIdCliente} não existe` }
            );
        }

        // Verifica se produto existe
        const produtoExiste = await this.#produtoDAO.findById(objPedido.produtoIdProduto);
        if (produtoExiste.length <= 0) {
            throw new ErrorResponse(
                400,
                "Produto não encontrado",
                { message: `O produto ID ${objPedido.produtoIdProduto} não existe` }
            );
        }

        return this.#pedidoDAO.update(objPedido);
    }

    /**
     * Remove um pedido
     * 
     * @param {number} idPedido - ID do pedido a ser removido
     * @returns {Promise<boolean>} - True se removido com sucesso
     * @throws {ErrorResponse} - Em caso de pedido não encontrado
     */
    deletePedido = async (idPedido) => {
        console.log("🚨 PedidoService.deletePedido();");

        // Verifica se pedido existe
        const pedidoExiste = await this.#pedidoDAO.findByField("idpedidos", idPedido);
        if (pedidoExiste.length <= 0) {
            throw new ErrorResponse(
                400,
                "Pedido não encontrado",
                { message: `O pedido ID ${idPedido} não existe` }
            );
        }

        return this.#pedidoDAO.delete(idPedido);
    }

    /**
     * Lista todos os pedidos com informações completas
     * 
     * @returns {Promise<Array>} - Lista de pedidos com dados de cliente e produto
     */
    findAllPedidos = async () => {
        console.log("🚨 PedidoService.findAllPedidos();");
        return this.#pedidoDAO.findAll();
    }

    /**
     * Busca pedido por ID com informações completas
     * 
     * @param {number} idPedido - ID do pedido
     * @returns {Promise<Object>} - Dados completos do pedido
     * @throws {ErrorResponse} - Em caso de pedido não encontrado
     */
    findByIdPedido = async (idPedido) => {
        console.log("🚨 PedidoService.findByIdPedido();");

        try {
            const pedido = await this.#pedidoDAO.findById(idPedido);
            return pedido;
        } catch (error) {
            throw new ErrorResponse(
                404,
                "Pedido não encontrado",
                { message: `Pedido ID ${idPedido} não encontrado` }
            );
        }
    }

    /**
     * Busca pedidos por campo específico
     * 
     * @param {string} field - Campo para busca
     * @param {any} value - Valor do campo
     * @returns {Promise<Array>} - Lista de pedidos encontrados
     */
    findByFieldPedidos = async (field, value) => {
        console.log("🚨 PedidoService.findByFieldPedidos();");
        return this.#pedidoDAO.findByField(field, value);
    }
}