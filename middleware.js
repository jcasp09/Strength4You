// Middleware: called in app.js before configuring routes


// MW1: Redirects to signin or respective authorized pages
export const rootRedirect = async (req, res, next) => {
  if (req.path === '/') {
      // User is not authenticated, send to home screen
      if (!req.session.user) {
          return res.redirect('/home')
      }
      // User is signed in, send to search page
      else {
        return res.redirect('/home/search')
      }
  }
  next()
}

// MW2: Redirects all users and gyms so they cannot reaccess the signin page
export const signInRedirect = async (req, res, next) => {
  // User is already signed in (has an active session)
  if (req.session.user) {
      return res.redirect('/home/search')
  }
  // User is not signed in, let through to signin page
  next()
}

// MW3: Redirects all users (from both '/users/signup' and '/gyms/signup') so they cannot reaccess the signup page
export const signUpRedirect = async (req, res, next) => {
  // User is authenticated
  if (req.session.user) {
    return res.redirect('/home/search')
  }
  // User is not signed in, let through to signup page
  next()
}

// MW4: Redirects users to sign in if they are not, or falls through to end session
export const signOut = async (req, res, next) => {
  // User is not logged in
  if (!req.session.user) {
      return res.redirect('/signin')
  }
  // User is signed in, let through to signout page
  next()
}