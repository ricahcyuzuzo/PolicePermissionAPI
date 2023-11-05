import Mongoose from 'mongoose';
import { validatAddOfficer } from '../helpers/validations/dpuValidations';
import { addOfficer } from '../models/body/user.body';
import userModel from '../models/db/users.model';
import permissionsModel from '../models/db/permissions.model';
import notificationsModel from '../models/db/notifications.model';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

export const AddAnOfficer = async (req, res) => {
    try {
        const { code, name, email } = req.body;
        const { error } = validatAddOfficer(addOfficer(req));
        
        if(error){
            return res.status(400).json({
                message: error.details[0].message.replace(/"/g, '')
            })
        }

        const resultsCode = await userModel.find({ code });
        
        if(resultsCode.length > 0) {
            return res.status(409).json({
                message: 'Code is already registered, please try another',
            })
        }
        
        const resultsEmail = await userModel.find({ email });

        if(resultsEmail.length > 0) {
            return res.status(409).json({
                message: 'Email is already registered, please try another',
            })
        }

        const created = await userModel.create({
            _id: new Mongoose.Types.ObjectId(),
            name,
            email,
            code,
            type: 'officer',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        if(created){
            res.status(201).json({
                message: 'Officer Created successfully',
            });
            return false;
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error
        })
    }
}

export const getAllPermissions = async (req, res) => {
    try {        
        const permissions = await permissionsModel.find({});
        return res.status(200).json({
            permissions
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error
        });
    }
}

export const getDPUNotifications = async (req, res) => {
    try {        
        const notifications = await notificationsModel.find({ destination: 'DPU' });
        return res.status(200).json({
            notifications
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error
        });
    }
}

export const acceptDeniePermissions = async (req, res) => {
    try {
        const { status, officerId, id } = req.body;
        const updated = await permissionsModel.findOneAndUpdate({ _id: id }, { status });
        const user = await userModel.findById(officerId);
        if(updated){
            await notificationsModel.create({
                _id: new Mongoose.Types.ObjectId(),
                message: `DPU has ${status} a permission, please check it.`,
                title: `Permission Notification`,
                type: 'to-officer',
                destination: officerId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const message = {
                to: user.expoPushToken,
                sound: 'default',
                title: `Permission Notification`,
                body: `${user.name}, your permission has been ${status}.`,
            };
            
            await axios.post('https://exp.host/--/api/v2/push/send', message , {
                headers: {
                    Accept: 'application/json',
                    'Accept-encoding': 'gzip, deflate',
                    'Content-Type': 'application/json'
                }
            });

            return res.status(201).json({
                message: 'Status updated successfully'
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong",
            error
        });
    }
}

