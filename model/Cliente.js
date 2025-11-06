module.exports = class Cliente {

    #idCliente;
    #nomeCliente;
    #emailCliente;

    constructor(){
        console.log("🆙 Cliente.constructor()");
    }

    get idCliente(){
        return this.#idCliente;
    }

    set idCliente(value){
        const parsed = Number(value);
        if(!Number.isInteger(parsed)){
            throw new Error("idCliente deve ser um numero inteiro");
        }
        if(parsed <= 0){
            throw new Error("idCliente deve ser maior que zero");
        }

        this.#idCliente = value;
    }

    get nomeCliente(){
        return this.#nomeCliente;
    }

    set nomeCliente(value){
        if (typeof value != "string"){
            throw new Error("o nomeCliente deve ser uma string");
        }
        const nome = value.trim();
        if(nome.length<3){
            throw new Error("nomeCliente deve ter no minimo 3 caracteres");
        }
        if(nome.length>64){
            throw new Error("nomeCliente deve ter no maximo 64 caracteres");
        }
        this.#nomeCliente = value;

    }

    get emailCliente(){
        return this.#emailCliente;
    }

    set emailCliente(value){
        // Verifica se é string
        if (typeof value !== "string") {
            throw new Error("email deve ser uma string.");
        }

        const emailTrimmed = value.trim();

        // Verifica se não está vazio
        if (emailTrimmed === "") {
            throw new Error("email não pode ser vazio.");
        }

        // Valida formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailTrimmed)) {
            throw new Error("email em formato inválido.");
        }

        // Atribui valor ao atributo privado
        this.#emailCliente = emailTrimmed;
    }



}