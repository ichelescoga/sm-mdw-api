
const sequelize = require('../components/conn_sqlz');
let initModels = require("../src/modelsSm/init-models")
let models = initModels(sequelize);

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
            take_out_price: params.takeOutPrice
        }).then(resp =>{
            console.log(resp);
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
            order_type: 1, /******************************************** */ 
            payment_authorization: '12345', /********************************* */
            payment_change: 0, /******************************************** */
            payment_amount: parseFloat(params.tenderAmount),
            observations: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx', /*********************************** */
            status: 1,
            client_id: params.clientId
        }).then( async resp =>{
            console.log("resp:")
            console.log(resp);
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
        }).then(resp =>{
            console.log(resp);
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


    let getAllMdwOrdersByStatus = async (status) => {
        return await  models.MDW_Order.findAll({
            where: {
                status: status
            },/*
            attributes: [
                "client",
                "origin_date",
            ],*/
            
            include: [{
                model: models.MDW_Order_Detail,
                as: 'MDW_Order_Details',
                required: true
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

    return {
        getAllOrders,
        createRawOrder,
        createRawOrderDetail,
        createMiddlewareOrder,
        createMiddlewareOrderDetail,
        createMiddlewareClient,
        getAllMdwOrdersByStatus,
        getProductBySku
    }

}

module.exports = OrderRepository();