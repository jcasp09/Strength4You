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
        return res.redirect('/home'); // Non-authenticated users redirected to home
    }
    const role = req.session.user.role;
    
    // Allow gym users to access their own profile
    if (role === 'gym' && req.originalUrl === "/profile/gym") {
        return res.redirect('/profile/gym');
    }

    // Allow users to access other gym info (e.g., /profile/gym/:id)
    if (role === 'user' && req.originalUrl === "/profile/user") {
        return res.redirect('/profile/user');
    }
    
    // Do not redirect if accessing /profile/gym/:id
    if (/^\/profile\/gym\/[a-fA-F0-9]{24}$/.test(req.originalUrl)) {
        return next();
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
