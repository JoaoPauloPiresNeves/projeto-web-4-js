const bcrypt = require("bcrypt");
const Logar = require("../model/Logar");
const MysqlDataBase = require("../database/MysqlDatabase");

module.exports = class LogarDAO{

    #database;

    /**
     * 
     * @param {MysqlDataBase} databaseInstance
     * 
    */

    constructor(databaseInstance){
        console.log("🆙 LogarDAO.constructor();");
        this.#database = databaseInstance;
    }

    /**
     * 
     * @param {Logar} objLogar 
     */

    create = async (objLogar)=> {

        console.log("❇️ LogarDAO.create();");
        const SQL = "INSERT INTO logar (email, senha) VALUES (? , ?);";
        objLogar.senha = await bcrypt.hash(objLogar.senhaLogar, 12);
        const param = [objLogar.emailLogar, objLogar.senhaLogar];
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, param);
        if(!resultado){
            throw new Error("Falha ao inserir!");
        }
        return resultado.insertID;
    }


    delete = async (idLogar) => {
        console.log("❇️ LogarDAO.delete();");
        const SQL = "DELETE FROM logar WHERE id = ?;";
        const param = [idLogar];
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, param);
        return (resultado.affectedRows > 0);
    }



    /**
     * 
     * @param {Logar} objLogar 
     */

    update = async (objLogar) => {

        console.log("❇️ LogarDAO.update();");
        objLogar.senhaLogar = await bcrypt.hash(objLogar.senhaLogar, 12);
        const SQL = "UPDATE logar SET email = ? , senha = ? WHERE id = ?;";
        const param = [objLogar.emailLogar, objLogar.senhaLogar, objLogar.idLogar];
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, param);
        return (resultado.affectedRows > 0);


    }
    findALL = async () => {

        console.log("❇️ LogarDAO.findALL();");
        const SQL = "SELECT * FROM logar;";
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL);
        //console.log(resultado);
        return resultado;


    }

    findByField = async (field, value) => {
        console.log("❇️ LogarDAO.findByField();");
        ;
        const allowedField = ["email","id", "senha"];

        if(!allowedField.includes(field)){
            throw new Error("Campo invalido");
        }
        const SQL = `SELECT * FROM logar WHERE ${field} = ?`;
        const param = [value];
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, param);
        console.log(resultado);
        return resultado;


    }

   /**
 * Valida o login de um usuário.
 * 
 * @param {Logar} objLogar
 * @returns {object|null} Retorna o usuário logado ou null se falhar
 */
    logarV = async (objLogar) => {
        console.log(objLogar);
        console.log("❇️ LogarDAO.logarV();");

        // Busca o cadastro pelo email
        const resultado = await this.findByField("email", objLogar.emailLogar);

        // Se não encontrou, retorna null
        if (resultado.length === 0) {
            console.log("⚠️ Usuário não encontrado");
            return null;
        }

        // Pega o usuário encontrado
        const usuario = resultado[0];

        // Compara a senha digitada com o hash armazenado
        const senhaCorreta = await bcrypt.compare(objLogar.senhaLogar, usuario.senha);

        if (!senhaCorreta) {
            console.log("❌ Senha incorreta");
            return null;
        }

        console.log("✅ Login bem-sucedido!");
        return usuario; // ou pode retornar um token depois
};




}