
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
                    //user_id: params.userId,
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

    let assignUserToOrderEmergency = async(params) => {
        console.log(params)
        return await models.MDW_User_Order.create({
            order_id: params.orderId,
            user_id: params.userId,
            status: params.status,
            initial_date: Sequelize.fn('GETDATE'),
            geo_localization: params.geolocalization,
            is_active: 0
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
                attributes: [
                    "id",
                    "first_name",
                    "last_name",
                    "email",
                    "code",
                    "dpi",
                    "user_type",
                    "enterprise_id",
                    "status"
                ],
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
                            [Op.notIn]: [5,6,7,8,9]
                        }
                    }
                }]
            },
            ]
        });
    }

    let getAssignedUsers = async (userType) => {
        return await  models.MDW_User_Store.findAll({
            where: {
                status: 1,
            },
            include: [{
                model: models.MDW_User,
                as: 'user',
                required: true,
                where: {
                    user_type: userType
                },
                attributes: [
                    "id",
                    "first_name",
                    "last_name",
                    "email",
                    "code",
                    "dpi",
                    "user_type",
                    "enterprise_id",
                    "status"
                ],
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
                            [Op.notIn]: [5,6,7,8,9]
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
            attributes: [
                "id",
                "first_name",
                "last_name",
                "email",
                "code",
                "dpi",
                "user_type",
                "enterprise_id",
                "status"
            ],
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

    let getUserByCredential = async (params) => {
        return await  models.MDW_User.findOne({
            where: {
                email: params.username,
                password: params.token
            },
            include: [
                {
                    model: models.MDW_User_Store,
                    as: 'MDW_User_Stores',
                    required: false,
                    where: {
                        status: 1
                    },
                }
            ],
            attributes: [
                "id",
                "first_name",
                "last_name",
                "email",
                "code",
                "dpi",
                "user_type",
                "enterprise_id",
                "status"
            ]
        });
    }

    let getUserByDpiCredential = async (params) => {
        return await  models.MDW_User.findOne({
            where: {
                dpi: params.username,
                password: params.token
            },
            include: [
                {
                    model: models.MDW_User_Store,
                    as: 'MDW_User_Stores',
                    required: false,
                    where: {
                        status: 1
                    },
                }
            ],
            attributes: [
                "id",
                "first_name",
                "last_name",
                "email",
                "code",
                "dpi",
                "user_type",
                "enterprise_id",
                "status"
            ]
        });
    }

    let getUserByEmail = async (params) => {
        return await  models.MDW_User.findAll({
            where: {
                email: params.username
            },
            attributes: [
                "id",
                "first_name",
                "last_name",
                "email",
                "code",
                "dpi",
                "user_type",
                "enterprise_id",
                "status"
            ]
        });
    }

    let getUserByCode = async (params) => {
        return await  models.MDW_User.findAll({
            where: {
                code: params.code
            },
            attributes: [
                "id",
                "first_name",
                "last_name",
                "email",
                "code",
                "dpi",
                "user_type",
                "enterprise_id",
                "status"
            ]
        });
    }

    let getUserByDpi = async (params) => {
        return await  models.MDW_User.findAll({
            where: {
                dpi: params.dpi
            },
            attributes: [
                "id",
                "first_name",
                "last_name",
                "email",
                "code",
                "dpi",
                "user_type",
                "enterprise_id",
                "status"
            ]
        });
    }

    let createUser = async(params) => {
        return await models.MDW_User.create({
            first_name: params.firstName,
            last_name: params.lastName,
            email: params.email,
            password: params.password,
            code: params.code,
            dpi: params.dpi,
            user_type: params.userType,
            enterprise_id: params.enterpriseId,
            store_id: 1,
            status: 1
        }).then( async resp =>{
            return resp
        }).catch(err=>{
            console.log(err);
            return err
        })
    }

    let updateUser = async (params) => {
        return await  models.MDW_User.update({
                first_name: params.firstName,
                last_name: params.lastName,
                email: params.email,
                code: params.code,
                dpi: params.dpi,
                user_type: params.userType,
                enterprise_id: enterpriseId,
            },
            {
                where: {
                    user_id: params.userId
                }
            }).then( async resp =>{
                return resp
            }).catch(err=>{
                console.log(err);
                return err
            })
    }

    let deactiveUser = async () => {
        return await  models.MDW_User.update({
                status: 0
            },
            {
                where: {
                    user_id: params.userId
                }
            }).then( async resp =>{
                return resp
            }).catch(err=>{
                console.log(err);
                return err
            })
    }

    let updateUserPassword = async (params) => {
        return await  models.MDW_User.update({
                password: params.password,
            },
            {
                where: {
                    user_id: params.userId
                }
            }).then( async resp =>{
                return resp
            }).catch(err=>{
                console.log(err);
                return err
            })
    }

    let getAllEnterprises = async () => {
        return await  models.MDW_Enterprise.findAll({
            where: {
                status: 1
            },
        });
    }

    let getAllUsersAssignedToStore = async () => {
        return await  models.MDW_User.findAll({
            where: {
                status: 1
            },
            include: [
                {
                    model: models.MDW_User_Store,
                    as: 'MDW_User_Stores',
                    required: true,
                    where: {
                        status: 1
                    },
                }
            ],
            attributes: [
                "id",
                "first_name",
                "last_name",
                "email",
                "code",
                "dpi",
                "user_type",
                "enterprise_id",
                "status"
            ]
        });
    }

    let getAllUsers = async () => {
        return await  models.MDW_User.findAll({
            where: {
                status: 1
            },
            attributes: [
                "id",
                "first_name",
                "last_name",
                "email",
                "code",
                "dpi",
                "user_type",
                "enterprise_id",
                "status"
            ]
        });
    }

    let createEnterprise = async(params) => {
        console.log(params)
        return await models.MDW_Enterprise.create({
            name: params.name,
            country: params.country,
            city:params.city,
            status: 1
        }).then( async resp =>{
            return resp
        }).catch(err=>{
            console.log(err);
            return err
        })
    }

    let getEnterpriseByName = async (params) => {
        return await  models.MDW_Enterprise.findAll({
            where: {
                name: params.name
            }
        });
    }

    return {
        assignUserToStore,
        assignUserToOrder,
        getUsersByStoreAndType,
        getStoreAssignedUsers,
        getAllStores,
        getAssignedPilotsByStore,
        getAssignedUsers,
        getAllUsersByType,
        disablePilotFromStore,
        getAsignedUsersByOrder,
        assignUserToOrderEmergency,
        getAllActiveOrdersByPilot,
        getUserByCredential,
        getUserByDpiCredential,
        getUserByEmail,
        getUserByCode,
        getUserByDpi,
        createUser,
        updateUser,
        deactiveUser,
        updateUserPassword,
        getAllEnterprises,
        getAllUsers,
        getAllUsersAssignedToStore,
        createEnterprise,
        getEnterpriseByName
    }

}

module.exports = UserRepository();