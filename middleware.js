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
  app.use(['/users/signin', '/gyms/signin'], (req, res, next) => {
    if (req.session.user) {
      return res.redirect('/home'); // Prevent access if already signed in
    }
    next();
  });

  // MW4: Sign-up Redirect
  app.use(['/users/signup', '/gyms/signup'], (req, res, next) => {
    if (req.session.user) {
      return res.redirect('/home/search'); // Prevent access if already signed in
    }
    next();
  });

  // MW5: Profile Redirect
  app.use('/profile', (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/home'); // Redirect if not authenticated
    }

    const role = req.session.user.role;

    if (req.originalUrl === '/profile') { // Redirect ONLY if the path is /profile
        if (role === 'user') {
            return res.redirect('/profile/user');
        } else if (role === 'gym') {
            return res.redirect('/profile/gym');
        }
    }

    next(); // Allow all other routes to proceed
});





  // MW6: Sign Out Middleware
  app.use('/signout', (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/home'); // Redirect to home if no session
    }
    next();
  });

  app.use('/users/update/:id', (req, res, next) => {
    if (req.method === "POST")
      req.method = "PATCH"
    next();
  })

  app.use('/gyms/update/:id', (req, res, next) => {
    if (req.method === "POST")
      req.method = "PATCH"
    next();
  })
};
