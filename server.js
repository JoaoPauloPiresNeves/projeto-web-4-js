const express = require("express");
const cors = require("cors")

const ErrorResponse = require("./utils/ErrorResponse");

// Middlewares
const JwtMiddleware = require("./middleware/JwtMiddleware");

// Middlewares específicos das entidades
const ClienteMiddleware = require("./middleware/ClienteMiddleware");
const LogarMiddleware = require("./middleware/LogarMiddleware");
const ProdutoMiddleware = require("./middleware/ProdutoMiddleware");
const PedidoMiddleware = require("./middleware/PedidoMiddleware");

// Controls
const ClienteControl = require("./control/ClienteControl");
const LogarControl = require("./control/LogarControl");
const ProdutoControl = require("./control/ProdutoControl");
const PedidoControl = require("./control/PedidoControl");

// Services
const ClienteService = require("./service/ClienteService");
const LogarService = require("./service/LogarService");
const ProdutoService = require("./service/ProdutoService");
const PedidoService = require("./service/PedidoService");

// DAOs
const ClienteDAO = require("./dao/ClienteDAO");
const LogarDAO = require("./dao/LogarDAO");
const ProdutoDAO = require("./dao/ProdutoDAO");
const PedidoDAO = require("./dao/PedidoDAO");

// Routers
const ClienteRouter = require("./routes/ClienteRouter");
const LogarRouter = require("./routes/LogarRouter");
const ProdutoRouter = require("./routes/ProdutoRouter");
const PedidoRouter = require("./routes/PedidoRouter");

// Banco de dados
const MysqlDatabase = require("./database/MysqlDatabase");

module.exports = class Server {
    #porta;
    #app;
    #router;
    #database;

    // Middlewares
    #jwtMiddleware;

    // Cliente
    #clienteRouter;
    #clienteMiddleware;
    #clienteControl;
    #clienteService;
    #clienteDAO;

    // Logar
    #logarRouter;
    #logarMiddleware;
    #logarControl;
    #logarService;
    #logarDAO;

    // Produto
    #produtoRouter;
    #produtoMiddleware;
    #produtoControl;
    #produtoService;
    #produtoDAO;

    // Pedido
    #pedidoRouter;
    #pedidoMiddleware;
    #pedidoControl;
    #pedidoService;
    #pedidoDAO;

    constructor(porta) {
        console.log("⬆️ Server.constructor()");
        this.#porta = porta ?? 8080;
    }

    init = async () => {
        console.log("⬆️ Server.init()");
        this.#app = express();
        this.#router = express.Router();
        
        // Configurações do Express
        this.#app.use(express.json());
        this.#app.use(express.static("static"));
        this.#app.use(cors({ origin: "*" }));

        // Inicializa middleware JWT
        this.#jwtMiddleware = new JwtMiddleware();

        // Configuração do banco de dados
        this.#database = new MysqlDatabase({
            host: "localhost",
            user: "root",
            password: "",
            database: "pjt2b",
            port: 3306,
            waitForConnections: true,
            connectionLimit: 50,
            queueLimit: 10
        });

        this.#database.connect();

        // Middleware executado antes das rotas
        this.beforeRouting();
        
        // Configura todos os módulos
        this.setupCliente();
        this.setupLogar();
        this.setupProduto();
        this.setupPedido();
        
        // Configura tratamento de erros
        this.setupErrorMiddleware();
    }

    setupCliente = () => {
        console.log("⬆️ Server.setupCliente()");

        this.#clienteMiddleware = new ClienteMiddleware();
        this.#clienteDAO = new ClienteDAO(this.#database);
        this.#clienteService = new ClienteService(this.#clienteDAO);
        this.#clienteControl = new ClienteControl(this.#clienteService);

        this.#clienteRouter = new ClienteRouter(
            this.#jwtMiddleware,
            this.#clienteMiddleware,
            this.#clienteControl
        );

        this.#app.use("/api/v1/clientes", this.#clienteRouter.createRoutes());
    }

    setupLogar = () => {
        console.log("⬆️ Server.setupLogar()");

        this.#logarMiddleware = new LogarMiddleware();
        this.#logarDAO = new LogarDAO(this.#database);
        this.#logarService = new LogarService(this.#logarDAO);
        this.#logarControl = new LogarControl(this.#logarService);

        this.#logarRouter = new LogarRouter(
            this.#jwtMiddleware,
            this.#logarMiddleware,
            this.#logarControl
        );

        this.#app.use("/api/v1/logar", this.#logarRouter.createRoutes());
    }

    setupProduto = () => {
        console.log("⬆️ Server.setupProduto()");

        this.#produtoMiddleware = new ProdutoMiddleware();
        this.#produtoDAO = new ProdutoDAO(this.#database);
        this.#produtoService = new ProdutoService(this.#produtoDAO);
        this.#produtoControl = new ProdutoControl(this.#produtoService);

        this.#produtoRouter = new ProdutoRouter(
            this.#jwtMiddleware,
            this.#produtoMiddleware,
            this.#produtoControl
        );

        this.#app.use("/api/v1/produtos", this.#produtoRouter.createRoutes());
    }

    setupPedido = () => {
        console.log("⬆️ Server.setupPedido()");

        this.#pedidoMiddleware = new PedidoMiddleware();
        this.#pedidoDAO = new PedidoDAO(this.#database);
        this.#pedidoService = new PedidoService(this.#pedidoDAO);
        this.#pedidoControl = new PedidoControl(this.#pedidoService);

        // Injeta DAOs necessários para o PedidoControl via app
        this.#app.set('clienteDAO', this.#clienteDAO);
        this.#app.set('produtoDAO', this.#produtoDAO);
        this.#app.set('pedidoDAO', this.#pedidoDAO);

        this.#pedidoRouter = new PedidoRouter(
            this.#jwtMiddleware,
            this.#pedidoMiddleware,
            this.#pedidoControl
        );

        this.#app.use("/api/v1/pedidos", this.#pedidoRouter.createRoutes());
    }

    beforeRouting = () => {
        this.#app.use((req, res, next) => {
            console.log("------------------------------------------------------------------");
            next();
        });
    }

    setupErrorMiddleware = () => {
        console.log("⬆️ Server.setupErrorHandler")
        this.#app.use((error, request, response, next) => {
            if (error instanceof ErrorResponse) {
                console.log("🟡 Server.errorHandler()");
                return response.status(error.httpCode).json({
                    success: false,
                    message: error.message,
                    error: error.error
                });
            }

            // Erro genérico (não tratado especificamente)
            const resposta = {
                success: false,
                message: "Ocorreu um erro interno no servidor",
                data: { stack: error.stack },
                error: { message: error.message || "Erro interno", code: error.code }
            };
            console.error("❌ Erro capturado:", resposta);
            response.status(500).json(resposta);
        });
    }

    run = () => {
        this.#app.listen(this.#porta, () => {
            console.log(`🚀 Server rodando em http://localhost:${this.#porta}/`);
            console.log("📊 Endpoints disponíveis:");
            console.log("   👥 Clientes:    http://localhost:8080/api/v1/clientes");
            console.log("   🔐 Autenticação: http://localhost:8080/api/v1/logar");
            console.log("   📦 Produtos:    http://localhost:8080/api/v1/produtos");
            console.log("   🧾 Pedidos:     http://localhost:8080/api/v1/pedidos");
        });
    }
}