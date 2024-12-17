import authRoutes from './auth_routes.js'
import profileRoutes from './profiles.js'
import userRoutes from './users.js'
import gymRoutes from './gyms.js'
import apiRoutes from './api.js'
import {static as staticDir} from 'express'; // serve static files

const constructorMethod = (app) => {
    app.use('/public', staticDir('public'));
    app.use('/', authRoutes);
    app.use('/profile', profileRoutes);
    app.use('/users', userRoutes);
    app.use('/gyms', gymRoutes);
    app.use('/about', (req, res) => {res.render('aboutus')})
    app.use('/api', apiRoutes);
    app.use('*', (req, res) => {
        res.redirect('/');
    });
};

export default constructorMethod;