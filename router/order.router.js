const express = require('express');
const router = express.Router();
const ordersController = require('../controller/orders.controller')
const usersController = require('../controller/users.controller')
const authController = require('../controller/auth.controller')
const security = require('../src/utils/security')
const UserRepository = require('../repository/UserRepository')

verfiyToken = async (req, res, next) =>{
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
router.post('/ylrequest', verfiyToken, ordersController.setYL)
router.post('/wprequest', verfiyToken, ordersController.setWP)
router.get('/orders', verfiyToken, ordersController.GetAllOrders)
router.get('/informationOrder/:orderId', verfiyToken, ordersController.getInformationOrder)
router.get('/ordersByStoreAndType/:storeId/:orderType', verfiyToken, ordersController.getAllActiveOrders)
router.put('/updateOrder/:status', verfiyToken, usersController.updateOrderStatus)
router.put('/updateOrderEmergency/:status', verfiyToken, usersController.updateOrderStatus)

//Available Pilots
router.get('/getAvailablePilots/', verfiyToken, usersController.getAvailablePilots)
router.get('/getAssignedPilotsByStore/:storeId', verfiyToken, usersController.getAssignedPilotsByStore)
router.get('/getAvailablePilotsToOrder/:storeId', verfiyToken, usersController.getAvailablePilotsForAssignOrder)
router.post('/assignPilotToStore', verfiyToken, usersController.assignPilotToStore)
router.post('/assignPilotToOrder', verfiyToken, usersController.assignPilotToOrder)
router.delete('/disablePilotFromStore/:userId/:storeId', verfiyToken, usersController.disablePilotFromStore)
router.get('/ordersByStoreAndPilot/:storeId/:userId', verfiyToken, usersController.getAllActiveOrdersByPilot)

router.post('/signin',authController.signIn)
router.post('/fakeToken',authController.fakeToken)

module.exports = router