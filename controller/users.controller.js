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
        let allPilots = await UserRepository.getAllUsersByType(3);
        let allAssignedPilots = await UserRepository.getStoreAssignedUsers(3)
        let params = {}
        params.storeId = req.params.storeId
        params.userType = 3
        //params.
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
