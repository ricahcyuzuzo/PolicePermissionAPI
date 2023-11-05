import mongoose from "mongoose";

const permissionsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    startDate: String,
    endDate: String,
    reason: String,
    status: String,
    officer: String,
    officerId: String,
    createdAt: String,
    updatedAt: String,
});

const permissionsModel = mongoose.model('Permissions', permissionsSchema);

export default permissionsModel;
