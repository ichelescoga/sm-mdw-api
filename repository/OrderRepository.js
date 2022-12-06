
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
            parent_id: params.parentRawId
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
            delivery_day: params.deliveryDay
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
            parent_id: params.parentId
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


    let getAllMdwOrdersByStatus = async (params) => {
        return await  models.MDW_Order.findAll({
            where: {
                order_type: params.orderType,
                status: {
                    [Op.notIn]: [5,0]
                }
            },/*
            attributes: [
                "client",
                "origin_date",
            ],*/
            
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

    let getStoreIdFromWp = async (storeInfoId) => {
        return await  models.MDW_Store.findOne({
            where: {
                wordpress_code: storeInfoId
            },
        });
    }

    let updateOrderStatus = async (params) => {

        return await  models.MDW_Order.update({
                status: params.status
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
                send_aloha: params.sendAloha
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
                order_type: 4
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

    return {
        getAllOrders,
        createRawOrder,
        assignOrderToStore,
        createRawOrderDetail,
        createMiddlewareOrder,
        createMiddlewareOrderDetail,
        createMiddlewareClient,
        getAllMdwOrdersByStatus,
        getMdwOrderAndDetail,
        getProductBySku,
        getStoreIdFromWp,
        updateOrderStatus,
        updateOrderAlohaStatus,
        updateOrderStatusAndType,
        getUserOrder,
        getMdwOrderById,
        getRawOrderById,
        getStoreByWPId
    }

}

module.exports = OrderRepository();