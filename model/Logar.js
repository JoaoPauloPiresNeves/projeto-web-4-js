module.exports = class Logar{

    #idLogar;
    #emailLogar;
    #senhaLogar;

    constructor(){
        console.log("🆙 Logar.constructor()");
    }

    get idLogar(){
        return this.#idLogar;
    }

    set idLogar(value){
        const parsed = Number(value);
        if(!Number.isInteger(parsed)){
            throw new Error("idLogar deve ser um numero inteiro");
        }
        if(parsed <= 0){
            throw new Error("idLogar deve ser maior que zero");
        }

        this.#idLogar = value;
    }


    get emailLogar(){
        return this.#emailLogar;
    }

    set emailLogar(value){

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
        this.#emailLogar = emailTrimmed;

    }


    get senhaLogar(){
        return this.#senhaLogar;
    }

    set senhaLogar(value){

        if (typeof value !== "string") {
            throw new Error("senha deve ser uma string.");
        }

        const senhaTrimmed = value.trim();

        // Verifica se não está vazia
        if (senhaTrimmed === "") {
            throw new Error("senha não pode ser vazia.");
        }

        // Verifica tamanho mínimo
        if (senhaTrimmed.length < 6) {
            throw new Error("senha deve ter pelo menos 6 caracteres.");
        }

        this.#senhaLogar = senhaTrimmed;

    }


}