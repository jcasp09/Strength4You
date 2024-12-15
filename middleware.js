const middleware = {
    // Logs every request to the server
    requestLogger: (req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
      next();
    },
  
    // Middleware to check if a user is logged in
    isAuthenticated: (req, res, next) => {
      if (!req.session.user) {
        return res.status(403).render('error', {
          title: 'Access Denied',
          errorMessage: 'You must be signed in to access this page.',
        });
      }
      next();
    },
  
    // 404 Not Found Handler
    notFoundHandler: (req, res) => {
      res.status(404).render('error', {
        title: '404 Not Found',
        errorMessage: 'The page you are looking for does not exist.',
      });
    },
  
    // Centralized Error Handler
    errorHandler: (err, req, res, next) => {
      console.error(err.stack);
      res.status(500).render('error', {
        title: 'Server Error',
        errorMessage: 'An unexpected error occurred on the server.',
      });
    },
  };
  
  export default middleware;
  