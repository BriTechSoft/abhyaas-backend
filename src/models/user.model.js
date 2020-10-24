const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    first_name : String,
    last_name: String,
    user_id: String,
    gender: String,
    email: String,
    phone: Number,
    password : String,
    examBoards : [mongoose.Types.ObjectId],
    mediums : [mongoose.Types.ObjectId],
    role : mongoose.Types.ObjectId,
    create_time : { type: Date, default: Date.now },
    update_time : { type: Date, default: Date.now },
    delete_time : { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
