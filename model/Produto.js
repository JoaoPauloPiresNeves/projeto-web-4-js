module.exports = class Produto{
    #idProduto;
    #nomeProduto;
    #precoProduto;

    constructor(){
        console.log("🆙 Produto.constructor()");
    }

    get idProduto(){
        return this.#idProduto;
    }

    set idProduto(value){
        const parsed = Number(value);
        if(!Number.isInteger(parsed)){
            throw new Error("idProduto deve ser um numero inteiro");
        }
        if(parsed <= 0){
            throw new Error("idProduto deve ser maior que zero");
        }

        this.#idProduto = value;
    }

    get nomeProduto(){
        return this.#nomeProduto;
    }

    set nomeProduto(value){
        if (typeof value != "string"){
            throw new Error("o nomeProduto deve ser uma string");
        }
        const nome = value.trim();
        if(nome.length<3){
            throw new Error("nomeProduto deve ter no minimo 3 caracteres");
        }
        if(nome.length>64){
            throw new Error("nomeProduto deve ter no maximo 64 caracteres");
        }
        this.#nomeProduto = value;

    }

    get precoProduto(){
        return this.#precoProduto;
    }

    set precoProduto(value){
        const parsed = Number(value);
        if (isNaN(parsed)) {
        throw new Error("precoProduto deve ser um número válido");
        }
        
        if(parsed <= 0){
            throw new Error("precoProduto deve ser maior que zero");
        }

        this.#precoProduto = value;
    }


}