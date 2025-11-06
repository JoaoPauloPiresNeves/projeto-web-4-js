const LogarDAO = require("../dao/LogarDAO");
const Logar = require("../model/Logar");
const MeuTokenJWT = require("../http/MeuTokenJWT");
const ErrorResponse = require("../utils/ErrorResponse");

module.exports = class LogarService {

    #logarDAO;

    /**
     * 
     * @param {LogarDAO} logarDAODependency 
     */
    constructor(logarDAODependency) {
        console.log("🆙 LogarService.constructor();");
        this.#logarDAO = logarDAODependency;
    }

    /**
     * Realiza o login do usuário e retorna token JWT
     * 
     * @param {Object} jsonLogar - Objeto contendo dados de login
     * @param {string} jsonLogar.emailLogar - Email do usuário
     * @param {string} jsonLogar.senhaLogar - Senha do usuário
     * 
     * @returns {Promise<Object>} - Retorna objeto com user e token
     * @throws {ErrorResponse} - Em caso de credenciais inválidas
     */
    loginUsuario = async (jsonLogar) => {
        console.log("🚨 LogarService.loginUsuario();");

        const objLogar = new Logar();
        objLogar.emailLogar = jsonLogar.emailLogar;
        objLogar.senhaLogar = jsonLogar.senhaLogar;

        // Validação das credenciais
        const usuario = await this.#logarDAO.logarV(objLogar);

        if (!usuario) {
            throw new ErrorResponse(
                401,
                "Credenciais inválidas",
                { message: "Email ou senha incorretos" }
            );
        }

        // Geração do token JWT
        const jwt = new MeuTokenJWT();
        const user = {
            email: usuario.email,
            id: usuario.id,
            name: usuario.email // Pode ajustar conforme sua estrutura
        };

        const token = jwt.gerarToken(user);

        console.log({ 
            user: {
                id: usuario.id,
                email: usuario.email
            }, 
            token 
        });

        return { 
            user: {
                id: usuario.id,
                email: usuario.email
            }, 
            token 
        };
    }

    /**
     * Cria um novo usuário de login
     * 
     * @param {Object} jsonLogar - Objeto contendo dados do usuário
     * @param {string} jsonLogar.emailLogar - Email do usuário
     * @param {string} jsonLogar.senhaLogar - Senha do usuário
     * 
     * @returns {Promise<number>} - ID do usuário criado
     * @throws {ErrorResponse} - Em caso de email já cadastrado
     */
    createUsuario = async (jsonLogar) => {
        console.log("🚨 LogarService.createUsuario();");

        const objLogar = new Logar();
        objLogar.emailLogar = jsonLogar.emailLogar;
        objLogar.senhaLogar = jsonLogar.senhaLogar;

        // Verifica se email já existe
        const resultado = await this.#logarDAO.findByField("email", objLogar.emailLogar);

        if (resultado.length > 0) {
            throw new ErrorResponse(
                400,
                "Email já cadastrado",
                { message: `O email ${objLogar.emailLogar} já está em uso` }
            );
        }

        return this.#logarDAO.create(objLogar);
    }

    /**
     * Atualiza dados de um usuário
     * 
     * @param {Object} jsonLogar - Objeto contendo dados atualizados
     * @param {number} jsonLogar.idLogar - ID do usuário
     * @param {string} jsonLogar.emailLogar - Novo email
     * @param {string} jsonLogar.senhaLogar - Nova senha
     * 
     * @returns {Promise<boolean>} - True se atualizado com sucesso
     * @throws {ErrorResponse} - Em caso de ID não existente
     */
    updateUsuario = async (jsonLogar) => {
        console.log("🚨 LogarService.updateUsuario();");

        const objLogar = new Logar();
        objLogar.idLogar = jsonLogar.idLogar;
        objLogar.emailLogar = jsonLogar.emailLogar;
        objLogar.senhaLogar = jsonLogar.senhaLogar;

        // Verifica se usuário existe
        const resultado = await this.#logarDAO.findByField("id", objLogar.idLogar);

        if (resultado.length <= 0) {
            throw new ErrorResponse(
                400,
                "Usuário não encontrado",
                { message: `ID ${objLogar.idLogar} não existe` }
            );
        }

        return this.#logarDAO.update(objLogar);
    }

    /**
     * Remove um usuário
     * 
     * @param {number} idLogar - ID do usuário a ser removido
     * @returns {Promise<boolean>} - True se removido com sucesso
     * @throws {ErrorResponse} - Em caso de ID não existente
     */
    deleteUsuario = async (idLogar) => {
        console.log("🚨 LogarService.deleteUsuario();");

        // Verifica se usuário existe
        const resultado = await this.#logarDAO.findByField("id", idLogar);

        if (resultado.length <= 0) {
            throw new ErrorResponse(
                400,
                "Usuário não encontrado",
                { message: `ID ${idLogar} não existe` }
            );
        }

        return this.#logarDAO.delete(idLogar);
    }

    /**
     * Lista todos os usuários
     * 
     * @returns {Promise<Array>} - Lista de usuários
     */
    findAllUsuarios = async () => {
        console.log("🚨 LogarService.findAllUsuarios();");
        return this.#logarDAO.findALL();
    }

    /**
     * Busca usuário por ID
     * 
     * @param {number} idLogar - ID do usuário
     * @returns {Promise<Object>} - Dados do usuário
     * @throws {ErrorResponse} - Em caso de usuário não encontrado
     */
    findByIdUsuario = async (idLogar) => {
        console.log("🚨 LogarService.findByIdUsuario();");

        const resultado = await this.#logarDAO.findByField("id", idLogar);

        if (resultado.length <= 0) {
            throw new ErrorResponse(
                404,
                "Usuário não encontrado",
                { message: `ID ${idLogar} não existe` }
            );
        }

        return resultado[0];
    }
}