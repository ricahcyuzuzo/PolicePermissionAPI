import Mongoose from 'mongoose';
import { validatePermissions } from '../helpers/validations/officerValidations';
import { requestPermissionBody } from '../models/body/permissions.body';
import moment from 'moment';
import permissionsModel from '../models/db/permissions.model';
import mongoose from 'mongoose';
import jwtDecode from 'jwt-decode';
import notificationsModel from '../models/db/notifications.model';

export const requestPermission = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = jwtDecode(token);
        const { startDate, endDate, reason } = req.body;
        const { error } = validatePermissions(requestPermissionBody(req));

        if(error){
            return res.status(400).json({
                message: error.details[0].message.replace(/"/g, '')
            })
        }

        const exists = await permissionsModel.find({ officerId: decodedToken.user._id });

        const date1 = moment(exists.startDate);
        const date2 = moment(exists.endDate);
        const dateToCheck = moment(startDate); 
        const dateToCheck2 = moment(endDate); 

        const isWithinRange = dateToCheck.isBetween(date1, date2, null, '[]');
        const isWithinRange2 = dateToCheck2.isBetween(date1, date2, null, '[]');

        if (isWithinRange || isWithinRange2) {
            return res.status(400).json({
                message: "You already requested on these dates" + startDate + " or " + endDate,
            })
        }

        const created = await permissionsModel.create({
            _id: new Mongoose.Types.ObjectId(),
            startDate,
            endDate,
            reason,
            status: 'pending',
            officer: decodedToken.user,
            officerId: decodedToken.user._id,
            createdAt: new Date(),
            updatedAt: new Date(),
        });


        if(created) {
            await notificationsModel.create({
                _id: new Mongoose.Types.ObjectId(),
                message: `${decodedToken.user.name} has requested a permission, please check it.`,
                title: `${decodedToken.user.name} Notification`,
                type: 'to-dpu',
                destination: 'DPU',
                createdAt: new Date(),
                updatedAt: new Date(),
            })

            return res.status(201).json({
                message: "Permission submitted successfully.",
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error
        });
    }
}

export const getPermissions = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = jwtDecode(token);
        
        const permissions = await permissionsModel.find({ officerId: decodedToken.user._id });
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

export const getOfficerNotifications = async (req, res) => {
    try {        
        const token = req.headers.authorization;
        const decodedToken = jwtDecode(token);

        const notifications = await notificationsModel.find({ destination: decodedToken.user._id });
        
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

