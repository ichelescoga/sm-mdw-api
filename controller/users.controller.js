const OrderRepository = require('../repository/OrderRepository')
const UserRepository = require('../repository/UserRepository')
const jwt  = require('jsonwebtoken');
const { get } = require('request');
const https = require('https')
const request = require('request');
const security = require('../src/utils/security')
const createError = require("http-errors");

exports.getAllStores = async(req, res, next)=>{
    try {
        let allStores = await UserRepository.getAllStores();
        res.json(allStores)            
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}

exports.getAvailablePilots = async(req, res, next)=>{
    try {
        let userType = req.params.userType
        let allPilots = await UserRepository.getAllUsersByType(userType);
        let allAssignedPilots = await UserRepository.getStoreAssignedUsers(userType)
        let disponiblePilots = []
        allPilots.forEach(pilot => {
            let searchPilot = allAssignedPilots.find(x => pilot.id === x.user_id)
            if (!searchPilot)
                disponiblePilots.push(pilot);
            //console.log(searchPilot)
        });
        res.json(disponiblePilots)            
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}

exports.getAssignedPilotsByStore = async(req, res, next)=>{
    try {
        //let allPilots = await UserRepository.getAllUsersByType(3);
        let allAssignedPilots = await UserRepository.getAssignedPilotsByStore(req.params.storeId)
        res.json(allAssignedPilots)            
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}

exports.getAssignedUsers = async(req, res, next)=>{
    try {
        //let allPilots = await UserRepository.getAllUsersByType(3);
        let allAssignedUsers = await UserRepository.getAssignedUsers(req.params.userType)
        res.json(allAssignedUsers)            
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}

exports.assignPilotToStore = async(req, res, next)=>{
    try {
        console.log(req.body)
        let params = {}
        params.userId = req.body.userId
        params.storeId = req.body.storeId
        let pilot = await UserRepository.assignUserToStore(params)
        res.json(pilot)            
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}

exports.disablePilotFromStore = async(req, res, next)=>{
    try {
        let params = {}
        params.userId = req.params.userId
        params.storeId = req.params.storeId
        let pilot = await UserRepository.disablePilotFromStore(params)
        res.json(pilot)            
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}

exports.getAvailablePilotsForAssignOrder = async(req, res, next)=>{
    try {
        let params = {}
        params.storeId = req.params.storeId
        params.userType = 3
        let assignedPilots = await UserRepository.getAssignedPilotsByStore(req.params.storeId)
        //let pilotsByOrder = await UserRepository.getAsignedUsersByOrder(params)
        //let pilotsByOrder = []
        let disponiblePilots = []
        /*assignedPilots = assignedPilots.map(pilot => {
            let searchPilot = pilotsByOrder.find(x => pilot.user_id === x.user_id)
            console.log(searchPilot)
            let value = 0
            if (!searchPilot)
                pilot.ordersCount = 0
            else
                pilot.ordersCount = searchPilot.length
            //console.log(searchPilot)
            console.log(pilot.ordersCount)
            return pilot
        });*/
        res.json(assignedPilots)            
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}

exports.assignPilotToOrder = async(req, res, next)=>{
    try {
        let params = {}
        params.userId = req.body.userId
        params.orderId = req.body.orderId
        params.status = 2
        params.geolocalization = req.body.geolocalization
        let order = await OrderRepository.updateOrderStatus(params)
        let pilot = await UserRepository.assignUserToOrder(params)
        res.json(pilot)            
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}


exports.updateOrderStatus = async(req, res, next)=>{
    try {
        let params = {}
        params.geolocalization = req.body.geolocalization
        params.status = req.params.status === 'closed'? 0: req.params.status === 'route'? 3 : req.params.status === 'site'? 4 : req.params.status === 'delivered'? 5 : 
        req.params.status === 'ride'? 6 : req.params.status === 'gas'? 7: req.params.status === 'robber'? 8 : 9
        params.isActive = (req.params.status === 'delivered' || req.params.status === 'closed') ? 0 : 1
        /*
        /assign -> 2
        route -> 3
        site -> 4
        delivered -> 5
        emergency -> 30
        ride -> 6
        gas -> 7
        robber -> 8
        injury -> 9 
        */
        if (params.status > 5){
            params.userId = req.body.userId
            params.storeId = req.body.storeId
            let ordersByPilot = await UserRepository.getAllActiveOrdersByPilot(params)
            for (let index = 0; index < ordersByPilot.length; index++) {
                params.orderId = ordersByPilot[index].order_id
                console.log(params.orderId)
                let order = await OrderRepository.updateOrderStatusAndType(params)
                let updateUserOrder = await UserRepository.assignUserToOrderEmergency(params)    
            }
            res.json(ordersByPilot)
        }
        else{
            params.orderId = req.body.orderId
            let pilot = await OrderRepository.getUserOrder(params.orderId)
            params.userId = pilot.user_id
            let order = await OrderRepository.updateOrderStatus(params)
            let updateUserOrder = await UserRepository.assignUserToOrder(params)
            res.json(order)
        }        
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}

exports.getAllActiveOrdersByPilot = async(req, res, next)=>{
    try {
        let params = {}
        params.storeId = req.params.storeId
        params.userId = req.params.userId
        let mdwOrders = await UserRepository.getAllActiveOrdersByPilot(params);          
        res.json(mdwOrders)
        
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}

exports.createUser = async(req, res, next)=>{
    try {
        let params = {}
        params.firstName = req.body.firstName
        params.lastName = req.body.lastName
        params.email = req.body.email
        params.password = await security.generateToken(req.body.password)
        params.code = req.body.code
        params.dpi = req.body.dpi
        params.userType = req.body.userType
        params.enterpriseId = req.body.enterpriseId
        params.username = req.body.email
        let usersByEmail = await UserRepository.getUserByEmail(params);
        let usersByCode = await UserRepository.getUserByCode(params);
        let usersByDpi = await UserRepository.getUserByDpi(params);

        if (usersByEmail && usersByEmail.length > 0){
            console.log("user by email")
            res.json({
                errorType: 'duplicate',
                errorField: 'email'
            })
            
        }

        if (usersByCode && usersByCode.length > 0){
            console.log("user by code")
            res.json({
                errorType: 'duplicate',
                errorField: 'code'
            })
            
        }

        if (usersByDpi && usersByDpi.length > 0){
            console.log("user by dpi")
            res.json({
                errorType: 'duplicate',
                errorField: 'dpi'
            })
            
        }
        if ((!usersByEmail || usersByEmail.length === 0) && (!usersByCode || usersByCode.length === 0) && (!usersByDpi || usersByDpi.length === 0)){
            let newUser = await UserRepository.createUser(params);          
            res.json(newUser.id)
        }
        
        
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}

exports.updateUser = async(req, res, next)=>{
    try {
        let params = {}
        params.userId = req.body.userId
        params.firstName = req.body.firstName
        params.lastName = req.body.lastName
        params.email = req.body.email
        params.code = req.body.code
        params.dpi = req.body.dpi
        params.userType = req.body.userType
        params.enterpriseId = req.body.enterpriseId
        let usersByEmail = await UserRepository.getUserByEmail(params);
        let usersByCode = await UserRepository.getUserByCode(params);
        let usersByDpi = await UserRepository.getUserByDpi(params);
        if (usersByEmail && usersByEmail.length > 0){
            console.log("user by email")
            res.json({
                errorType: 'duplicate',
                errorField: 'email'
            })
            
        }
        if (usersByCode && usersByCode.length > 0){
            console.log("user by code")
            res.json({
                errorType: 'duplicate',
                errorField: 'code'
            })
            
        }
        if (usersByDpi && usersByDpi.length > 0){
            console.log("user by dpi")
            res.json({
                errorType: 'duplicate',
                errorField: 'dpi'
            })
            
        }
        if (usersByEmail.length == 0 && usersByCode.length == 0 && usersByDpi.length == 0){
            let newUser = await UserRepository.createUser(params);          
            res.json(newUser.id)
        }
        let newUser = await UserRepository.updateUser(params);          
        res.json(params)
        
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}

exports.deactiveUser = async(req, res, next)=>{
    try {
        let params = {}
        params.userId = req.params.userId
        let newUser = await UserRepository.deactiveUser(params);          
        res.json(params)
        
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}

exports.updateUserPassword = async(req, res, next)=>{
    try {
        let params = {}
        params.userId = req.body.userId
        params.password = await security.generateToken(req.body.password)
        console.log(params)
        let newUser = await UserRepository.updateUserPassword(params);
        console.log(newUser)
        console.log("**************************")   
        res.json(newUser.id)
        
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}

exports.getAllEnterprises = async(req, res, next)=>{
    try {
        let enterprises = await UserRepository.getAllEnterprises();          
        res.json(enterprises)
        
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}

exports.getAllUsers = async(req, res, next)=>{
    try {
        let users = await UserRepository.getAllUsers();          
        res.json(users)
        
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}

exports.getAllUsersAssignedToStore = async(req, res, next)=>{
    try {
        let users = await UserRepository.getAllUsersAssignedToStore();          
        res.json(users)
        
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}

exports.createEnterprise = async(req, res, next)=>{
    try {
        let params = {}
        params.name = req.body.name
        params.country = req.body.country
        params.city = req.body.city
        let verifyEnterprise = await UserRepository.getEnterpriseByName(params);
        if (verifyEnterprise.length > 0){
            res.json({
                errorType: 1,
                message: "duplicate name"
            })
        }
        else{
            let enterprise = await UserRepository.createEnterprise(params);          
            res.json(enterprise)
        }
        
        
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}