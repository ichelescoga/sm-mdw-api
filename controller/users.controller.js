const OrderRepository = require('../repository/OrderRepository')
const UserRepository = require('../repository/UserRepository')
const jwt  = require('jsonwebtoken');
const { get } = require('request');
const https = require('https')
const request = require('request');

exports.getAllStores = async(req, res, next)=>{
    try {
        let allStores = await UserRepository.getAllStores();
        res.json(allStores)            
    } catch (error) {
        console.log(error);
    }
}

exports.getAvailablePilots = async(req, res, next)=>{
    try {
        let allPilots = await UserRepository.getAllUsersByType(3);
        let allAssignedPilots = await UserRepository.getStoreAssignedUsers(3)
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
    }
}

exports.getAssignedPilotsByStore = async(req, res, next)=>{
    try {
        //let allPilots = await UserRepository.getAllUsersByType(3);
        let allAssignedPilots = await UserRepository.getAssignedPilotsByStore(req.params.storeId)
        res.json(allAssignedPilots)            
    } catch (error) {
        console.log(error);
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
    }
}

exports.getAvailablePilotsForAssignOrder = async(req, res, next)=>{
    try {
        let params = {}
        params.storeId = req.params.storeId
        params.userType = 3
        let assignedPilots = await UserRepository.getAssignedPilotsByStore(req.params.storeId)
        let pilotsByOrder = await UserRepository.getAsignedUsersByOrder(params)
        let disponiblePilots = []
        assignedPilots.forEach(pilot => {
            let searchPilot = pilotsByOrder.find(x => pilot.user_id === x.user_id)
            if (!searchPilot)
                disponiblePilots.push(pilot);
            //console.log(searchPilot)
        });
        res.json(disponiblePilots)            
    } catch (error) {
        console.log(error);
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
    }
}


exports.updateOrderStatus = async(req, res, next)=>{
    try {
        let params = {}
        params.geolocalization = req.body.geolocalization
        params.orderId = req.body.orderId
        params.status = req.params.status === 'route'? 3 : req.params.status === 'site'? 4 : req.params.status === 'delivered'? 5 : req.params.status === 'ride'? 6 :
        req.params.status === 'gas'? 7: req.params.status === 'robber'? 8 : 9
        params.isActive = req.params.status === 'delivered' ? 0 : 1
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
        let pilot = await OrderRepository.getUserOrder(params.orderId)
        params.userId = pilot.user_id
        let order = await OrderRepository.updateOrderStatus(params)
        let updateUserOrder = await UserRepository.assignUserToOrder(params)
        res.json(pilot)            
    } catch (error) {
        console.log(error);
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
    }
}
