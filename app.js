import express from 'express';
const app = express();
import exphbs from 'express-handlebars';
import configRoutes from './routes/index.js';
import session from 'express-session'
import * as mw from './middleware.js'


const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    // If the user posts to the server with a property called _method, rewrite the request's method
    // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
    // rewritten in this middleware to a PUT route
    if (req.body && req.body._method) {
      req.method = req.body._method;
      delete req.body._method;
    }
  
    // let the next middleware run:
    next();
};

app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(rewriteUnsupportedBrowserMethods);

// Create session
app.use(session({
    name: 'AuthenticationState',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 300000}
}))

// Call middleware (ex: app.use('/signinuser', mw.signInRedirect) )
app.use(mw.rootRedirect)
app.use('/users/signin', mw.signInRedirect)
app.use('/gyms/signin', mw.signInRedirect)
app.use('/users/signup', mw.signUpRedirect)
app.use('/gyms/signup', mw.signUpRedirect)
app.use('/signout', mw.signOut)

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

configRoutes(app);


app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});