const UserRepository = require('../repository/UserRepository')
const security = require('../src/utils/security')
exports.getAllStores = async(req, res, next)=>{
    try {
        let allStores = await UserRepository.getAllStores();
        res.json(allStores)            
    } catch (error) {
        console.log(error);
        next(createError(500));
    }
}

exports.verifyToken = async (req, res, next) =>{
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
            if (!user || user.length === 0)
                res.sendStatus(403)
            else{
                res.locals.user = user
                res.locals.userId = user[0].id
                next()
            }
        }
        else
            res.sendStatus(403)

    }
    else
        res.sendStatus(403)
}