const OrderRepository = require('../repository/OrderRepository')
const UserRepository = require('../repository/UserRepository')
const jwt  = require('jsonwebtoken');
const { get } = require('request');
const https = require('https')
const request = require('request');

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
        res.json({
            success: false,
            payload: error
        })
        return
    }
}

let options = {
    //hostname: 'https://en3d78lugng662l.m.pipedream.net',
    //port: 80,
    //path: '/post.php',
    method: 'POST',
    headers: {
         'Content-Type': 'application/json',
       }
  };

exports.tokenService = async(req,res,next)=>{
    //console.log(req.body);
    //res.json(true);
}

exports.setYL = async(req, res, next)=>{

    console.log("hola*********")
    try {
        let ylrequest = {}
        ylrequest = createAlohaRequestFromYalo(req.body);
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
        console.log(error);
    }


    exports.setWP2 = async(req, res, next)=>{
        try {
            let wprequest = {}
            wprequest.wprequest = req.body
            let sendToAloha = false
            sendToAloha = (process.env.ENABLED_ALOHA === 'true')
            
            let username= 'sanmartinbakeryserviceuser'
            let password= '_.LyM7Xn1'
            let auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
            console.log(auth)
            //res.json(getWPtoAlohaResponse(req.body))
            //res.json(auth)
            request.post({
                headers: { 'Content-Type': 'application/json' },
                url: "https://en3d78lugng662l.m.pipedream.net",
                body: JSON.stringify(wprequest),
              }, function(error, response, body){
                console.log(JSON.stringify(response));
                if (!sendToAloha)
                    res.json(wprequest)
            });
    
            if (sendToAloha){
                request.post({
                
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': auth,
                    }, // important to interect with PHP
                    url: "https://api.ncr.com/sc/v1/FormattedOrders/397891",
                    body: JSON.stringify(req.body),
                  }, function(error, response, body){
                    console.log(JSON.stringify(response));
                    res.json(response)
                });
            }
            
            
            
            
        } catch (error) {
            console.log(error);
        }
    }}


    exports.setWP = async(req, res, next)=>{
        try {
            let storeId = req.params.storeId

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
            params.alohaStore = 397891
            params.storeInfoId = storeId
            params.orderInfoId = req.body.OrderId? req.body.OrderId: ''
            params.customerAddress = req.body.Customer.AddressLine1? req.body.Customer.AddressLine1: ''
            params.customerCountry = req.body.Customer.Country? req.body.Customer.Country: ''
            params.customerCity = req.body.Customer.City? req.body.Customer.City: ''
            params.customerPhone = req.body.Customer.VoicePhone? req.body.Customer.VoicePhone: ''
            params.customerFirstName = req.body.Customer.FirstName? req.body.Customer.FirstName: ''
            params.customerLastName = req.body.Customer.LastName? req.body.Customer.LastName: ''
            params.customerEmail = req.body.Customer.EMail? req.body.Customer.EMail: ''
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
            //tienda id wordpres Tenders[0].td_wp
            let orderRaw = await OrderRepository.createRawOrder(params);
            
            params.orderRawId = orderRaw.id
            console.log(orderRaw.id)
            let mdwOrder = await OrderRepository.createMiddlewareOrder(params);

            let orderRawItems = await createRawItems(req.body.Items, 1, orderRaw.id, mdwOrder.id)

            

            res.json({orderRaw: orderRaw, createRawItems: orderRawItems});   
        } catch (error) {
            console.log(error);
        }
    }

    let createRawItems = async(items, level, orderRawId, orderId) =>{
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
            itemParams.itemGroupId = ''
            itemParams.takeOutPrice = ''
            if (level !== 1)
                itemParams.itemGroupId = item.SourceModifierGroupId
            if (level !== 1)
                itemParams.takeOutPrice = item.UseTakeOutPrice
            
            let resultCreateRawItems = await OrderRepository.createRawOrderDetail(itemParams);
            let product = await OrderRepository.getProductBySku(item.PosItemId? item.PosItemId: '')
            if (product){
                itemParams.productId = product.id
                await OrderRepository.createMiddlewareOrderDetail(itemParams)
            }
                

            if (item.SubItems && item.SubItems.length > 0){
                await createRawItems(item.SubItems, level + 1, orderRawId, orderId)
            }                
            
        }
    }


exports.getAllActiveOrders = async(req, res, next)=>{
        try {
            /*let allProducts = await ProductRepository.getStockProducts();
            res.json(allProducts)
            return;*/
            let mdwOrders = await OrderRepository.getAllMdwOrdersByStatus(req.params.orderStatus);          
            res.json(mdwOrders)
            
        } catch (error) {
            console.log(error);
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
    }
}


exports.setWP2 = async(req, res, next)=>{
    try {
        let wprequest = {}
        wprequest.wprequest = req.body
        let sendToAloha = false
        sendToAloha = (process.env.ENABLED_ALOHA === 'true')
        
        let username= 'sanmartinbakeryserviceuser'
        let password= '_.LyM7Xn1'
        let auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
        console.log(auth)
        //res.json(getWPtoAlohaResponse(req.body))
        //res.json(auth)
        request.post({
            headers: { 'Content-Type': 'application/json' },
            url: "https://en3d78lugng662l.m.pipedream.net",
            body: JSON.stringify(wprequest),
          }, function(error, response, body){
            console.log(JSON.stringify(response));
            if (!sendToAloha)
                res.json(wprequest)
        });

        if (sendToAloha){
            request.post({
            
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': auth,
                }, // important to interect with PHP
                url: "https://api.ncr.com/sc/v1/FormattedOrders/397891",
                body: JSON.stringify(req.body),
              }, function(error, response, body){
                console.log(JSON.stringify(response));
                res.json(response)
            });
        }
        
        
        
        
    } catch (error) {
        console.log(error);
    }
}

function getWPtoAlohaResponse(body){
    console.log(body)
    let alohaResponse = {}
    alohaResponse.OrderId = body.OrderId
    alohaResponse.Customer = {}
    alohaResponse.Customer.id = body.Customer.id
    alohaResponse.Customer.AddressLine1 = body.Customer.AddressLine1
    alohaResponse.Customer.City = body.Customer.City
    alohaResponse.Customer.State = body.Customer.State
    alohaResponse.Customer.Postal = body.Customer.Postal
    alohaResponse.Customer.Country = body.Customer.Country
    alohaResponse.Customer.BusinessName = body.Customer.BusinessName
    alohaResponse.Customer.VoicePhone = body.Customer.VoicePhone
    alohaResponse.Customer.VoicePhoneExtension = body.Customer.VoicePhoneExtension
    alohaResponse.Customer.FirstName = body.Customer.FirstName
    alohaResponse.Customer.LastName = body.Customer.LastName
    alohaResponse.Customer.EMail = body.Customer.EMail

    let itemsList = body.Items.map(item=>{
        return {
            PosItemId: item.PosItemId,
            Price: item.Price,
            UseTakeOutPrice: item.UseTakeOutPrice,
            Quantity: item.Quantity,
            SubItems: item.SubItems,
            isDefault: item.isDefault,
            
        }
    })

    return alohaResponse
}

function createAlohaRequestFromYalo(body){
    let alohaRequest = {}
    console.log(body)
    let alohaItems = []
    body.Items.forEach(element => {
        let itemLevel = 0
        
    });
    
    alohaItems = body.Items.map(item =>{
        return{
            "PostItemId": item.PosItemId,
            "Price": item.Price,
            "UseTakeOutPrice": item.UseTakeOutPrice,
            "Quantity": item.Quantity,
            "SubItems": item.SubItems,
            "isDefault": true
        }
    })
    alohaRequest = {
        "OrderId": body.StoreInfo.id,
        "Customer": {
          "id": body.CustomerInfo.id,
          "AddressLine1": body.CustomerInfo.addresses[0].fullAddress,
          "City": body.Transaction.country,
          "State": "0",
          "Postal": "0",
          "Country": body.Transaction.country,
          "BusinessName": "trabajo",
          "VoicePhone": body.CustomerInfo.code,
          "VoicePhoneExtension": "0",
          "FirstName": body.StoreInfo.id,
          "LastName": "-----LAST NAME-----",
          "EMail": "."
        },
        "Items": alohaItems,
        "Tenders": [
          {
            "TenderID": body.Tenders[0].TenderID,
            "PaymentMethodType": body.Tenders[0].PaymentMethodType,
            "Paybalance": body.Tenders[0].Paybalance,
            "Amount": body.Tenders[0].Amount,
            "tip": 0,
            "Id": body.Tenders[0].Id
          }
        ],
        "ReferenceNumber": body.Transaction[0].referenceNumber,
        "OrderTime": body.Transaction[0].createdAt,
        "PromiseDateTime": body.Transaction[0].createdAt,
        "DestinationId": "takeoutpickup",
        "OrderMode": body.OrderMode,
        "status": 0,
        "PartySize": 1,
        "TaxExempt": false,
        "AssignAlohaLoyalty": false
    }
    return alohaRequest
}

let alohaResponse = 
[
    {
        "ID": 46555,
        "product_id": 2388,
        "name": "Pastel Momentos",
        "sku": 502478,
        "quantity": 1,
        "price": 75,
        "variations": [
            {
                "PosItemId": 2470,
                "ModCodeId": 1,
                "SourceModifierGroupId": 19628,
                "Quantity": 1,
                "Price": 75,
                "UseTakeOutPrice": 1,
                "SubItems": []
            }
        ],
        "is_default": 1,
        "UseTakeOutPrice": 1
    },
    {
        "ID": 46556,
        "product_id": 2645,
        "name": "Dos de Tres",
        "sku": 1407,
        "quantity": 1,
        "price": 64,
        "variations": [
            {
                "PosItemId": 4699,
                "ModCodeId": 1,
                "SourceModifierGroupId": 19159,
                "quantity": 1,
                "price": 0,
                "UseTakeOutPrice": 1,
                "SubItems": []
            },
            {
                "PosItemId": 1466,
                "ModCodeId": 1,
                "SourceModifierGroupId": 19158,
                "quantity": 1,
                "price": 0,
                "UseTakeOutPrice": 1,
                "SubItems": []
            },
            {
                "PosItemId": 1523,
                "ModCodeId": 1,
                "SourceModifierGroupId": 19238,
                "quantity": 1,
                "price": 0,
                "UseTakeOutPrice": 1,
                "SubItems": []
            }
        ],
        "is_default": 1,
        "UseTakeOutPrice": 1
    },
    {
        "ID": 46557,
        "product_id": 2645,
        "name": "Dos de Tres",
        "sku": 1407,
        "quantity": 1,
        "price": 64,
        "variations": [
            {
                "PosItemId": 4699,
                "ModCodeId": 1,
                "SourceModifierGroupId": 19159,
                "quantity": 1,
                "price": 0,
                "UseTakeOutPrice": 1,
                "SubItems": [
                    {
                        "PosItemId": 999829,
                        "ModCodeId": 1,
                        "SourceModifierGroupId": 12415,
                        "quantity": 1,
                        "price": 0,
                        "UseTakeOutPrice": 1
                    }
                ]
            },
            {
                "PosItemId": 1466,
                "ModCodeId": 1,
                "SourceModifierGroupId": 19158,
                "quantity": 1,
                "price": 0,
                "UseTakeOutPrice": 1,
                "SubItems": [
                    {
                        "PosItemId": 800089,
                        "ModCodeId": 1,
                        "SourceModifierGroupId": 10116,
                        "quantity": 1,
                        "price": 0,
                        "UseTakeOutPrice": 1
                    }
                ]
            },
            {
                "PosItemId": 1523,
                "ModCodeId": 1,
                "SourceModifierGroupId": 19238,
                "quantity": 1,
                "price": 0,
                "UseTakeOutPrice": 1,
                "SubItems": []
            }
        ],
        "is_default": 1,
        "UseTakeOutPrice": 1
    }
]