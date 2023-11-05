import express from 'express';
import { login, register } from '../controllers/auth.controller';

const routes = express();

routes.post('/signup', register);
routes.post('/login', login);

const authRoutes = routes;
export default authRoutes;
