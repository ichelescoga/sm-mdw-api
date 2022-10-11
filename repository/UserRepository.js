
const sequelize = require('../components/conn_sqlz');
let initModels = require("../src/modelsSm/init-models");
const OrderRepository = require('./OrderRepository');
let models = initModels(sequelize);
const Sequelize = require('sequelize');
const { Op } = require("sequelize");
let UserRepository = function () {

    let assignUserToStore = async(params) => {
        console.log(params)
        return await models.MDW_User_Store.create({
            store_id: params.storeId,
            user_id: params.userId,
            status: 1
        }).then( async resp =>{
            newAssign = resp.dataValues.id
            await models.MDW_User_Store.update({
                status: 0,
                end_date: Sequelize.fn('GETDATE')
            },{
                where: {
                    status: 1,
                    store_id: params.storeId,
                    user_id: params.userId,
                    id: {
                        [Op.notIn]: [newAssign]
                    }
                    
                }
            }
            )
            return resp
        }).catch(err=>{
            console.log(err);
            return err
        })
    }

    let assignUserToOrder = async(params) => {
        console.log(params)
        return await models.MDW_User_Order.create({
            order_id: params.orderId,
            user_id: params.userId,
            status: params.status,
            initial_date: Sequelize.fn('GETDATE'),
            geo_localization: '',
            is_active: 1
        }).then( async resp =>{
            newAssign = resp.dataValues.id
            await models.MDW_User_Order.update({
                is_active: 0,
                end_date: Sequelize.fn('GETDATE')
            },{
                where: {
                    is_active: 1,
                    order_id: params.orderId,
                    user_id: params.userId,
                    id: {
                        [Op.notIn]: [newAssign]
                    }
                    
                }
            }
            )
            return resp
        }).catch(err=>{
            console.log(err);
            return err
        })
    }

    let getUsersByStoreAndType = async (params) => {
        return await  models.MDW_User_Store.findAll({
            where: {
                store_id: params.storeId,
                status: 1,
                user_type: params.userType
            },
        });
    }

    let getStoreAssignedUsers = async (userType) => {
        return await  models.MDW_User_Store.findAll({
            where: {
                status: 1,
            },
        });
    }

    let getAssignedPilotsByStore = async (storeId) => {
        return await  models.MDW_User_Store.findAll({
            where: {
                status: 1,
                store_id: storeId
            },
            include: [{
                model: models.MDW_User,
                as: 'user',
                required: true,
                where: {
                    user_type: 3
                },
                include: [{
                    model: models.MDW_Enterprise,
                    as: 'enterprise',
                    required: true
                    },
                ]
            },
            ]
        });
    }

    let getAsignedUsersByOrder = async (params) => {
        return await  models.MDW_User_Order.findAll({
            where: {
                status: 1,
                //user_type: params.userType
            },
            /*include: [{
                model: models.MDW_Order,
                as: 'MDW_Order',
                require: true,
                where: {
                    id: params.storeId        
                }
            },                
            ]*/
        });
    }

    let disablePilotFromStore = async (params) => {

        return await  models.MDW_User_Store.update({
                status: 0,
                end_date: Sequelize.fn('GETDATE')
            },
            {
                where: {
                    user_id: params.userId,
                    store_id: params.storeId,
                    status: 1
                }
            }).then( async resp =>{
                return resp
            }).catch(err=>{
                console.log(err);
                return err
            })
    }

    let getAllUsersByType = async (userType) => {
        return await  models.MDW_User.findAll({
            where: {
                status: 1,
                user_type: userType
            },
            include: [{
                model: models.MDW_Enterprise,
                as: 'enterprise',
                required: true
                },
            ]
        });
    }

    let getAllStores = async () => {
        return await  models.MDW_Store.findAll({
            where: {
                status: 1
            },
        });
    }

    return {
        assignUserToStore,
        assignUserToOrder,
        getUsersByStoreAndType,
        getStoreAssignedUsers,
        getAllStores,
        getAssignedPilotsByStore,
        getAllUsersByType,
        disablePilotFromStore,
        getAsignedUsersByOrder
    }

}

module.exports = UserRepository();