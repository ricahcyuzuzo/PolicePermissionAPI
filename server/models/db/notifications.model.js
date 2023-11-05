import mongoose from "mongoose";

const notificationsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    message: String,
    title: String,
    type: String,
    destination: String,
    createdAt: String,
    updatedAt: String,
});

const notificationsModel = mongoose.model('Notifications', notificationsSchema);

export default notificationsModel;
