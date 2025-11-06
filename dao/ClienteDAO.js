const Cliente = require("../model/Cliente");
const MysqlDataBase = require("../database/MysqlDatabase");

module.exports = class ClienteDAO{

    #database;

    /**
     * 
     * @param {MysqlDataBase} databaseInstance
     * 
    */

    constructor(databaseInstance){
        console.log("🆙 ClienteDAO.constructor();");
        this.#database = databaseInstance;
    }

    /**
     * 
     * @param {Cliente} objCliente 
     */

    create = async (objCliente)=> {

        console.log("❇️ ClienteDAO.create();");
        const SQL = "INSERT INTO clientes (nome_cliente, email_cliente) VALUES (? , ?);";
        const param = [objCliente.nomeCliente, objCliente.emailCliente];
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, param);
        if(!resultado){
            throw new Error("Falha ao inserir!");
        }
        return resultado.insertID;
    }


    delete = async (idCliente) => {

        console.log("❇️ ClienteDAO.delete();");
        const SQL = "DELETE FROM clientes WHERE idclientes = ?;";
        const param = [idCliente];
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, param);
        return (resultado.affectedRows > 0);
    }



    /**
     * 
     * @param {Cliente} objCliente 
     */

    update = async (objCliente) => {

        console.log("❇️ ClienteDAO.update();");
        const SQL = "UPDATE clientes SET nome_cliente = ? , email_cliente = ? WHERE idclientes = ?;";
        const param = [objCliente.nomeCliente, objCliente.emailCliente, objCliente.idCliente];
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, param);
        return (resultado.affectedRows > 0);


    }
    findALL = async () => {

        console.log("❇️ ClienteDAO.findALL();");
        const SQL = "SELECT * FROM clientes;";
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL);
        //console.log(resultado);
        return resultado;


    }

    findById = async (idCliente) => {
        console.log("❇️ ClienteDAO.findById();");
        const SQL = "SELECT * FROM clientes WHERE idclientes = ?;";
        const param = [idCliente];
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, param);
        //console.log(resultado);
        return resultado;


    }


    findByField = async (field, value) =>{
        console.log("❇️ ClienteDAO.findByField();");
        const SQL = `SELECT * FROM clientes WHERE ${field} = ?;`;
        const param = [value];
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, param);
        console.log(resultado);
        return resultado;


    }

}