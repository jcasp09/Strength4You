import authRoutes from './auth_routes.js'
import userRoutes from './users.js'
import gymRoutes from './gyms.js'
import reviewRoutes from './reviews.js'
import commentRoutes from './comments.js'
import {static as staticDir} from 'express'; // serve static files

const constructorMethod = (app) => {
    app.use('/public', staticDir('public'));
    app.use('/', authRoutes);
    app.use('/users', userRoutes);
    app.use('/gyms', gymRoutes);
    app.use('/reviews', reviewRoutes);
    app.use('/comments', commentRoutes);
    app.use('*', (req, res) => {
        res.redirect('/');
    });
};

export default constructorMethod;