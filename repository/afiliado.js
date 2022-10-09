const{str_connection} = require('../components/Connection');
const{Execute_sp} = require('../components/CustomRepository');

let sr_afiliado = function(){
    let get_afiliado = async(params)=>{
        return await Execute_sp(str_connection, 'sp_api_get_afiliacion (?)', params)
    }
    let set_afiliado = async(params)=>{
        return await Execute_sp(str_connection, 'sp_api_set_token_afiliado (?,?)', params)
    }

    return {
        get_afiliado
        ,set_afiliado
    }
}

module.exports = sr_afiliado();