const OrderRepository = require('../repository/OrderRepository')
const jwt  = require('jsonwebtoken');
const { get } = require('request');
const request = require('request');
const createError = require("http-errors");

exports.getRawAndMiddlewareOrder = async(req, res, next)=>{
    try {
        let mdwOrder = await OrderRepository.getMdwOrderById(req.params.orderId);
        if (!mdwOrder)       
        mdwOrder = {}
        let rawOrder = await OrderRepository.getRawOrderById(mdwOrder.order_raw_id)
        let storeInfo = await OrderRepository.getStoreIdFromWp(rawOrder.store_info_id)
        let unifyOrder = {
            mdwOrder: mdwOrder,
            rawOrder: rawOrder,
            storeInfo: storeInfo
        }
        let orderToAlohaMiddleware = convertOrdertoAloha(unifyOrder)
        let alohaBody = createAlohaRequest(orderToAlohaMiddleware)
        //res.json(unifyOrder)
        res.json(alohaBody)
        
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}

function convertOrdertoAloha(unifyOrder){
    let Items = []
    let itemLevels = 0
    let customerNit = ""
    let paymentType = ""
    unifyOrder.rawOrder.Order_Raw_Items.forEach(item => {
        if (item.item_level > itemLevels)
            itemLevels = itemLevels + item.item_level
    });
    console.log('Levels: '+ itemLevels)
    unifyOrder.rawOrder.Order_Raw_Items.forEach(item => {
        if (item.item_level === 1){
            let SubItems= []
            unifyOrder.rawOrder.Order_Raw_Items.forEach(subItem => {
                if (subItem.item_level === 2 && item.item_id === subItem.parent_sku && item.id === subItem.parent_id){
                    let SubItems2= []
                    unifyOrder.rawOrder.Order_Raw_Items.forEach(subItem2 => {
                        if (subItem2.item_level === 3 && subItem.item_id === subItem2.parent_sku && subItem.id === subItem2.parent_id){
                            SubItems2.push({
                                PosItemId: subItem2.item_id,
                                ModCodeId: "1",
                                SourceModifierGroupId: subItem2.item_group_id,
                                Quantity: subItem2.item_quantity,
                                Price: subItem2.item_price,
                                UseTakeOutPrice: true,
                                SubItems: []
                            })                
                        }
                    });
                    SubItems.push({
                        PosItemId: subItem.item_id,
                        ModCodeId: "1",
                        SourceModifierGroupId: subItem.item_group_id,
                        Quantity: subItem.item_quantity,
                        Price: subItem.item_price,
                        UseTakeOutPrice: true,
                        SubItems: SubItems2
                    })
                }
            });
            if (SubItems.length> 0){
                Items.push({
                    PosItemId: item.item_id,
                    Price: item.item_price,
                    UseTakeOutPrice: true,
                    Quantity: item.item_quantity,
                    SubItems: SubItems,
                    isDefault: true
                })
            }
            else{
                if (item.item_quantity === -1){
                    if (item.message !== ""){
                        customerNit = item.message
                        Items.push({
                            PosItemId: item.item_id,
                            Price: item.item_price,
                            UseTakeOutPrice: true,
                            Message: item.message
                        })
                    }
                    if (item.payment_type !== ""){
                        paymentType = item.payment_type
                        Items.push({
                            PosItemId: item.item_id,
                            Price: item.item_price,
                            UseTakeOutPrice: true,
                            payment_type: item.payment_type
                        })
                    }
                }
                else{
                    Items.push({
                        PosItemId: item.item_id,
                        Price: item.item_price,
                        UseTakeOutPrice: true,
                        Quantity: item.item_quantity
                    })
                }                
            }
            
        }
    });

    let fromOrderToAloha = {
        orderId: unifyOrder.rawOrder.order_info_id,
        customer: {
            customerId: unifyOrder.rawOrder.customer_info_id,
            address: unifyOrder.rawOrder.customer_address,
            city: unifyOrder.rawOrder.customer_city,
            country: unifyOrder.rawOrder.customer_country,
            phone: unifyOrder.rawOrder.customer_phone,
            firstName: unifyOrder.rawOrder.customer_first_name,
            lastName: unifyOrder.rawOrder.customer_last_name,
            email: unifyOrder.rawOrder.customer_email
        },
        items: Items,
        tender: {
            id: unifyOrder.rawOrder.tender_info_id,
            paymentType: unifyOrder.rawOrder.payment_type,
            paymentBalance: unifyOrder.rawOrder.payment_balance,
            amount: unifyOrder.rawOrder.tender_amount,
            authorization:unifyOrder.mdwOrder.payment_authorization,
            storeId: unifyOrder.rawOrder.store_info_id,
            storeName: unifyOrder.storeInfo.name,
            storePath: unifyOrder.storeInfo.name
        },
        referenceNumber: unifyOrder.reference_number,
        orderTimer: unifyOrder.order_timer,
        orderMode: unifyOrder.order_mode
    }
    return fromOrderToAloha
}

function createAlohaRequest(request){

    let alohaRequest = {
        "OrderId": request.orderId,
        "Customer": {
            "id": request.customer.customerId,
            "AddressLine1": request.customer.address,
            "City": request.customer.city,
            "State": "0",
            "Postal": "0",
            "Country": request.customer.country,
            "BusinessName": "trabajo",
            "VoicePhone": request.customer.phone,
            "VoicePhoneExtension": "0",
            "FirstName": request.customer.firstName,
            "LastName": request.customer.lastName,
            "Email": request.customer.email
        },
        "Items": request.items,
        "Tenders": [
            {
                "TenderID": request.tender.id,
                "PaymentMethodType": request.tender.paymentType,
                "Paybalance": request.tender.paymentBalance,
                "Amount": request.tender.amount,
                "tip": 0,
                "Id": request.tender.id,
                "Autorizacion": request.tender.authorization,
                "Td_wp": request.tender.storeId,
                "Name_wp": request.tender.storeName,
                "Path": request.tender.storePath
            }
        ],
        "ReferenceNumber": request.referenceNumber,
        "OrderTime": request.orderTimer,
        "PromiseDateTime": request.orderTimer,
        "DestinationId": "takeoutpickup",
        "OrderMode": request.orderMode,
        "status": 0,
        "PartySize": 1,
        "TaxExempt": false,
        "AssignAlohaLoyalty": false
    }
    return alohaRequest
}