import express from 'express';
import { AddAnOfficer, acceptDeniePermissions, getAllPermissions, getDPUNotifications } from '../controllers/dpu.controller';

const routes = express();

routes.post('/officer', AddAnOfficer);
routes.get('/all-permissions', getAllPermissions);
routes.patch('/permission', acceptDeniePermissions);
routes.get('/notifications', getDPUNotifications);

const dpuRoutes = routes;
export default dpuRoutes;
