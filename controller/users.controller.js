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

