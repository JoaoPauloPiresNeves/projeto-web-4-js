module.exports = class Pedido{

    #idPedido;
    #dataPedido;
    #clienteIdCliente;
    #produtoIdProduto;

     get idPedido(){
        return this.#idPedido;
    }

    set idPedido(value){
        const parsed = Number(value);
        if(!Number.isInteger(parsed)){
            throw new Error("idPedido deve ser um numero inteiro");
        }
        if(parsed <= 0){
            throw new Error("idPedido deve ser maior que zero");
        }
        this.#idPedido = value;
    }

    get dataPedido(){
        return this.#dataPedido;
    }

    set dataPedido(value){

        const data = new Date(value);

        if(isNaN(data.getTime())){
            throw new Error("dataPedido deve ser uma data valida no formato YYYY-MM-DD");

        }

        const hoje = new Date();
        if(data> hoje){
            throw new Error("O dataPedido não pode ser maior que o dia atual");
        }

        this.#dataPedido = data.toISOString().split("T")[0];


    }

    get clienteIdCliente() {
        return this.#clienteIdCliente;
    }

    set clienteIdCliente(value) {
        const parsed = Number(value);
        if (!Number.isInteger(parsed)) {
            throw new Error("clienteIdCliente deve ser um número inteiro");
        }
        if (parsed <= 0) {
            throw new Error("clienteIdCliente deve ser maior que zero");
        }
        this.#clienteIdCliente = parsed;
    }
    
    get produtoIdProduto() {
        return this.#produtoIdProduto;
    }

    set produtoIdProduto(value) {
        const parsed = Number(value);
        if (!Number.isInteger(parsed)) {
            throw new Error("produtoIdProduto deve ser um número inteiro");
        }
        if (parsed <= 0) {
            throw new Error("produtoIdProduto deve ser maior que zero");
        }
        this.#produtoIdProduto = parsed;
    }
    



}