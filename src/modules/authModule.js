const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model.js');
var grpc = require('@grpc/grpc-js');
const secret = process.env.secret;
/**
 * Implements the GetToken RPC method.
 */
exports.GetToken = (call, callback) => {
    const name = call.request.user;
    const password = call.request.password;
    checkCredentials(name, password, callback);
}

// Check the user credentails and generate the jwt token
const checkCredentials = (userId, password, callback) => {
    User.findOne({
        "user_id": {
            $eq: userId
        },
        "delete_time": {
            $eq: null
        },
    }).then(user => {
        if (!user) {
            callback({
                code: grpc.status.NOT_FOUND,
                message: "User does not exist",
            });
        }else {
            bcrypt.compare(password, user.password, (error, data) => {
                //if error than throw error
                if (error) throw error

                //if both match than you can do anything
                if (data) {
                    console.log("Login Success!!");
                    let payload = {
                        first_name: user.first_name,
                        last_name: user.last_name,
                        user_id: user.user_id,
                        gender: user.gender,
                        email: user.email,
                        phone: user.phone,
                        examBoards: user.examBoards,
                        mediums: user.mediums,
                        role: user.role,
                    }

                    // create a token
                    let token = jwt.sign(payload, secret, {
                        expiresIn: 86400 // expires in 24 hours
                    })
                    callback(null, {
                        token: token
                    });
                } else {
                    console.log("Invalid credentails");
                }
            })
        }
    });
}
