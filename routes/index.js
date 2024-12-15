import authRoutes from './auth_routes.js'
import userRoutes from './users.js'
import gymRoutes from './gyms.js'
import {static as staticDir} from 'express'; // serve static files

const constructorMethod = (app) => {
    app.use('/public', staticDir('public'));
    app.use('/', authRoutes);
    app.use('/users', userRoutes);
    app.use('/gyms', gymRoutes);
    app.use('*', (req, res) => {
        res.redirect('/');
    });
};

export default constructorMethod;