const express = require('express');
const router = express.Router();
const ordersController = require('../controller/orders.controller')
const usersController = require('../controller/users.controller')
const security = require('../src/utils/security')

function verfiyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];
    
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403)
    }
}

function authentication(req,res,next){
    //console.log(req.headers.token);
    let decryptToken = security.Decrypt(req.headers.token)
    console.log(
        {
            Reqtoken : JSON.parse(decryptToken),
            ResTokenValues : security.validateToken2(JSON.parse(decryptToken))
        }
    )
    //console.log(JSON.parse(decryptToken));
    if(security.validateToken(JSON.parse(decryptToken))){
        console.log('Go next');
        next();
    }else{
        res.sendStatus(403)
    }
}


router.get('/healthcheck', (req, res) => {
    res.json({succeded: true, payload: 'HealthCheck ok'})
    console.log('HealthCheck ok')
})

//obtener cuenta
router.post('/ylrequest', ordersController.setYL)
router.post('/wprequest/:storeId', ordersController.setWP)
router.get('/orders', ordersController.GetAllOrders)
router.get('/informationOrder/:orderId', ordersController.getInformationOrder)
router.get('/ordersByStatus/:orderStatus', ordersController.getAllActiveOrders)

//Available Pilots
router.get('/getAvailablePilots/', usersController.getAvailablePilots)
router.get('/getAssignedPilotsByStore/:storeId', usersController.getAssignedPilotsByStore)
router.get('/getPilotsToOrder/:storeId', usersController.getAvailablePilotsForAssignOrder)
router.post('/assignPilotToStore', usersController.assignPilotToStore)
router.post('/assignPilotToOrder', usersController.assignPilotToOrder)
router.delete('/disablePilotFromStore/:userId/:storeId', usersController.disablePilotFromStore)

module.exports = router