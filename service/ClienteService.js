const ClienteDAO = require("../dao/ClienteDAO");
const PedidoDAO = require("../dao/PedidoDAO");
const Cliente = require("../model/Cliente");
const ErrorResponse = require("../utils/ErrorResponse");


module.exports = class ClienteService {

    #clienteDAO;
    #pedidoDAO;


    /**
     * 
     * @param {ClienteDAO} clienteDAODependency 
     */
    constructor(clienteDAODependency) {
        console.log("🆙 ClienteService.constructor();");
        this.#clienteDAO = clienteDAODependency;
    }

    createCliente = async (clienteJson) => {
        console.log("🚨 ClienteService.createCliente();");

        const objClienteModel = new Cliente();
        objClienteModel.emailCliente = clienteJson.emailCliente;
        objClienteModel.nomeCliente = clienteJson.nomeCliente;

        const resultado = await this.#clienteDAO.findByField("email_cliente", objClienteModel.emailCliente);

        if (resultado.length > 0) {
            throw new ErrorResponse(
                400,
                "email de cliente já está cadastrado na tabela pedidos",
                { message: `o id cliente ${objClienteModel.emailCliente} está cadastrado na tabela pedidos` }
            );
        }

        return this.#clienteDAO.create(objClienteModel);
    }


    updateCliente = async (clienteJson) => {
        console.log("🚨 ClienteService.updateCliente();");
        const objClienteModel = new Cliente();
        objClienteModel.idCliente = clienteJson.idCliente;
        objClienteModel.emailCliente = clienteJson.emailCliente;
        objClienteModel.nomeCliente = clienteJson.nomeCliente;

        const resultado = await this.#clienteDAO.findById(objClienteModel.idCliente);
        if (resultado.length <= 0) {
            throw new ErrorResponse(
                400,
                "Id não existe",
                { message: `o id ${objClienteModel.idCliente}` }
            );
        }
        return this.#clienteDAO.update(objClienteModel);


    }


    deleteCliente = async (idCliente, pedidoDAODependency) => {
        console.log("🚨 ClienteService.updateCliente();");
        
        this.#pedidoDAO = pedidoDAODependency;

        const resultado = await this.#clienteDAO.findById(idCliente);
        if (resultado.length <= 0) {
            throw new ErrorResponse(
                400,
                "Id não existe",
                { message: `o id ${idCliente}` }
            );
        }
        const resultado2 = await this.#pedidoDAO.findByField("clientes_idclientes", idCliente);

        if (resultado2.length > 0){
            throw new ErrorResponse(
                400,
                "Id de cliente está cadastrado na tabela pedidos",
                { message: `o id cliente ${idCliente} está cadastrado na tabela pedidos` }
            );
        }

        return this.#clienteDAO.delete(idCliente);
        
    }






    findAll = async () => {
        console.log("🚨 ClienteService.findAll();");
        return this.#clienteDAO.findALL();

    }

    findById = async (idCliente) => {
        console.log("🚨 ClienteService.findById();");
        return this.#clienteDAO.findById(idCliente);

    }




}