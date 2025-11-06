const Pedido = require("../model/Pedido");
const Produto = require("../model/Produto");
const Cliente = require("../model/Cliente");
const MysqlDataBase = require("../database/MysqlDatabase");

module.exports = class PedidoDAO {

    #database;

    /**
     * 
     * @param {MysqlDataBase} databaseInstance
     * 
    */

    constructor(databaseInstance) {
        console.log("🆙 PedidoDAO.constructor();");
        this.#database = databaseInstance;
    }

    /**
     * 
     * @param {Pedido} objPedido 
     */

    create = async (objPedido) => {

        console.log("❇️ PedidoDAO.create();");
        const SQL = "INSERT INTO pedidos (data_pedido, clientes_idclientes, produtos_idprodutos) VALUES (? , ?, ?);";
        const param = [objPedido.dataPedido, objPedido.clienteIdCliente, objPedido.produtoIdProduto];
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, param);
        if (!resultado) {
            throw new Error("Falha ao inserir!");
        }
        return resultado.insertID;
    }


    delete = async (idPedido) => {

        console.log("❇️ PedidoDAO.delete();");
        const SQL = "DELETE FROM pedidos WHERE idpedidos = ?;";
        const param = [idPedido];
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, param);
        return (resultado.affectedRows > 0);
    }



    /**
     * 
     * @param {Pedido} objPedido 
     */

    update = async (objPedido) => {

        console.log("❇️ PedidoDAO.update();");
        const SQL = "UPDATE pedidos SET data_pedido = ? , clientes_idclientes = ?, produtos_idprodutos = ? WHERE idpedidos = ?;";
        const param = [objPedido.dataPedido, objPedido.clienteIdCliente, objPedido.produtoIdProduto, objPedido.idPedido];
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, param);
        return (resultado.affectedRows > 0);
    }


    findAll = async () => {
        console.log("❇️ PedidoDAO.findAll()");
        const SQL = `
            SELECT 
                p.idpedidos AS idPedido,
                p.data_pedido AS dataPedido,
                c.idclientes AS idCliente,
                c.nome_cliente AS nomeCliente,
                pr.idprodutos AS idProduto,
                pr.nome_produto AS nomeProduto,
                pr.preco_produto AS precoProduto
            FROM pedidos p
            JOIN clientes c ON p.clientes_idclientes = c.idclientes
            JOIN produtos pr ON p.produtos_idprodutos = pr.idprodutos;
        `;

        const pool = await this.#database.getPool();
        const [matriz] = await pool.execute(SQL);
        console.log(matriz);

        return matriz.map(row => ({
            idPedido: row.idPedido,
            dataPedido: row.dataPedido,
            cliente: {
                idCliente: row.idCliente,
                nomeCliente: row.nomeCliente
            },
            produto: {
                idProduto: row.idProduto,
                nomeProduto: row.nomeProduto,
                precoProduto: row.precoProduto
            }
        }));
    };

    findById = async (idPedido) => {
        console.log("❇️ PedidoDAO.findById()");

        // ✅ Validação básica do ID
        const parsedId = Number(idPedido);
        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            throw new Error("O idPedido deve ser um número inteiro maior que zero.");
        }

        // 🧠 Query SQL com JOINs (igual ao findAll)
        const SQL = `
        SELECT 
            p.idpedidos AS idPedido,
            p.data_pedido AS dataPedido,
            c.idclientes AS idCliente,
            c.nome_cliente AS nomeCliente,
            pr.idprodutos AS idProduto,
            pr.nome_produto AS nomeProduto,
            pr.preco_produto AS precoProduto
        FROM pedidos p
        JOIN clientes c ON p.clientes_idclientes = c.idclientes
        JOIN produtos pr ON p.produtos_idprodutos = pr.idprodutos
        WHERE p.idpedidos = ?;
    `;

        // 🧱 Execução da query com parâmetro
        const pool = await this.#database.getPool();
        const [rows] = await pool.execute(SQL, [parsedId]);

        // ❌ Se não encontrou o pedido, lança erro
        if (rows.length === 0) {
            throw new Error(`Nenhum pedido encontrado com id ${parsedId}`);
        }

        // ✅ Monta e retorna o objeto bonitinho
        const row = rows[0];
        return {
            idPedido: row.idPedido,
            dataPedido: row.dataPedido,
            cliente: {
                idCliente: row.idCliente,
                nomeCliente: row.nomeCliente
            },
            produto: {
                idProduto: row.idProduto,
                nomeProduto: row.nomeProduto,
                precoProduto: row.precoProduto
            }
        };
    };

    findByField = async (field, value) => {


        console.log("❇️ PedidoDAO.findByField()");

        const SQL = `SELECT * FROM pedidos WHERE ${field} = ?`;
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, [value]);

        return resultado;


    }


}