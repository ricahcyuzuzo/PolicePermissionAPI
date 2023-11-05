import mongoose from "mongoose";

const usersSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    code: String,
    password: String,
    type: String,
    expoPushToken: String,
    createdAt: String,
    updatedAt: String,
});

const userModel = mongoose.model('users', usersSchema);

export default userModel;
