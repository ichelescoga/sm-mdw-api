
const sequelize = require('../components/conn_sqlz');
let initModels = require("../src/modelsSm/init-models")
let models = initModels(sequelize);
const Sequelize = require('sequelize');
const { Op } = require("sequelize");
let OrderRepository = function () {

    let getAllOrders = async() =>{
        return await models.Order_Raw.findAll({            
        })
    }

    let createRawOrder = async(params) => {
        console.log("create order raw with id: " + params.orderInfoId)
        return await models.Order_Raw.create({
            customer_info_id: params.customerInfoId.toString(),
            store_info_id: params.storeInfoId,
            order_info_id: params.orderInfoId.toString(),
            customer_address: params.customerAddress,
            customer_country: params.customerCountry,
            customer_city: params.customerCity,
            customer_phone: params.customerPhone,
            customer_first_name: params.customerFirstName.toString(),
            customer_last_name: params.customerLastName,
            customer_email: params.customerEmail,
            tender_info_id: params.tenderInfoId,
            payment_type: params.paymentType,
            payment_balance: 0.00,
            tender_amount: parseFloat(params.tenderAmount),
            tender_id: params.tenderId,
            reference_number: params.referenceNumber.toString(),
            order_timer: params.orderTimer,
            order_mode: params.orderMode,
            origin: params.origin
        }).then( async resp =>{
            console.log("resp:")
            console.log(resp);
            newOrderId = resp.dataValues.id
            return resp
        }).catch(err=>{
            console.log(err);
            return err
        })
    }

    let createRawOrderDetail = async(params) => {
        //console.log("create order detail raw with id: " + params.orderInfoId)
        //console.log(params)
        return await models.Order_Raw_Item.create({
            order_raw_id: params.orderRawId,
            item_level: params.itemLevel,
            item_id: params.itemId,
            item_price: params.itemPrice,
            item_quantity: params.itemQuantity,
            item_group_id: params.itemGroupId,
            take_out_price: params.takeOutPrice,
            payment_type: params.paymentType,
            message: params.message,
            parent_sku: params.parentSku,
            parent_id: params.parentRawId,
            comment: params.productComment
        }).then(resp =>{
            //console.log(resp);
            return resp
        }).catch(err=>{
            console.log(err);
            return err
        })
    }

    let createMiddlewareOrder = async(params) => {
        console.log("create order raw with id: " + params.orderInfoId)
        return await models.MDW_Order.create({
            origin_store_id: params.orderInfoId.toString(),
            origin_type: params.originType,
            aloha_store: params.alohaStore,
            order_number: params.orderRawId.toString(),
            //origin_date: new Date(params.orderTimer),
            payment_type: params.paymentType,
            order_type: params.typeOrder,
            payment_authorization: params.paymentAuthorization, 
            payment_change: params.paymentChange, 
            payment_amount: parseFloat(params.tenderAmount),
            observations: params.observations,
            status: 1,
            client_id: params.clientId,
            order_raw_id: params.orderRawId,
            delivery_day: params.deliveryDay,
            context_path: params.tenderPath,
            status_date: Sequelize.fn('GETDATE'),

            desc_cpn_callcenter: params.descCpnCallCenter,
            amount_cpn_callcenter: params.amountCpnCallCenter,
            cupon: params.cupon,
            descrip_cpn: params.descripCpn,
            amount_cpn: params.amountCpn,
            sms_cpn: params.smsCpn,
        }).then( async resp =>{
            console.log("resp:")
            console.log(resp);
            return resp
        }).catch(err=>{
            console.log(err);
            return err
        })
    }



    let assignOrderToStore = async(params) => {
        return await models.MDW_Order_Store.create({
            store_id: params.storeId,
            order_id: params.orderId,
            status: 1,
            create_date: Sequelize.fn('GETDATE'),
        }).then( async resp =>{
            newAssign = resp.dataValues.id
            await models.MDW_Order_Store.update({
                status: 0,
                end_date: Sequelize.fn('GETDATE')
            },{
                where: {
                    status: 1,
                    store_id: params.storeId,
                    order_id: params.orderId,
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

    let createMiddlewareOrderDetail = async(params) => {
        console.log(params)
        return await models.MDW_Order_Detail.create({
            order_id: params.orderId,
            sku: params.itemId,
            quantity: params.itemQuantity,
            amount: params.itemPrice === '' ? 0: parseFloat(params.itemPrice),
            level: params.itemLevel,
            product_id: params.productId,
            parent_sku: params.parentSku,
            parent_id: params.parentId,
            comment: params.productComment
        }).then(resp =>{
            //console.log(resp);
            return resp
        }).catch(err=>{
            console.log(err);
            return err
        })
    }

    let createMiddlewareClient = async(params) => {
        return await models.MDW_Client.create({
            nit: params.nit,
            name: params.name,
            address: params.address,
            phone: params.phone,
            email: params.email,
            alternate_phone: params.alternatePhone, /******************************************** */ 
            status: 1,
            delivery_address: params.deliveryAddress
        }).then( async resp =>{
            console.log("resp:")
            console.log(resp);
            return resp
        }).catch(err=>{
            console.log(err);
            return err
        })
    }

    let createMiddlewareClientDetail = async(params) => {
        return await models.MDW_Detail_Client.create({
            id_client: params.clientId,
            nit: params.nit,
            address: params.address,
            direction: params.deliveryAddress,
            country: params.country,
            city: params.city
        }).then( async resp =>{
            return resp
        }).catch(err=>{
            console.log(err);
            return err
        })
    }

    let getMiddlewareClientByPhone = async (params) => {
        return await  models.MDW_Client.findAll({
            where: {
                phone: params.phone
            },            
            include: [{
                model: models.MDW_Detail_Client,
                as: 'MDW_Detail_Clients',
                required: true,                
                },
            ]
        });
    }


    let getAllMdwOrdersByStatus = async (params) => {
        return await  models.MDW_Order.findAll({
            where: {
                order_type: params.orderType,
                status: {
                    [Op.notIn]: [5,0]
                }
            },            
            include: [{
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
        });
    }

    let getAllMdwOrdersWithoutType = async (params) => {
        return await  models.MDW_Order.findAll({
            where: {
                status: {
                    [Op.notIn]: [5,0]
                }
            },            
            include: [{
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
        });
    }

    let getAllDeliveredMdwOrdersByDay = async (params) => {
        
        
        return await  models.MDW_Order.findAll({
            where: {
                status: 5
            },
            order: [
                ['id', 'ASC']
            ],
            include: [{
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
                },
                {
                    model: models.MDW_User_Order,
                    as: 'MDW_User_Orders',
                    required: true,
                    where: {
                        status: 5,
                        end_date: {
                            [Op.gt]: params.initialDate,
                            [Op.lt]: params.endDate
                        }
                    }
                }
            ]
        });
    }

    let getAllDeliveredMdwOrdersByDayAndAssignation = async (params) => {
        
        
        return await  models.MDW_Order.findAll({
            where: {
                status: 5
            },
            order: [
                ['id', 'ASC']
            ],
            include: [{
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
                },
                {
                    model: models.MDW_User_Order,
                    as: 'MDW_User_Orders',
                    required: true,
                    where: {
                        //status: 5,
                        status: {
                            [Op.in]: [3, 4, 5]
                        },
                        end_date: {
                            [Op.gt]: params.initialDate,
                            [Op.lt]: params.endDate
                        }
                    }
                }
            ]
        });
    }

    let getAllAssignedMdwOrdersByDay = async (params) => {
        return await  models.MDW_Order.findAll({
            where: {
                status: {
                    [Op.notIn]: [0, 1]
                }
            },            
            include: [{
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
                },
                {
                    model: models.MDW_User_Order,
                    as: 'MDW_User_Orders',
                    required: true,
                    where: {
                        status: {
                            [Op.notIn]: [0, 1]
                        },
                        end_date: {
                            [Op.gt]: params.initialDate,
                            [Op.lt]: params.endDate
                        }
                    },
                    include: [{
                        model: models.MDW_User,
                        as: 'user',
                        required: false,
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
                    }]
                }
            ]
        });
    }

    let getAllUnassignedMdwOrdersByDay = async (params) => {
        return await  models.MDW_Order.findAll({
            where: {
                status: {
                    [Op.in]: [0, 1]
                }
            },            
            include: [{
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
        });
    }

    let getAllMdwOrders = async () => {
        return await  models.MDW_Order.findAll({
            where: {
                //order_type: params.orderType,
                status: {
                    [Op.notIn]: [0]
                }
            },            
            include: [{
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
                    /*where: {
                        store_id: params.storeId
                    }*/
                    include:[{
                        model: models.MDW_Store,
                        as: 'store',
                        required: true
                    }]
                },
                {
                    model: models.MDW_User_Order,
                    as: 'MDW_User_Orders',
                    required: false,
                    where: {
                        is_active: 1
                    },
                    include: [{
                        model: models.MDW_User,
                        as: 'user',
                        required: false,
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
                    }]
                }
            ]
        });
    }

    let getAllMdwOrdersByStore = async (params) => {
        if (params.status === '0'){
            return await  models.MDW_Order.findAll({
                where: {
                    status: {
                        [Op.notIn]: [params.status]
                    },
                    status_date: {
                        [Op.gte]: params.initialDate,
                        [Op.lte]: params.endDate
                    }
                },            
                include: [{
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
                        },
                        include:[{
                            model: models.MDW_Store,
                            as: 'store',
                            required: true
                        }]
                    }
                ]
            });
        }
        else{
            return await  models.MDW_Order.findAll({
                where: {
                    status: params.status,
                    status_date: {
                        [Op.gte]: params.initialDate,
                        [Op.lte]: params.endDate
                    }
                    /*status: {
                        [Op.in]: [5]
                    }*/
                },            
                include: [{
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
                        },
                        include:[{
                            model: models.MDW_Store,
                            as: 'store',
                            required: true
                        }]
                    }
                ]
            });
        }        
    }

    let getMdwOrderAndDetail = async (orderId) => {
        return await  models.MDW_Order.findOne({
            where: {
                id: orderId
            },            
            include: [{
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
                    model: models.MDW_User_Order,
                    as: 'MDW_User_Orders',
                    required: false,
                    where: {
                        is_active: 1
                    },
                    include: [{
                        model: models.MDW_User,
                        as: 'user',
                        required: false,
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
                    }]
                }
            ]
        });
    }

    let getMdwOrderAndDetailWithoutStatus = async (orderInfoId, storeId) => {
        return await  models.MDW_Order.findAll({
            where: {
                origin_store_id: orderInfoId
            },
            include: [{
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
                        store_id: storeId
                    }                    
                }             
            ]
        });
    }

    let getMdwOrderAssignedUsers = async (orderInfoId, storeId) => {
        return await models.MDW_User_Order.findAll({
            include: [
                {
                    model: models.MDW_User,
                    as: 'user',
                    required: true,
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
                },
                {
                    model: models.MDW_Order,
                    as: 'order',
                    required: true,
                    where: {
                        origin_store_id: orderInfoId
                    },
                    include: [
                        {
                            model: models.MDW_Order_Store,
                            as: 'MDW_Order_Stores',
                            required: true,
                            where: {
                                store_id: storeId
                            }                    
                        }
                    ]
                }
            ]
        })
    }

    let getMdwAssignsByUserAndDate = async (params) => {
        return await models.MDW_User.findAll({
            where: {
                code: params.code,
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
            include: [
                {
                    model: models.MDW_User_Order,
                    as: 'MDW_User_Orders',
                    required: true,
                    where: {
                        end_date: {
                            [Op.gt]: params.initialDate,
                            [Op.lt]: params.endDate
                        }
                    },
                    include: [
                        {
                            model: models.MDW_Order,
                            as: 'order',
                            required: true,
                            include: [
                                {
                                    model: models.MDW_Order_Store,
                                    as: 'MDW_Order_Stores',
                                    required: true,
                                    where: {
                                        store_id: params.storeId
                                    }                    
                                }
                            ]
                        }
                    ]
                }
            ]
        })
    }

    let getMdwAssignsByUserAndDateByStatus = async (params) => {
        return await models.MDW_User.findAll({
            where: {
                code: params.code,
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
            include: [
                {
                    model: models.MDW_User_Order,
                    as: 'MDW_User_Orders',
                    required: true,
                    where: {
                        end_date: {
                            [Op.gt]: params.initialDate,
                            [Op.lt]: params.endDate
                        },
                        status: params.status
                    },
                    include: [
                        {
                            model: models.MDW_Order,
                            as: 'order',
                            required: true,
                        }
                    ]
                }
            ]
        })
    }

    let getOrderByOriginId = async (orderInfoId, storeId) => {
        return await  models.MDW_Order.findAll({
            where: {
                origin_store_id: orderInfoId.toString()
            },
            include: [
                {
                    model: models.MDW_Order_Store,
                    as: 'MDW_Order_Stores',
                    required: true,
                    where: {
                        store_id: storeId
                    }                    
                }
            ]
        });
    }

    let getProductBySku = async (sku) => {
        return await  models.MDW_Product.findOne({
            where: {
                sku: sku,
                status: 1
            },
        });
    }

    let createProduct = async(params) => {
        return await models.MDW_Product.create({
            name: params.productName,
            status: 1,
            sku: params.itemId,
            description: params.productDescription
        }).then( async resp =>{
            console.log("resp:")
            console.log(resp);
            return resp
        }).catch(err=>{
            console.log(err);
            return err
        })
    }

    let updateProduct = async (params) => {

        return await  models.MDW_Product.update({
                name: params.productName,
                description: params.productDescription
            },
            {
                where: {
                    id: params.productId
                }
            }).then( async resp =>{
                return resp
            }).catch(err=>{
                console.log(err);
                return err
            })
    }

    let getStoreIdFromWp = async (storeInfoId) => {
        return await  models.MDW_Store.findOne({
            where: {
                id: storeInfoId
            },
        });
    }

    let getStoreIdFromYalo = async (storeInfoId) => {
        return await  models.MDW_Store.findOne({
            where: {
                yalo_code: storeInfoId
            },
        });
    }

    let getByStoreAndOrder = async (storeId, orderId) => {
        return await  models.MDW_Order_Store.findAll({
            where: {
                store_id: storeId,
                order_id: orderId,
                status: 1
            },
        });
    }
    

    let updateOrderStatus = async (params) => {

        return await  models.MDW_Order.update({
                status: params.status,
                status_date: Sequelize.fn('GETDATE')
            },
            {
                where: {
                    id: params.orderId
                }
            }).then( async resp =>{
                return resp
            }).catch(err=>{
                console.log(err);
                return err
            })
    }

    let updateOrderAlohaStatus = async (params) => {

        return await  models.MDW_Order.update({
                send_aloha: params.sendAloha,
                aloha_time_sended: Sequelize.fn('GETDATE'),
            },
            {
                where: {
                    id: params.orderId
                }
            }).then( async resp =>{
                return resp
            }).catch(err=>{
                console.log(err);
                return err
            })
    }

    let updateOrderStatusAndType = async (params) => {
        //console.log(params)
        return await  models.MDW_Order.update({
                status: params.status,
                order_type: 4,
                status_date: Sequelize.fn('GETDATE')
            },
            {
                where: {
                    id: params.orderId
                }
            }).then( async resp =>{
                return resp
            }).catch(err=>{
                console.log(err);
                return err
            })
    }

    let getUserOrder = async (orderId) => {
        return await  models.MDW_User_Order.findOne({
            where: {
                order_id: orderId,
                is_active: 1
            },
        });
    }

    let geAllUserOrder = async (orderId) => {
        return await  models.MDW_User_Order.findAll({
            where: {
                order_id: orderId
            },
            order: [
                ['id', 'ASC']
            ]
        });
    }

    let getMdwOrderById = async (orderId) => {
        return await  models.MDW_Order.findOne({
            where: {
                id: orderId
            },            
            include: [{
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
                    include:[
                        {
                            model: models.MDW_Store,
                            as: 'store',
                            required: true,
                        }
                    ]
                }
            ]
        });
    }

    let getRawOrderById = async (rawOrderId) => {
        return await models.Order_Raw.findOne({
            where: {
                id: rawOrderId
            },
            include: [
                {
                    model: models.Order_Raw_Item,
                    as: 'Order_Raw_Items',
                    required: true
                }
            ]
        })
    }

    let getStoreByWPId = async (storeWPId) => {
        return await models.MDW_Store_Map.findOne({
            where: {
                wordpress_code: storeWPId
            },
        })
    }

    let setStoreAlert = async(params) => {
        return await models.MDW_Store_Alert.create({
            store_id: params.storeId,
            updated_date: Sequelize.fn('GETDATE'),
            alert_number: params.alert,
            updated_by: params.updatedBy
        }).then( async resp =>{
            console.log("resp:")
            console.log(resp);
            return resp
        }).catch(err=>{
            console.log(err);
            return err
        })
    }

    let setOrderChange = async(params) => {
        return await models.MDW_Order_Change.create({
            order_id: params.orderId,
            updated_date: Sequelize.fn('GETDATE'),
            cash_exchange: params.cashExchange,
            updated_by: params.updatedBy
        }).then( async resp =>{
            console.log("resp:")
            console.log(resp);
            return resp
        }).catch(err=>{
            console.log(err);
            return err
        })
    }

    let getAlertByStore = async (storeId) => {
        return await models.MDW_Store_Alert.findAll({
            where: {
                store_id: storeId
            },
            order: [
                ['id', 'DESC']
            ]
        })
    }

    let getOrdersCounterByStore = async (storeId) => {
        return await models.MDW_Order.findAll({
            where: {
                status: {
                    [Op.notIn]: [0, 5]
                }
            },
            include: [
                {
                    model: models.MDW_Order_Store,
                    as: 'MDW_Order_Stores',
                    required: true,
                    where: {
                        store_id: storeId
                    },
                    attributes: []
                }
            ],
            attributes: [
                'MDW_Order.status',
                [Sequelize.fn('COUNT', Sequelize.col('MDW_Order.status')), 'counter']
            ],
            group: [
                ['MDW_Order.status']
            ],
            raw: true
        })
    }

    return {
        getAllOrders,
        createRawOrder,
        assignOrderToStore,
        createRawOrderDetail,
        createMiddlewareOrder,
        createMiddlewareOrderDetail,
        createMiddlewareClient,
        createMiddlewareClientDetail,
        getMiddlewareClientByPhone,
        getAllMdwOrdersByStatus,
        getAllMdwOrdersWithoutType,
        getAllDeliveredMdwOrdersByDay,
        getAllDeliveredMdwOrdersByDayAndAssignation,
        getAllAssignedMdwOrdersByDay,
        getAllUnassignedMdwOrdersByDay,
        getAllMdwOrders,
        getAllMdwOrdersByStore,
        getMdwOrderAndDetail,
        getMdwOrderAndDetailWithoutStatus,
        getMdwOrderAssignedUsers,
        getMdwAssignsByUserAndDate,
        getMdwAssignsByUserAndDateByStatus,
        getOrderByOriginId,
        getProductBySku,
        createProduct,
        updateProduct,
        getStoreIdFromWp,
        getStoreIdFromYalo,
        getByStoreAndOrder,
        updateOrderStatus,
        updateOrderAlohaStatus,
        updateOrderStatusAndType,
        getUserOrder,
        geAllUserOrder,
        getMdwOrderById,
        getRawOrderById,
        getStoreByWPId,
        setStoreAlert,
        setOrderChange,
        getAlertByStore,
        getOrdersCounterByStore
    }

}

module.exports = OrderRepository();