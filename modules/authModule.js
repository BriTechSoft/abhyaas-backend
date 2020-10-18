const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const secret = process.env.secret;
/**
 * Implements the GetToken RPC method.
 */
function GetToken(call, callback) {
    const name = call.request.user;
    const password = call.request.password;
    const hashedPassword = bcrypt.hashSync(password, 10);
    // create a token
    let token = jwt.sign({
        id: name,
        password : hashedPassword
    }, secret, {
        expiresIn: 86400 // expires in 24 hours
    })
    callback(null, {
        token: token
    });
}

let authModule = {
    GetToken: GetToken,
}
module.exports = authModule;
