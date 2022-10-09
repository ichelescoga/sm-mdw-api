//b = require('../src/models')
/*const sequelize = require('../components/conn_sqlz');
const mssequelize = require('../components/conn_ms_sqlz');
var initModels = require('../src/models/init-models')
let msInitModels = require('../src/msmodels/init-models')
var models = initModels(sequelize);
let msmodels = msInitModels(mssequelize)

let cawiRepository = function() {
    
    async function qry_get_cawi(params){
        resultado = await models.cawi_encabezado.findAll({
            attributes:[
                ['can_codigo','Codigo'],
                ['can_afi_codigo','Afiliacion'],
                ['can_nombre',"Nombre"],
                ['can_activo','Activo'],
                ['can_categoria','Categoria']
            ],
            where:{
                can_afi_codigo: params.afiliacion,
            }
        }).then(cawi =>{
            return cawi
        }).catch(err=>{
            return err
        })
        return resultado
    }
    
    async function qry_get_cawi_ask(params){
        resultado = await models.cawi_preguntas.findAll({
            attributes:[
                ['cpr_codigo',"codigo_pregunta"],
                ['cpr_pregunta','Pregunta'],
                ['cpr_obligatorio','Requerido'],
                ['cpr_tipo', 'Categoria'],
            ],
            where:{
                cpr_can_codigo : params.cod_encuesta
            },
            include:[{
                model: models.cawi_encabezado,
                as: 'cpr_can_codigo_cawi_encabezado',
                attributes:[],
                where:{
                    can_afi_codigo: params.afiliacion,
                }
            },{
                model: models.cawi_opciones_respuestas,
                as: "posibles_respuestas"
    
            }]
        }).then(ask =>{
            return ask
        }).catch(err=>{
            return err
        })
        return resultado;
    }
    
    async function qry_set_answer(params,element){
        resultado = await models.cawi_respuestas.create({
            cre_can_codigo  : params.cod_encuesta,
            cre_cpr_codigo  : element.codigo_pregunta,
            cre_llave       : params.llave,
            cre_estado      : 1,
            cre_respuesta   : element.respuesta,
            cre_mesa        : (typeof element.mesa === 'undefined')?0:element.mesa,
            cre_cuenta      : (typeof element.cuenta === 'undefined')?0:element.cuenta,
            cre_total       : (typeof element.total === 'undefined')?0:element.total,
            cre_fecha       : params.fecha,
            cre_sucursal    : (typeof element.sucursal === 'undefined')?null:element.sucursal,
        }).then(resp =>{
            console.log(resp);
            return resp
        }).catch(err=>{
            console.log(err);
            return err
        })
        return resultado
    }
    
    async function qry_get_answer(params){
        resultado = await models.cawi_preguntas.findAll({
            attributes:[
                ['cpr_codigo',"codigo_pregunta"],
                ['cpr_pregunta','Pregunta'],
                ['cpr_obligatorio','Requerido'],
                ['cpr_tipo', 'Categoria'],
            ],
            where:{
                cpr_can_codigo : params.cod_encuesta
            },
            include:[{
                model: models.cawi_encabezado,
                as: 'cpr_can_codigo_cawi_encabezado',
                attributes:[],
                where:{
                    can_afi_codigo: params.afiliacion,
                }
            },{
                model: models.cawi_respuestas,
                as: "cawi_respuesta",
                attributes:[
                    ["cre_llave","Llave"],
                    ['cre_respuesta', "Respuesta"],
                    ['cre_fecha', "Fecha"],
                    ['cre_sucursal', "Sucursal"]
                ]
    
            }]
        }).then(ask =>{
            return ask
        }).catch(err=>{
            return err
        })
        return resultado;
    }
    
    async function qry_get_validate_ask_anser(params){
        resultado = await models.cawi_respuestas.findAll({
            attributes:[
                ["cre_llave","llave"]
            ],
            where:{
                cre_llave : params.llave,
                cre_estado: 1
            }
        }).then(ask => {
            return ask
        }).catch(err=>{
            return err
        });
        return resultado;
    }

    async function get_all_answers(params){
        resultado = await models.cawi_respuestas.findAll({            
            
        }).then(ask => {
            return ask
        }).catch(err=>{
            return err
        });
        return resultado;
    }

    async function get_not_mapped_answers(){
        resultado = await models.cawi_respuestas.findAll({
            where:{
                map_status: 0,
                //cre_can_codigo: 4,
                //cre_cpr_codigo: 15,
                //cre_llave: '1638392215'
            }
            
        }).then(ask => {
            return ask
        }).catch(err=>{
            return err
        });
        return resultado;
    }

    async function update_map_answer_status(params){
            return await models.cawi_respuestas.update({
                map_status: 1    
            },{
                where: {
                    cre_can_codigo: params.cre_can_codigo,
                    cre_cpr_codigo: params.cre_cpr_codigo,
                    cre_llave: params.cre_llave,
                    map_status: 0
                }
                
            })
    }

    async function insert_ms_map_answer(params){
        resultado = await msmodels.cawi_respuestas.create({
            cre_can_codigo: params.cre_can_codigo,
            cre_cpr_codigo: params.cre_cpr_codigo,
            cre_llave: params.cre_llave,
            cre_estado: params.cre_estado,
            cre_respuesta: params.cre_respuesta,
            cre_mesa: params.cre_mesa,
            cpr_cuenta: params.cpr_cuenta,
            cre_total: params.cre_total,
            cre_fecha: params.cre_fecha,
            cre_sucursal: params.cre_sucursal
        }).then(resp =>{
            //console.log(resp);
            return resp
        }).catch(err=>{
            console.log(err);
            return err
        })
        return resultado
    }

    async function get_all_headers(params){
        resultado = await models.cawi_encabezado.findAll({
        }).then(ask => {
            return ask
        }).catch(err=>{
            return err
        });
        return resultado;
    }

    async function get_all_ms_headers(params){
        resultado = await msmodels.cawi_encabezado.findAll({
        }).then(ask => {
            return ask
        }).catch(err=>{
            return err
        });
        return resultado;
    }

    async function insert_ms_header(params){
        resultado = await msmodels.cawi_encabezado.create({
            can_codigo: params.can_codigo,
            can_afi_codigo: params.can_afi_codigo,
            can_nombre: params.can_nombre,
            can_activo: params.can_activo,
            can_categoria: params.can_categoria
        }).then(resp =>{
            //console.log(resp);
            return resp
        }).catch(err=>{
            console.log(err);
            return err
        })
        return resultado
    }

    async function get_not_mapped_cupon_list(params){
        resultado = await models.cpn_listado.findAll({
            where:{
                map_status: 0,
                //cre_can_codigo: 4,
                //cre_cpr_codigo: 15,
                //cre_llave: '1638392215'
            }
        }).then(ask => {
            return ask
        }).catch(err=>{
            return err
        });
        return resultado;
    }

    async function insert_ms_cupon(params){
        resultado = await msmodels.cpn_listado.create({
            cpl_codigo: params.cpl_codigo,
            cpl_afi_codigo: params.cpl_afi_codigo,
            cpl_descripcion: params.cpl_descripcion,
            cpl_nombre: params.cpl_nombre,
            cpl_telefono: params.cpl_telefono,
            cpl_correo: params.cpl_correo,
            cpl_estado: params.cpl_estado,
            cpl_llave: params.cpl_llave,
            cpl_campania: params.cpl_campania,
            cpl_categoria: params.cpl_categoria,
            cpl_fecha_vence: params.cpl_fecha_vence
        }).then(resp =>{
            //console.log(resp);
            return resp
        }).catch(err=>{
            console.log(err);
            return err
        })
        return resultado
    }
    

    async function update_map_cupon_status(params){
        return await models.cpn_listado.update({
            map_status: 1    
        },{
            where: {
                cpl_codigo: params.cpl_codigo,
                map_status: 0
            }
            
        })
    }

    async function get_all_questions(params){
        resultado = await models.cawi_preguntas.findAll({
        }).then(ask => {
            return ask
        }).catch(err=>{
            return err
        });
        return resultado;
    }

    async function get_all_ms_questions(params){
        resultado = await msmodels.cawi_preguntas.findAll({
        }).then(ask => {
            return ask
        }).catch(err=>{
            return err
        });
        return resultado;
    }

    async function insert_ms_question(params){
        resultado = await msmodels.cawi_preguntas.create({
            cpr_codigo: params.cpr_codigo,
            cpr_can_codigo: params.cpr_can_codigo,
            cpr_pregunta: params.cpr_pregunta,
            cpr_obligatorio: params.cpr_obligatorio,
            cpr_tipo: params.cpr_tipo
        }).then(resp =>{
            //console.log(resp);
            return resp
        }).catch(err=>{
            console.log(err);
            return err
        })
        return resultado
    }

    async function get_all_options_answers(params){
        resultado = await models.cawi_opciones_respuestas.findAll({
        }).then(ask => {
            return ask
        }).catch(err=>{
            return err
        });
        return resultado;
    }
    async function get_all_ms_options_answers(params){
        resultado = await msmodels.cawi_opciones_respuestas.findAll({
        }).then(ask => {
            return ask
        }).catch(err=>{
            return err
        });
        return resultado;
    }

    async function insert_ms_option_answer(params){
        resultado = await msmodels.cawi_opciones_respuestas.create({
            cop_codigo: params.cop_codigo,
            cop_cpr_codigo: params.cop_cpr_codigo,
            cop_opcion: params.cop_opcion
        }).then(resp =>{
            //console.log(resp);
            return resp
        }).catch(err=>{
            console.log(err);
            return err
        })
        return resultado
    }

    return{
        qry_get_cawi,
        qry_get_cawi_ask,
        qry_set_answer,
        qry_get_answer,
        qry_get_validate_ask_anser,
        get_all_answers,
        get_not_mapped_answers,
        update_map_answer_status,
        insert_ms_map_answer,
        get_not_mapped_cupon_list,
        insert_ms_cupon,
        update_map_cupon_status,
        get_all_headers,
        get_all_ms_headers,
        insert_ms_header,
        get_all_questions,
        get_all_ms_questions,
        insert_ms_question,
        get_all_options_answers,
        get_all_ms_options_answers,
        insert_ms_option_answer
    };
}

module.exports = cawiRepository();
*/