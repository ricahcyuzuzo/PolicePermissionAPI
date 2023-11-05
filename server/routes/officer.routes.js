import express from 'express';
import { getOfficerNotifications, getPermissions, requestPermission } from '../controllers/officer.controller';

const routes = express();

routes.post('/permission', requestPermission);
routes.get('/permission', getPermissions);
routes.get('/officer-notifications', getOfficerNotifications);

const officerRoutes = routes;
export default officerRoutes;
