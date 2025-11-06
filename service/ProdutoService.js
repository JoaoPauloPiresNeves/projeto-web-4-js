const ProdutoDAO = require("../dao/ProdutoDAO");
const Produto = require("../model/Produto");
const PedidoDAO = require("../dao/PedidoDAO");
const Pedido = require("../model/Pedido");
const ErrorResponse = require("../utils/ErrorResponse");


module.exports = class ProdutoService {


    #produtoDAO;
    #pedidoDAO;


    /**     * 
     * @param {ProdutoDAO} produtoDAODependency 
     */
    constructor(produtoDAODependency) {
        console.log("🆙 ProdutoService.constructor();");
        this.#produtoDAO = produtoDAODependency;
    }

    createProduto = async (produtoJson) => {
        console.log("🚨 ProdutoService.createProduto();")
        const objProdutoModel = new Produto()
        objProdutoModel.nomeProduto = produtoJson.nomeProduto;
        objProdutoModel.precoProduto = produtoJson.precoProduto;

        const resultado = await this.#produtoDAO.findByField("nome_produto", objProdutoModel.nomeProduto);

        if (resultado.length > 0) {
            throw new ErrorResponse(
                400,
                "nome de produto já está cadastrado na tabela produtos",
                { message: `o nome produto ${objProdutoModel.nomeProduto} está cadastrado na tabela produtos` }
            );
        }
        return this.#produtoDAO.create(objProdutoModel);
    }


    updateProduto = async (produtoJson) => {
        console.log("🚨 ProdutoService.updateProduto();")
        const objProdutoModel = new Produto()
        objProdutoModel.idProduto = produtoJson.idProduto;
        objProdutoModel.nomeProduto = produtoJson.nomeProduto;
        objProdutoModel.precoProduto = produtoJson.precoProduto;
        const resultado = await this.#produtoDAO.findById(objProdutoModel.idProduto);
        if (resultado.length <= 0) {
            throw new ErrorResponse(
                400,
                "Id não existe",
                { message: `o id ${objProdutoModel.idProduto}` }
            );
        }
        return this.#produtoDAO.update(objProdutoModel);
    }


    deleteProduto = async (idProduto, pedidoDAODependency) => {
        console.log("🚨 ProdutoService.deleteProduto();")
        const resultado = await this.#produtoDAO.findById(idProduto);
        if (resultado.length <= 0) {
            throw new ErrorResponse(
                400,
                "Id não existe",
                { message: `o id ${idProduto}` }
            );
        }
        this.#pedidoDAO = pedidoDAODependency;
        const pedidosVinculados = await this.#pedidoDAO.findByField("produtos_idprodutos", idProduto);
        if (pedidosVinculados.length > 0) {
            throw new ErrorResponse(
                400,
                "Produto vinculado a pedidos, não pode ser excluído",
                { message: `o id produto ${idProduto} está vinculado a pedidos` }
            );
        }
        return this.#produtoDAO.delete(idProduto);
    }

    listAllProdutos = async () => {
        console.log("🚨 ProdutoService.listAllProdutos();");
        return this.#produtoDAO.findAll();
    }
     
    findByIdProdutos = async (idProduto) => {
        console.log("🚨 ProdutoService.findById();");
        return this.#produtoDAO.findById(idProduto);
    }




}