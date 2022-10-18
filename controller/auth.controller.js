const security = require('../src/utils/security')

exports.signIn = async(req, res, next)=>{
    try {
        
        let userCredential = {}
        userCredential.username = req.body.username
        userCredential.password = req.body.password
        let accessToken = await security.generateToken(userCredential)
        res.json(accessToken)            
    } catch (error) {
        console.log(error);
    }
}