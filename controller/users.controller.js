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
        res.json(allPilots)            
    } catch (error) {
        console.log(error);
    }
}

