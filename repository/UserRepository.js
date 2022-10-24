
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
            geo_localization: params.geolocalization,
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
                    {
                    model: models.MDW_User_Order,
                    as: 'MDW_User_Orders',
                    required: false,
                    where:{
                        is_active: 1,
                        status: {
                            [Op.notIn]: [5]
                        }
                    }
                }]
            },
            ]
        });
    }

    let getAsignedUsersByOrder = async (params) => {
        return await  models.MDW_User_Order.findAll({
            where: {
                is_active: 1,
                //user_type: params.userType
            },
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

    let getAllActiveOrdersByPilot = async (params) => {
        return await  models.MDW_User_Order.findAll({
            where: {
                user_id: params.userId,
                status: {
                    [Op.notIn]: [5,6,7,8,9]
                },
                is_active: 1
            },
            include: [
                {
                    model: models.MDW_Order,
                    as: 'order',
                    required: true,
                    include: [
                        {
                            model: models.MDW_Order_Detail,
                            as: 'MDW_Order_Details',
                            required: true,
                            include:[{
                                model: models.MDW_Product,
                                as: 'product',
                                required: true,
                            }]
                        },
                        {
                                model: models.MDW_Client,
                                as: 'client',
                                required: true
                        },
                        {
                                model: models.MDW_Order_Store,
                                as: 'MDW_Order_Stores',
                                required: true,
                                where: {
                                    store_id: params.storeId
                                }
                        }
                    ]
                },
            ]
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
        getAsignedUsersByOrder,
        getAllActiveOrdersByPilot
    }

}

module.exports = UserRepository();