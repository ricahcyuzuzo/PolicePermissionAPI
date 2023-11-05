import Mongoose from 'mongoose';
import userModel from '../models/db/users.model';
import { validateAuth } from '../helpers/validations/authValidations';
import { registerAndLogin } from '../models/body/user.body';
import { comparePassword, generateToken, hashPassword } from '../helpers/authentication';

export const register = async (req, res) => {
    try {
        const { code, password } = req.body;
        const { error } = validateAuth(registerAndLogin(req));
        
        if(error){
            return res.status(400).json({
                message: error.details[0].message.replace(/"/g, '')
            })
        }

        const resultsUser = await userModel.findOne({ code });

        if(!resultsUser) {
            return res.status(401).json({
                message: 'Your code can\'t be found. Contact the DPU Office for this matter.', 
            });
        }

        const created = await userModel.findOneAndUpdate({ code }, { password: hashPassword(password) });
        
        if(created){
            res.status(201).json({
                message: 'Account Activated successfully',
            });
            return false;
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error
        });
    }
}

export const login = async (req, res) => {
    try {
        const { code, password, expoPushToken } = req.body;
        console.log(expoPushToken);
        const { error } = validateAuth(registerAndLogin(req));

        if(error){
            return res.status(400).json({
                message: error.details[0].message.replace(/"/g, '')
            })
        }

        const resultsUser = await userModel.findOne({ code });

        if(!resultsUser) {
            return res.status(401).json({
                message: 'Invalid Code or Password', 
            });
        }

        const isPasswordTrue = comparePassword(password, resultsUser.password);
        
        if(!isPasswordTrue) {
            return res.status(401).json({
                message: 'Invalid Code or Password', 
            });
        }
        await userModel.findOneAndUpdate({ code }, { expoPushToken });
        return res.status(200).json({
            token: generateToken(resultsUser), 
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error
        });
    }
}
