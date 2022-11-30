const UserRepository = require('../repository/UserRepository')
const security = require('../src/utils/security')
const createError = require("http-errors");

exports.signIn = async(req, res, next)=>{
    try {
        
        let userCredential = req.body.password
        let accessToken = await security.generateToken(userCredential)
        console.log(accessToken)
        if (accessToken){
            let params = {}
            params.username = req.body.username
            params.token = accessToken
            let user = await UserRepository.getUserByCredential(params)
            if (!user)
                user = await UserRepository.getUserByDpiCredential(params)
            if (user){
                let userInformation = {}
                userInformation.email = user.email
                userInformation.user_type = user.user_type
                userInformation.date_time = new Date()
                let nonce = await security.generateToken(userInformation)
                //res.json(user)
                console.log(nonce)
                if (nonce){
                    res.json({
                        userInformation: user,
                        accessToken: nonce
                    })
                }
                else 
                    res.sendStatus(403)
            }                
            else 
                res.sendStatus(403)
        }
        //let encryptedToken = 'eyJhbGciOiJIUzI1NiJ9.e30.JJbD_qW3vJ6EK9TpUg3WoEZB0aiAgmM9z1PjpyqbcZg'
        //security.decodeToken(accessToken)
        //res.json(accessToken)            
    } catch (error) {
        console.log(error);
        res.sendStatus(403)
    }
}

exports.fakeToken = async(req, res, next)=>{
    try {
        let userCredential = req.body.password
        //userCredential.username = req.body.username
        //userCredential.password = req.body.password
        let accessToken = await security.generateToken(userCredential)
        console.log(accessToken)
        res.json(accessToken)            
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}