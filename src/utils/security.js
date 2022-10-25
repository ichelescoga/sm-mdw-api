'use strict'
const CryptoJS = require('crypto-js')
const shortSecret = process.env.SHORTSECRET
const secret = process.env.SECRET
const jwt = require('jsonwebtoken');

let generateToken = async (userCredential) => {
    console.log(userCredential)
    let stringUser = JSON.stringify(userCredential)
    console.log(stringUser)
    const accessToken = await jwt.sign(JSON.stringify(userCredential), secret)
    //const accessToken = await jwt.sign('holamundo', secret)
    return accessToken
}

let decodeToken = (accessToken) =>{
    try {
        let decoded = jwt.verify(accessToken, secret)
        console.log(decoded)
        return decoded    
    } catch (error) {
        console.log(error)
        return undefined
    }
    
    /*
    jwt.verify(accessToken, secret, (err, decoded) =>{
        if (err)
            return err
        else{
            console.log(decoded)
            return decoded
        }
    })*/
}



function Decrypt(encrypted_json_string){
    //console.log(shortSecret);
    var obj_json = JSON.parse(encrypted_json_string);
    var encrypted = obj_json.ciphertext;
    var salt = CryptoJS.enc.Hex.parse(obj_json.salt);
    var iv = CryptoJS.enc.Hex.parse(obj_json.iv);  
    var key = CryptoJS.PBKDF2(shortSecret, salt, { hasher: CryptoJS.algo.SHA512, keySize: 64/8, iterations: 999});
    var decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv});
    
    return decrypted.toString(CryptoJS.enc.Utf8);
}

function validateToken(jsonUnixTime){
    if(jsonUnixTime.key == secret){
        let currentTime = new Date()
        let unixCurrentTime = parseInt((currentTime.getTime() / 1000).toFixed(0))
        console.log(unixCurrentTime)
        return (unixCurrentTime <= (parseInt(jsonUnixTime.fechaUnix) + 20))
    }
    return false;   
}

function validateToken2(jsonUnixTime){
    let currentTime = new Date()
    let unixCurrentTime = parseInt((currentTime.getTime() / 1000).toFixed(0))
    let variable = {
        key : secret,
        unixTime : unixCurrentTime
    }
    return variable;
}

module.exports = {Decrypt,validateToken,validateToken2, generateToken, decodeToken};