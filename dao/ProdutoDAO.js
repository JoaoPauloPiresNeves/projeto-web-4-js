const Produto = require("../model/Produto");
const MysqlDataBase = require("../database/MysqlDatabase");

module.exports = class ProdutoDAO{

    #database;

    /**
     * 
     * @param {MysqlDataBase} databaseInstance
     * 
    */

    constructor(databaseInstance){
        console.log("🆙 ProdutoDAO.constructor();");
        this.#database = databaseInstance;
    }

    /**
     * 
     * @param {Produto} objProduto 
     */

    create = async (objProduto)=> {

        console.log("❇️ ProdutoDAO.create();");
        const SQL = "INSERT INTO produtos (nome_produto, preco_produto) VALUES (? , ?);";
        const param = [objProduto.nomeProduto, objProduto.precoProduto];
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, param);
        if(!resultado){
            throw new Error("Falha ao inserir!");
        }
        return resultado.insertID;
    }


    delete = async (idProduto) => {

        console.log("❇️ ProdutoDAO.delete();");
        const SQL = "DELETE FROM produtos WHERE idprodutos = ?;";
        const param = [idProduto];
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, param);
        return (resultado.affectedRows > 0);
    }



    /**
     * 
     * @param {Produto} objProduto 
     */

    update = async (objProduto) => {

        console.log("❇️ ProdutoDAO.update();");
        const SQL = "UPDATE produtos SET nome_produto = ? , preco_produto = ? WHERE idprodutos = ?;";
        const param = [objProduto.nomeProduto, objProduto.precoProduto, objProduto.idProduto];
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, param);
        return (resultado.affectedRows > 0);


    }
    findALL = async () => {

        console.log("❇️ ProdutoDAO.findALL();");
        const SQL = "SELECT * FROM produtos;";
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL);
        console.log(resultado);
        return resultado;


    }

    findById = async (idProduto) => {
        console.log("❇️ ProdutoDAO.findById();");
        const SQL = "SELECT * FROM produtos WHERE idprodutos = ?;";
        const param = [idProduto];
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, param);
        console.log(resultado);
        return resultado;
    }

}