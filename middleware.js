// Middleware: called in app.js before configuring routes


// Redirects to signin or respective authorized pages
export const applyMiddleware = (app) => {
  // MW1: Logging Middleware
  app.use((req, res, next) => {
    const timestamp = new Date().toUTCString();
    const method = req.method;
    const route = req.originalUrl;
    const authenticated = req.session.user ? 'Authenticated' : 'Non-Authenticated';
    console.log(`[${timestamp}] ${method} ${route} (${authenticated})`);
    next();
  });

  // MW2: Root Redirect Middleware
  app.use((req, res, next) => {
    if (req.path === '/') {
      if (!req.session.user) {
        return res.redirect('/home'); // Non-authenticated users to home
      } else {
        return res.redirect('/home/search'); // Authenticated users to search
      }
    }
    next();
  });

  // MW3: Sign-in Redirect
  app.use('/users/signin', (req, res, next) => {
    if (req.session.user) {
      return res.redirect('/home/search'); // Already signed-in users to search
    }
    next();
  });

  // MW4: Sign-in Redirect
  app.use('/gyms/signin', (req, res, next) => {
    if (req.session.user) {
      return res.redirect('/home/search');
    }
    next();
  });

  // MW5: Sign-up Redirect
  app.use(['/users/signup', '/gyms/signup'], (req, res, next) => {
    if (req.session.user) {
      return res.redirect('/home/search'); // Prevent access if already signed in
    }
    next();
  });

  // MW6: Sign Out Middleware
  app.use('/signout', (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/home'); // Redirect to home if no session
    }
    next();
  });
};
