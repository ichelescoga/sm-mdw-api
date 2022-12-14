const express = require('express');
const router = express.Router();
const ordersController = require('../controller/orders.controller')
const usersController = require('../controller/users.controller')
const authController = require('../controller/auth.controller')
const alohaController = require('../controller/aloha.controller')
const security = require('../src/utils/security')
const UserRepository = require('../repository/UserRepository')
const validateRequest = require('../services/auth-middleware')

verifyToken = async (req, res, next) =>{
    let nonce = req.headers['authorization'];
    console.log(nonce)
    //next()
    //return
    if (nonce){
        nonce = nonce.replace("\"", "")
        nonce = nonce.replace("\"", "")
        let decodedNonce = await security.decodeToken(nonce)
        console.log(decodedNonce)
        if (decodedNonce && decodedNonce.email){
            let params = {}
            params.username = decodedNonce.email
            let user = await UserRepository.getUserByEmail(params)
            if (!user)
                res.sendStatus(403)
            else
                next()
        }
        else
            res.sendStatus(403)

    }
    else
        res.sendStatus(403)
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
//Envio de orden de compra proveniente de WP a order manager
router.post('/ylrequest', validateRequest.verifyToken, ordersController.setYL)
//Envio de orden de compra proveniente de Yalo a order manager
router.post('/wprequest', validateRequest.verifyToken, ordersController.setWP)
router.get('/orders', validateRequest.verifyToken, ordersController.GetAllOrders)
router.get('/informationOrder/:orderId', validateRequest.verifyToken, ordersController.getInformationOrder)
router.get('/ordersByStoreAndType/:storeId/:orderType', validateRequest.verifyToken, ordersController.getAllActiveOrders)
router.put('/updateOrder/:status', validateRequest.verifyToken, usersController.updateOrderStatus)
router.put('/updateOrderEmergency/:status', validateRequest.verifyToken, usersController.updateOrderStatus)
router.get('/getRawAndMiddlewareOrder/:orderId', validateRequest.verifyToken, alohaController.getRawAndMiddlewareOrder)
router.post('/setOrderToAlohaById/:orderId', validateRequest.verifyToken, alohaController.setOrderToAlohaById)

//Available Pilots
router.get('/getAvailablePilots/:userType', validateRequest.verifyToken, usersController.getAvailablePilots)
router.get('/getAssignedPilotsByStore/:storeId', validateRequest.verifyToken, usersController.getAssignedPilotsByStore)
router.get('/getAssignedUsersToStore/:userType', validateRequest.verifyToken, usersController.getAssignedUsers)
router.get('/getAvailablePilotsToOrder/:storeId', validateRequest.verifyToken, usersController.getAvailablePilotsForAssignOrder)
router.post('/assignPilotToStore', validateRequest.verifyToken, usersController.assignPilotToStore)
router.post('/assignPilotToOrder', validateRequest.verifyToken, usersController.assignPilotToOrder)
router.post('/assignOrderToStore', validateRequest.verifyToken, ordersController.assignOrderToStore)
router.delete('/disablePilotFromStore/:userId/:storeId', validateRequest.verifyToken, usersController.disablePilotFromStore)
router.get('/ordersByStoreAndPilot/:storeId/:userId', validateRequest.verifyToken, usersController.getAllActiveOrdersByPilot)

router.post('/createUser', validateRequest.verifyToken, usersController.createUser)
router.post('/createEnterprise', validateRequest.verifyToken, usersController.createEnterprise)
router.put('/updateUser', validateRequest.verifyToken, usersController.updateUser)
router.put('/deactiveUser/:userId', validateRequest.verifyToken, usersController.deactiveUser)
router.put('/updateUserPass', validateRequest.verifyToken, usersController.updateUserPassword)
router.get('/getAllUsers', validateRequest.verifyToken, usersController.getAllUsers)
router.get('/getAllUsersAssignedToStore', validateRequest.verifyToken, usersController.getAllUsersAssignedToStore)
router.get('/getAllEnterprises', validateRequest.verifyToken, usersController.getAllEnterprises)
router.get('/getAllStores', validateRequest.verifyToken, usersController.getAllStores)

router.post('/signin',authController.signIn)
router.post('/fakeToken',authController.fakeToken)

module.exports = router