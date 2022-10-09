const util = require('util');

exports.Execute_sp = async(conn, sp, params)=>{
    try {
        const sql_qry = util.promisify(conn.query).bind(conn);
        let parametros = Object.keys(params).reduce((arreglo, llave)=>{
            arreglo.push(params[llave]);
            return arreglo;
        },[])
        let result = await sql_qry(`call ${sp}`,parametros);
        return result;
    } catch (error) {
        console.log("error en la ejecucion del query, definicion:", error);
        throw error;
    }
}