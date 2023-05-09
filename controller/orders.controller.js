const OrderRepository = require('../repository/OrderRepository')
const jwt  = require('jsonwebtoken');
const { get } = require('request');
const request = require('request');
const createError = require("http-errors");

exports.GetAllOrders = async (req, res, next) => {
    try{
        let result = await OrderRepository.getAllOrders()
        console.log(result)
        if (!result) {
            console.info("Orders was empty")
            res.json({
                success: false,
                responseType: 3,
                payload: result
            })
            return
        }

        res.json({
            success: true,
            payload: result
        })
    }
    catch(error){
        console.log(error)
        console.info(error)
        next(createError(500));
    }
}

exports.setYLLegacy = async(req, res, next)=>{
    try {

        res.json({success: false, description: 'error in structure and parse', data: req.body});
        return

        let clientParams = {}
        clientParams.nit = req.body.CustomerInfo.nit
        //clientParams.name = (req.body.Customer.FirstName? req.body.Customer.FirstName: '' ) + (req.body.Customer.LastName? ' '+req.body.Customer.LastName: '')
        clientParams.address = req.body.CustomerInfo.addresses[0].fullAddress? req.body.CustomerInfo.addresses[0].fullAddress: ''
        clientParams.phone = req.body.CustomerInfo.code
        //clientParams.email = req.body.Customer.EMail? req.body.Customer.EMail: ''
        clientParams.alternatePhone = ''
        clientParams.deliveryAddress = req.body.StoreInfo.deliveryAddress? req.body.StoreInfo.deliveryAddress: ''
        let mdwClient = await OrderRepository.createMiddlewareClient(clientParams);

        let params = {}
        params.clientId = mdwClient.id
        params.customerInfoId = req.body.CustomerInfo.id?  req.body.CustomerInfo.id: ''
        params.originType = 2
        params.alohaStore = 0
        params.storeInfoId = req.body.StoreInfo.id
        //params.orderInfoId = req.body.OrderId? req.body.OrderId: ''
        params.customerAddress = req.body.CustomerInfo.addresses[0].fullAddress? req.body.CustomerInfo.addresses[0].fullAddress: ''
        params.customerCountry = req.body.Transaction.country? req.body.Transaction.country: ''
        //params.customerCity = req.body.Customer.City? req.body.Customer.City: ''
        params.customerPhone = req.body.CustomerInfo.code
        //params.customerFirstName = req.body.Customer.FirstName? req.body.Customer.FirstName: ''
        //params.customerLastName = req.body.Customer.LastName? req.body.Customer.LastName: ''
        //params.customerEmail = req.body.Customer.Email? req.body.Customer.Email: ''
        params.tenderInfoId = req.body.Tenders[0].TenderID? req.body.Tenders[0].TenderID: ''
        params.paymentType = req.body.Tenders[0].PaymentMethodType? req.body.Tenders[0].PaymentMethodType: -1
        params.paymentBalance = req.body.Tenders[0].Paybalance? req.body.Tenders[0].Paybalance: -1
        params.tenderAmount = req.body.Tenders[0].Amount? req.body.Tenders[0].Amount: -1
        params.tenderId = req.body.Tenders[0].Id? req.body.Tenders[0].Id: ''
        params.referenceNumber = req.body.Transaction[0].referenceNumber? req.body.Transaction[0].referenceNumber: ''
        params.orderTimer = req.body.Transaction[0].createdAt? req.body.Transaction[0].createdAt: ''
        params.orderMode = req.body.OrderMode? req.body.OrderMode: ''
        params.origin = 2
        params.paymentAuthorization = req.body.Transaction[0].authCode
        //params.paymentChange = req.body.data_extra.cambio
        params.observations = req.body.StoreInfo.deliveryAddress? req.body.StoreInfo.deliveryAddress: ''
        //params.typeOrder = req.body.data_extra.typeOrder
        //params.deliveryDay = req.body.data_extra.delivery_day
        //params.tenderPath = req.body.Tenders[0].Path? req.body.Tenders[0].Path : ''
        let orderRaw = await OrderRepository.createRawOrder(params);
        
        params.orderRawId = orderRaw.id
        console.log(orderRaw.id)
        let mdwOrder = await OrderRepository.createMiddlewareOrder(params);
        let storeId = await OrderRepository.getStoreIdFromWp(params.storeInfoId)
        params.storeId = storeId.id
        params.orderId = mdwOrder.id
        await OrderRepository.assignOrderToStore(params);
        let orderRawItems = await createRawItems(req.body.Items, 1, orderRaw.id, mdwOrder.id, '', 0, 0)

        

        res.json({mdwOrder: mdwOrder, orderRaw: orderRaw, createRawItems: orderRawItems});   
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}

    exports.setYL = async(req, res, next)=>{
        try {
            let storeId = await OrderRepository.getStoreIdFromYalo(req.body.StoreInfo.branchCode)
            console.log(storeId)
            let originOrderVerification = await OrderRepository.getOrderByOriginId(req.body.OrderId? req.body.OrderId: '', storeId.id)
            //console.log(originOrderVerification[0].id)
            //console.log(storeId.id)
            
            if (originOrderVerification.length > 0){                
                res.json({
                    success: false,
                    responseType: 1,
                    result: originOrderVerification
                })
                return                                
            }
        /* res.json({out: true})
            return*/

            let clientParams = {}
            clientParams.nit = req.body.CustomerInfo.nit? req.body.CustomerInfo.nit: 'CF'
            clientParams.name = (req.body.CustomerInfo.firstName? req.body.CustomerInfo.firstName: '' ) + (req.body.CustomerInfo.lastName? ' '+req.body.CustomerInfo.lastName: '')
            clientParams.address = req.body.CustomerInfo.addresses[0].fullAddress? req.body.CustomerInfo.addresses[0].fullAddress: ''
            clientParams.phone = req.body.CustomerInfo.code? req.body.CustomerInfo.code: ''
            clientParams.email = req.body.CustomerInfo.email? req.body.CustomerInfo.email: ''
            clientParams.alternatePhone = req.body.CustomerInfo.code? req.body.CustomerInfo.code: ''
            clientParams.deliveryAddress = req.body.CustomerInfo.addresses[0].fullAddress? req.body.CustomerInfo.addresses[0].fullAddress: ''
            clientParams.country = req.body.Transaction[0].country? req.body.Transaction[0].Country: ''
            clientParams.city = req.body.Transaction[0].city? req.body.Transaction[0].city: ''

            let mdwClient = await OrderRepository.createMiddlewareClient(clientParams);

            let params = {}
            params.clientId = mdwClient.id
            params.customerInfoId = req.body.CustomerInfo.id?  req.body.CustomerInfo.id: ''
            params.originType = 2//Yalutec
            params.alohaStore = 0
            params.storeInfoId = req.body.StoreInfo.branchCode
            params.orderInfoId = req.body.Transaction[0].orderId? req.body.Transaction[0].orderId: ''
            params.customerAddress = req.body.CustomerInfo.addresses[0].fullAddress? req.body.CustomerInfo.addresses[0].fullAddress: ''
            params.customerCountry = req.body.Transaction[0].country? req.body.Transaction[0].country: ''
            params.customerCity = req.body.Transaction[0].city? req.body.Transaction[0].city: ''
            params.customerPhone = req.body.CustomerInfo.code? req.body.CustomerInfo.code: ''
            params.customerFirstName = req.body.CustomerInfo.firstName? req.body.CustomerInfo.firstName: ''
            params.customerLastName = req.body.CustomerInfo.lastName? req.body.CustomerInfo.lastName: ''
            params.customerEmail = req.body.CustomerInfo.email? req.body.CustomerInfo.email: ''
            params.tenderInfoId = req.body.Tenders.TenderID? req.body.Tenders.TenderID: ''
            params.paymentType = req.body.Tenders.PaymentMethodType? req.body.Tenders.PaymentMethodType: -1
            params.paymentBalance = req.body.Tenders.Paybalance? req.body.Tenders.Paybalance: -1
            params.tenderAmount = req.body.Tenders.Amount? req.body.Tenders.Amount: -1
            params.tenderId = req.body.Tenders.Id? req.body.Tenders.Id: ''
            params.referenceNumber = req.body.Transaction[0].referenceNumber? req.body.Transaction[0].referenceNumber: ''
            params.orderTimer = req.body.Transaction[0].createdAt? req.body.Transaction[0].createdAt: ''
            params.orderMode = req.body.OrderMode? req.body.OrderMode: ''
            params.origin = 2//Yalutec
            params.paymentAuthorization = req.body.Transaction[0].authCode? req.body.Transaction[0].authCode.toString(): ''
            params.paymentChange = req.body.Transaction[0].change? req.body.Transaction[0].change: 0

            params.observations = ''
            params.typeOrder = 1
            params.deliveryDay = ''
            params.tenderPath = ''
            //tienda id wordpres Tenders[0].td_wp
            
            let orderRaw = await OrderRepository.createRawOrder(params);
            
            params.orderRawId = orderRaw.id
            console.log(orderRaw.id)
            console.log(params)
            let mdwOrder = await OrderRepository.createMiddlewareOrder(params);
            
            params.storeId = storeId.id
            params.orderId = mdwOrder.id
            await OrderRepository.assignOrderToStore(params);
            let orderRawItems = await createRawItems(req.body.Items, 1, orderRaw.id, mdwOrder.id, '', 0, 0)

            

            res.json({mdwOrder: mdwOrder, orderRaw: orderRaw, createRawItems: orderRawItems});   
        } catch (error) {
            console.log(error);
            next(createError(500));
        }
    }


    exports.setWP = async(req, res, next)=>{
        try {
            let storeId = await OrderRepository.getStoreIdFromWp(req.body.Tenders[0].Td_wp)
            
            let originOrderVerification = await OrderRepository.getOrderByOriginId(req.body.OrderId? req.body.OrderId: '', storeId.id)
            //console.log(originOrderVerification[0].id)
            //console.log(storeId.id)
            
            if (originOrderVerification.length > 0){                
                res.json({
                    success: false,
                    responseType: 1,
                    result: originOrderVerification
                })
                return                                
            }
           /* res.json({out: true})
            return*/

            let clientParams = {}
            clientParams.nit = req.body.Customer.Nit? req.body.Customer.Nit: 'CF'
            clientParams.name = (req.body.Customer.FirstName? req.body.Customer.FirstName: '' ) + (req.body.Customer.LastName? ' '+req.body.Customer.LastName: '')
            clientParams.address = req.body.Customer.AddressLine1? req.body.Customer.AddressLine1: ''
            clientParams.phone = req.body.Customer.VoicePhone? req.body.Customer.VoicePhone: ''
            clientParams.email = req.body.Customer.EMail? req.body.Customer.EMail: ''
            clientParams.alternatePhone = req.body.data_extra.Tel_alt? req.body.data_extra.Tel_alt: ''
            clientParams.deliveryAddress = req.body.Customer.AddressLine1? req.body.Customer.AddressLine1: ''
            clientParams.country = req.body.Customer.Country? req.body.Customer.Country: ''
            clientParams.city = req.body.Customer.City? req.body.Customer.City: ''
            /*let mdwClient = await OrderRepository.getMiddlewareClientByPhone(clientParams);
            if (mdwClient.length > 0){
                let verifyAddress = false;
                let clientDetailId = 0;
                mdwClient.MDW_Detail_Clients.forEach(detail => {
                    if (detail.address === clientParams.address)
                        verifyAddress = true;
                        clientDetailId = detail.id
                });
                if (verifyAddress){

                }
                else{
                    
                }

            }
            else{
                mdwClient = await OrderRepository.createMiddlewareClient(clientParams);
                clientParams.clientId = mdwClient.id;
                mdwClientDetail = await OrderRepository.createMiddlewareClientDetail(clientParams);
            }*/

            let mdwClient = await OrderRepository.createMiddlewareClient(clientParams);

            let params = {}
            params.clientId = mdwClient.id
            params.customerInfoId = req.body.Customer.id?  req.body.Customer.id: ''
            params.originType = 1
            params.alohaStore = 0
            params.storeInfoId = req.body.Tenders[0].Td_wp
            params.orderInfoId = req.body.OrderId? req.body.OrderId: ''
            params.customerAddress = req.body.Customer.AddressLine1? req.body.Customer.AddressLine1: ''
            params.customerCountry = req.body.Customer.Country? req.body.Customer.Country: ''
            params.customerCity = req.body.Customer.City? req.body.Customer.City: ''
            params.customerPhone = req.body.Customer.VoicePhone? req.body.Customer.VoicePhone: ''
            params.customerFirstName = req.body.Customer.FirstName? req.body.Customer.FirstName: ''
            params.customerLastName = req.body.Customer.LastName? req.body.Customer.LastName: ''
            params.customerEmail = req.body.Customer.Email? req.body.Customer.Email: ''
            params.tenderInfoId = req.body.Tenders[0].TenderID? req.body.Tenders[0].TenderID: ''
            params.paymentType = req.body.Tenders[0].PaymentMethodType? req.body.Tenders[0].PaymentMethodType: -1
            params.paymentBalance = req.body.Tenders[0].Paybalance? req.body.Tenders[0].Paybalance: -1
            params.tenderAmount = req.body.Tenders[0].Amount? req.body.Tenders[0].Amount: -1
            params.tenderId = req.body.Tenders[0].Id? req.body.Tenders[0].Id: ''
            params.referenceNumber = req.body.ReferenceNumber? req.body.ReferenceNumber: ''
            params.orderTimer = req.body.OrderTime? req.body.OrderTime: ''
            params.orderMode = req.body.OrderMode? req.body.OrderMode: ''
            params.origin = 1
            params.paymentAuthorization = req.body.Tenders[0].Autorizacion
            params.paymentChange = req.body.data_extra.cambio
            params.observations = req.body.data_extra.note
            params.typeOrder = req.body.data_extra.typeOrder
            params.deliveryDay = req.body.data_extra.delivery_day
            params.tenderPath = req.body.Tenders[0].Path? req.body.Tenders[0].Path : ''

            params.descCpnCallCenter = req.body.data_extra.desc_cpn_callcenter ? req.body.data_extra.desc_cpn_callcenter : ''
            params.amountCpnCallCenter = req.body.data_extra.amount_cpn_callcenter ? req.body.data_extra.amount_cpn_callcenter : ''
            params.cupon = req.body.data_extra.cupon ? req.body.data_extra.cupon : ''
            params.descripCpn = req.body.data_extra.descrip_cpn ? req.body.data_extra.descrip_cpn : ''
            params.amountCpn = req.body.data_extra.amount_cpn ? req.body.data_extra.amount_cpn : ''
            params.smsCpn = req.body.data_extra.sms_cpn ? req.body.data_extra.sms_cpn : ''
            //tienda id wordpres Tenders[0].td_wp
            
            let orderRaw = await OrderRepository.createRawOrder(params);
            
            params.orderRawId = orderRaw.id
            console.log(orderRaw.id)
            let mdwOrder = await OrderRepository.createMiddlewareOrder(params);
            
            params.storeId = storeId.id
            params.orderId = mdwOrder.id
            await OrderRepository.assignOrderToStore(params);
            let orderRawItems = await createRawItems(req.body.Items, 1, orderRaw.id, mdwOrder.id, '', 0, 0)

            

            res.json({mdwOrder: mdwOrder, orderRaw: orderRaw, createRawItems: orderRawItems});   
        } catch (error) {
            console.log(error);
            next(createError(500));
        }
    }

    let createRawItems = async(items, level, orderRawId, orderId, parentSku, parentId, parentRawId) =>{
        //console.log(items)
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            let itemParams = {}            
            itemParams.orderRawId = orderRawId
            itemParams.orderId = orderId
            itemParams.itemLevel = level
            itemParams.itemId = item.PosItemId? item.PosItemId: ''
            itemParams.itemPrice = item.Price? item.Price: ''
            itemParams.itemQuantity = item.Quantity? item.Quantity : -1
            itemParams.message = item.Message? item.Message: ''
            itemParams.paymentType = item.payment_type? item.payment_type: ''
            itemParams.itemGroupId = ''
            itemParams.takeOutPrice = ''
            itemParams.parentSku = parentSku
            itemParams.parentId = parentId
            itemParams.parentRawId = parentRawId
            //Product Params 
            itemParams.productName = item.Name? item.Name: ''
            itemParams.productDescription = item.Description? item.Description: ''
            itemParams.productComment = item.Comment? item.Comment: ''
            
            if (level !== 1)
                itemParams.itemGroupId = item.SourceModifierGroupId
            if (level !== 1)
                itemParams.takeOutPrice = item.UseTakeOutPrice
            
            let resultCreateRawItems = await OrderRepository.createRawOrderDetail(itemParams);
            let product = await OrderRepository.getProductBySku(item.PosItemId? item.PosItemId: '')
            let productDetail = {}
            if (product){
                itemParams.productId = product.id
                if (product.name === ''){
                    console.log("********************************SE ACTUALIZO PRODUCTO*************************************")
                    product = await OrderRepository.updateProduct(itemParams)
                }
                productDetail = await OrderRepository.createMiddlewareOrderDetail(itemParams)

                if (item.SubItems && item.SubItems.length > 0){
                    await createRawItems(item.SubItems, level + 1, orderRawId, orderId, itemParams.itemId, productDetail.id, resultCreateRawItems.id)
                }
            }
            else{
                console.log("********************************PRODUCTO NO EXISTE*************************************")
                product = await OrderRepository.createProduct(itemParams)
                if (product){
                    console.log(product)
                    itemParams.productId = product.id
                    productDetail = await OrderRepository.createMiddlewareOrderDetail(itemParams)
                    if (item.SubItems && item.SubItems.length > 0){
                        await createRawItems(item.SubItems, level + 1, orderRawId, orderId, itemParams.itemId, productDetail.id, resultCreateRawItems.id)
                    }   
                }
            }
        }
    }
    

exports.getAllActiveOrders = async(req, res, next)=>{
        try {
            let params = {}
            params.storeId = req.params.storeId
            params.orderType = req.params.orderType
            let mdwOrders = await OrderRepository.getAllMdwOrdersByStatus(params);          
            res.json(mdwOrders)
            
        } catch (error) {
            console.log(error);
            next(createError(500));
        }
}

exports.getAllActiveOrdersWithoutType = async(req, res, next)=>{
    try {
        let params = {}
        params.storeId = req.params.storeId
        let mdwOrders = await OrderRepository.getAllMdwOrdersWithoutType(params);          
        res.json(mdwOrders)
        
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}

exports.getAllDeliveredMdwOrdersByDay = async(req, res, next)=>{
    try {
        let endDate = new Date (req.params.date)
        endDate.setUTCHours(23,59,59,999);
        let params = {}
        params.storeId = req.params.storeId
        params.initialDate = new Date (req.params.date)
        params.endDate = endDate
        let mdwOrders = await OrderRepository.getAllDeliveredMdwOrdersByDay(params);          
        res.json(mdwOrders)
        
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}

exports.getAllAssignedMdwOrdersByDay = async(req, res, next)=>{
    try {
        let endDate = new Date (req.params.date)
        endDate.setUTCHours(23,59,59,999);
        let params = {}
        params.storeId = req.params.storeId
        params.initialDate = new Date (req.params.date)
        params.endDate = endDate
        let mdwOrders = await OrderRepository.getAllAssignedMdwOrdersByDay(params);          
        res.json(mdwOrders)
        
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}

exports.getAllUnassignedMdwOrdersByDay = async(req, res, next)=>{
    try {
        let endDate = new Date (req.params.date)
        endDate.setUTCHours(23,59,59,999);
        let params = {}
        params.storeId = req.params.storeId
        params.initialDate = new Date (req.params.date)
        params.endDate = endDate
        let mdwOrders = await OrderRepository.getAllUnassignedMdwOrdersByDay(params);          
        res.json(mdwOrders)
        
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}

exports.getAllMiddlewareOrders = async(req, res, next)=>{
    try {
        let mdwOrders = await OrderRepository.getAllMdwOrders();          
        res.json(mdwOrders)
        
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}

exports.getAllMiddlewareOrdersByStore = async(req, res, next)=>{
    try {
        let endDate = new Date (req.params.endDate)
        endDate.setUTCHours(23,59,59,999);
        let params = {}
            params.storeId = req.params.storeId
            params.status = req.params.status
            params.isActive = req.params.status === '5' ? 0: 1
            params.initialDate = new Date (req.params.initialDate)
            params.endDate = endDate
            console.log(params)
        let mdwOrders = await OrderRepository.getAllMdwOrdersByStore(params);          
        console.log(params)
        res.json(mdwOrders)
        
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}

exports.getInformationOrder = async(req, res, next)=>{
    try {
        let mdwOrders = await OrderRepository.getMdwOrderAndDetail(req.params.orderId);
        if (!mdwOrders)       
            mdwOrders = {}
        res.json(mdwOrders)
        
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}

exports.informationOrderAndPilotHistoryByOriginOrderId = async(req, res, next)=>{
    try {
        let mdwOrders = await OrderRepository.getMdwOrderAndDetailWithoutStatus(req.params.originOrderId, req.params.storeId);
        if (mdwOrders.length > 0){
            let mdwOrderUsers = await OrderRepository.getMdwOrderAssignedUsers(req.params.originOrderId, req.params.storeId);
            res.json({mdwOrder: mdwOrders, mdwOrderUsers: mdwOrderUsers})
        }
        res.json(mdwOrders)
        
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}

exports.assignOrderToStore = async(req, res, next)=>{
    try {
        let params = {}
        params.storeId = req.body.storeId
        params.orderId = req.body.orderId
        let order = await OrderRepository.assignOrderToStore(params)
        res.json(order)            
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}