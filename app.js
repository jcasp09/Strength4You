import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';

const app = express();
const __dirname = path.resolve();

// Handlebars setup
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Static files setup
app.use('/public', express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
    console.log("Home route hit");
    res.render('home', { title: 'Welcome to Strength4You' });
});

// 404 error route
app.use('*', (req, res) => {
    console.log(`404 handler triggered for URL: ${req.originalUrl}`);
    res.status(404).render('error', {
        title: '404 Not Found',
        errorMessage: 'The page you are looking for does not exist.'
    });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
