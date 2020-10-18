const User = require('../models/user.model.js');
const commonModule = require('./common.module')
var grpc = require('grpc');
const bcrypt = require('bcryptjs');

// Create and Save a new U
exports.CreateUser = (call, callback) => {
    const user = call.request.user;
    // Validate request
    if (!user) {
        callback({
            code: grpc.status.INVALID_ARGUMENT,
            message: "User not defined",
        });
    }
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    user.password = hashedPassword;
    user.create_time = new Date().toISOString();
    user.update_time = new Date().toISOString();
    user.delete_time = null;
     // Create a User
     const userMongo = new User(user);
     console.log(userMongo)

    // Save User in the database
    userMongo.save().then(data => {
        let response = commonModule.buildResponse("users", data)
        callback(null, response);
        console.log(`Successfully inserted a user with name: ${response.user_id}`)
    }).catch(err => {
        console.log("-----------------Error-------------------")
        console.log(err)
        callback(err);
    });
};

// Retrieve and return all users from the database.
exports.ListUsers = (req, res) => {

};

// Find a single user with a userId
exports.GetUser = (req, res) => {

};

// Update a note identified by the userId in the request
exports.UpdateUser = (req, res) => {

};

// Delete a user with the specified userid in the request
exports.DeleteUser = (req, res) => {

};
