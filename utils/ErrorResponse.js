module.exports = class ErrorResponse extends Error {
    
    #name;
    #httpCode;
    #error;
    
    
    constructor(httpCode, message, error = null){
        super(message);
        this.#name = "ErrorResponse";
        this.#httpCode = httpCode;
        this.#error = error;

    }

    get name(){
        return this.#name;
    }

    get httpCode(){
        return this.#httpCode;
    }

    get error () {
        return this.#error;
    }
}