const User = require('../models/user.model.js');
const commonModule = require('./common.module');
const jsqlParserModule = require("./jsqlParserModule");
var grpc = require('@grpc/grpc-js');
const bcrypt = require('bcryptjs');

// Create and Save a new User
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
exports.ListUsers = (call, callback) => {
    const page_size = call.request.page_size;
    const page_token = call.request.page_token;
    let query = jsqlParserModule.getWhereClause(call.request.filter, call.request.show_deleted);
    const order_by_Object = commonModule.getOrderByObject(call.request.order_by);

    User.find(query)
        .limit(page_size)
        .skip(page_size * page_token)
        .sort(order_by_Object)
        .exec(function (err, users) {
            var response = {
                'users': users,
                next_page_token: page_token + 1
            }
            User.count().exec(function (err1, count) {
                response.total_size = count;
                callback(null, response);
            })
        })
};

// Find a single user with a userId
exports.GetUser = (call, callback) => {
    const name = call.request.name;
    const id = commonModule.get_Id(name);

    User.findById(id)
        .then(data => {
            let response = commonModule.buildResponse("users", data)
            callback(null, response);
            console.log(`Successfully retrieved a user with user_id: ${response.user_id}`)
        }).catch(err => {
            console.log(err)
            callback(err);
        });
};

// Update a note identified by the userId in the request
exports.UpdateUser = (call, callback) => {
    const user = call.request.user;
    const update_mask = call.request.update_mask;

    // Validate request
    if (!user) {
        callback({
            code: grpc.status.INVALID_ARGUMENT,
            message: "User not defined",
        });
    }

    let updateCollection = {};
    update_mask.paths.forEach(e => {
        console.log(e);
        updateCollection[e] = user[e];
    })

    updateCollection.update_time = new Date().toISOString();
    const id = commonModule.get_Id(user.name);

    // Find the user and update fields
    User.findByIdAndUpdate(id, updateCollection, {
            new: true
        })
        .then(data => {
            let response = commonModule.buildResponse("users", data)
            callback(null, response);
            console.log(`Successfully updated a user with user_id: ${response.user_id}`)
        }).catch(err => {
            console.log(err)
            callback(err);
        });
};

// Delete a user with the specified userid in the request
exports.DeleteUser = (call, callback) => {
    const name = call.request.name;
    // Validate request
    if (!name) {
        callback({
            code: grpc.status.INVALID_ARGUMENT,
            message: "User not defined",
        });
    }
    const id = commonModule.get_Id(name);
    // Find the user and update delete time
    User.findByIdAndUpdate(id, {
            delete_time: new Date().toISOString()
        })
        .then(user => {
            let response = commonModule.buildResponse("users", user)
            callback(null, response);
            console.log(`Successfully updated a user with user_id: ${response.user_id}`)
        }).catch(err => {
            console.log(err)
            callback(err);
        });
};

// Update user identified by the userId in the request
exports.UpdateUserPassword = (call, callback) => {
    const user = call.request.user;
    const update_mask = call.request.update_mask;

    // Validate request
    if (!user) {
        callback({
            code: grpc.status.INVALID_ARGUMENT,
            message: "User not defined",
        });
    }

    console.log(user)
    // Encrypt Password
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    user.password = hashedPassword;

    let updateCollection = {};

    update_mask.paths.forEach(e => {
        console.log(e);
        updateCollection[e] = user[e];
    })

    updateCollection.update_time = new Date().toISOString();

    // Find the user and update fields
    User.findOneAndUpdate({
        "user_id": user.user_id
        }, {$set:updateCollection} , {
            new: true
        })
        .then(data => {
            console.log(data)
            let response = commonModule.buildResponse("users", data)
            callback(null, response);
            console.log(`Successfully updated a user with user_id: ${response.user_id}`)
        }).catch(err => {
            console.log(err)
            callback(err);
        });
};
