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

exports.tokenService = async(req,res,next)=>{
    //console.log(req.body);
    //res.json(true);
}

exports.setYL = async(req, res, next)=>{

    console.log("hola*********")
    try {
        let ylrequest = {}
        //ylrequest = createAlohaRequestFromYalo(req.body);
        let sendToAloha = false
        sendToAloha = (process.env.ENABLED_ALOHA === 'true')
        console.log(sendToAloha)

        let username= 'sanmartinbakeryserviceuser'
        let password= '_.LyM7Xn1'
        let auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
        console.log(auth)

        //ylrequest.ylrequest = req.body
        
        //console.log(JSON.stringify(ylrequest))
        /*Object.keys(req.body).forEach(function(key) {
            console.log(key+':'+req.body[key])
        })*/
        //res.json(ylrequest)
        request.post({
            headers: { 'Content-Type': 'application/json' },
            url: "https://en3d78lugng662l.m.pipedream.net",
            body: JSON.stringify(ylrequest),
          }, function(error, response, body){
            console.log(JSON.stringify(ylrequest));
            //res.json(getWPtoAlohaResponse(req.body))
            if (!sendToAloha)
                res.json(ylrequest)
        });

        if (sendToAloha){
            request.post({
            
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': auth,
                }, // important to interect with PHP
                url: "https://api.ncr.com/sc/v1/FormattedOrders/397891",
                body: JSON.stringify(ylrequest),
              }, function(error, response, body){
                console.log(JSON.stringify(response));
                res.json(response)
            });
        }
        

    } catch (error) {
        next(createError(500));
        console.log(error);
    }
}

    exports.setWP = async(req, res, next)=>{
        try {

            let clientParams = {}
            clientParams.nit = 'CF'
            clientParams.name = (req.body.Customer.FirstName? req.body.Customer.FirstName: '' ) + (req.body.Customer.LastName? ' '+req.body.Customer.LastName: '')
            clientParams.address = req.body.Customer.AddressLine1? req.body.Customer.AddressLine1: ''
            clientParams.phone = req.body.Customer.VoicePhone? req.body.Customer.VoicePhone: ''
            clientParams.email = req.body.Customer.EMail? req.body.Customer.EMail: ''
            clientParams.alternatePhone = ''
            clientParams.deliveryAddress = req.body.Customer.AddressLine1? req.body.Customer.AddressLine1: ''
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
            //tienda id wordpres Tenders[0].td_wp
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
            if (level !== 1)
                itemParams.itemGroupId = item.SourceModifierGroupId
            if (level !== 1)
                itemParams.takeOutPrice = item.UseTakeOutPrice
            
            let resultCreateRawItems = await OrderRepository.createRawOrderDetail(itemParams);
            let product = await OrderRepository.getProductBySku(item.PosItemId? item.PosItemId: '')
            let productDetail = {}
            if (product){
                itemParams.productId = product.id
                productDetail = await OrderRepository.createMiddlewareOrderDetail(itemParams)

                if (item.SubItems && item.SubItems.length > 0){
                    await createRawItems(item.SubItems, level + 1, orderRawId, orderId, itemParams.itemId, productDetail.id, resultCreateRawItems.id)
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
