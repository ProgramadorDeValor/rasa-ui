const db = require('./db');
const logger = require('../util/logger');
const bcrypt = require('bcrypt');

async function login(req, res, next) {
    let username = String(req.body.username);
    let password = String(req.body.password);
    let user = await db.one("select * from auth_config where auth_type='user' and active='true' and user_name= $1", username)
    .then(function(data) {
       if(data === undefined) {
           return Promise.reject(false);
       }
       else {
            return Promise.resolve(data);
        }
        
    })
    .catch(function(err) {
        logger.winston.info('DB check error -> '+ err.message);
        return Promise.reject(false);
    });
    let match = await this.checkEncryptedString(password,user.user_password);
    return await Promise.all([user, match]);


}

async function checkEncryptedString (uncreptedString, encryptedString ) {
    return new Promise((resolve,reject) => 
    {
        bcrypt.compare(uncreptedString, encryptedString, function(err, compare) 
        {
            if (compare) {
                resolve(true); 
            }
            else {
                reject(false);
            }   
        });
    });
}

module.exports = {
    login,
    checkEncryptedString
};