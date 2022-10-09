const crypto = require('crypto');
const jwt = require('jsonwebtoken')

const sequelize = require('../components/conn_sqlz');
var initModels = require('../src/models/init-models')
var models = initModels(sequelize);

const sr_afiliado = require ('../repository/afiliado')

exports.set_token = async(req, res, next)=>{
    jwt.verify(req.token, 'SMB_2016', async(error, authData)=>{
        if (error) {
            res.sendStatus(403);
        } else {
            if (authData.afiliado = '75ae66aa1d') {
                let resultado = await qry_get_afiliado(req);
                let afiliado =[]
                resultado = JSON.parse(JSON.stringify(resultado))
                if (resultado.length != 0){
                    let upd = await qry_update_afiliado_jwt(req);
                    upd = JSON.parse(JSON.stringify(upd))
                    let json_afiliado
                    if(typeof upd.parent == "undefined"){
                        //creamos el codigo aleatorio para el afiliado
                        let token = crypto.randomBytes(5).toString('hex')
                        //creamos el json de respuesta y de creacion del jwt
                        json_afiliado = {
                            state:{
                                error:  '200',
                                title:  'Ok',
                                text:   'Codigo de afiliado encontrado correctamente.'
                            },data:{
                                codigo:     resultado[0].Afiliado,
                                nombre:     resultado[0].Nombre,
                                nit:        resultado[0].NIT,
                                direccion:  resultado[0].Direccion,
                                token:      token
                            }
                        }
                        //obtenemos el jwt basados en el json
                        let Authorization = jwt.sign({
                            afiliado: json_afiliado.data,
                            iat:Math.floor(Date.now()/1000)-3
                        },
                        'SMB_2016')
                        //agregamos el JWT al json
                        json_afiliado.data.Auth = Authorization
                        let insert = await qury_insert_afiliado_jwt(resultado[0].Afiliado, Authorization)
                    }else{
                        json_afiliado = {
                            state:{
                                error:  '204',
                                title:  'No Content',
                                text:   'Hubo un error, notificar a proveedro.'
                            },data:{}
                        }
                    }
                    afiliado = json_afiliado
                }else{
                    let json_afiliado = {
                        state:{
                            error:  '204',
                            title:  'No Content',
                            text:   'Codigo de afiliado no encontrado, favor de revisar sus datos.'
                        },
                        data:{
                            codigo:     "",
                            nombre:     "",
                            nit:        "",
                            direccion:  "",
                            token:      "",
                            Authorization: "",
                        }
                    }
                    afiliado = json_afiliado
                }
                /*let parametros = {
                    codigo_afiliado : req.body.afiliado
                }
                let resultado = await sr_afiliado.get_afiliado(parametros)
                let datos_afiliado = resultado[0][0]
                let afiliado =[]
                if (datos_afiliado == undefined) {
                    let json_afiliado = {
                        state:{
                            error:  '204',
                            title:  'No Content',
                            text:   'Codigo de afiliado no encontrado, favor de revisar sus datos.'
                        },
                        data:{
                            codigo:     "",
                            nombre:     "",
                            nit:        "",
                            direccion:  "",
                            token:      "",
                            Authorization: "",
                        }
                    }
                    afiliado = json_afiliado
                }else{
                    //creamos el codigo aleatorio para el afiliado
                    let token = crypto.randomBytes(5).toString('hex')
                    //creamos el json de respuesta y de creacion del jwt
                    let json_afiliado = {
                        state:{
                            error:  '200',
                            title:  'Ok',
                            text:   'Codigo de afiliado encontrado correctamente.'
                        },
                        data:{
                            codigo:     datos_afiliado.afi_codigo,
                            nombre:     datos_afiliado.afi_nombre,
                            nit:        datos_afiliado.afi_nit,
                            direccion:  datos_afiliado.afi_direccion,
                            token:      token
                        }
                    }
                    // obtenemos el jwt basados en el json
                    let Authorization = jwt.sign(
                        {
                            afiliado: json_afiliado.data,
                            iat:Math.floor(Date.now()/1000)-3
                        },
                        'SMB_2016'
                    )
                    //agregamos el JWT al json
                    json_afiliado.data.Auth = Authorization
                    //insertamos la respuesta a la base de datos.
                    let set_newtoken = {
                        codigo:datos_afiliado.afi_codigo,
                        Auth: Authorization
                    }
                    await sr_afiliado.set_afiliado(set_newtoken);
                    afiliado = json_afiliado
                }*/
                res.json(afiliado)                
            }else{
                res.sendStatus(404)
            }

        }
    })
}

async function qry_get_afiliado(req){

    let resultado = await models.cli_afiliados.findAll({
        attributes:[
            ['afi_codigo','Afiliado']
            ,['afi_nombre','Nombre']
            ,['afi_nit','NIT']
            ,['afi_direccion','Direccion']
        ],
        where:{
            afi_codigo: req.body.afiliacion
        }
    }).then(result =>{
        return result;
    }).catch(err=>{
        return err
    })
    return resultado
}

async function qry_update_afiliado_jwt(req){
    let update = await models.cli_afiliado_jwt.update(
        {
            jwt_estado : 0
        },{where:{
            jwt_cif_codigo : req.body.afiliacion
        }}
    ).then(upd=>{
        return upd;
    }).catch(err=>{
        return err;
    })
    return update;
}
async function qury_insert_afiliado_jwt(afiliado, token){
    let insert = await models.cli_afiliado_jwt.create({
        jwt_cif_codigo:afiliado,
        jwt_token:token,
        jwt_estado:1
    }).then(ins=>{
        return ins
    }).catch(err=>{
        return err
    })
    return insert;
}