import {Router} from 'express'
const router = Router()
import * as userData from '../data/users.js'
import * as validate from '../validation.js'



router.route('/').get(async (req, res) => {
  // rootRedirect middleware restricts access to this route 
  return res.json({error: 'YOU SHOULD NOT BE HERE!'})
});

router.route('/home').get(async (req, res) => {
  return res.render('home', { user: req.session.user });
});


router.route('/home/search').get(async (req, res) => {
  return res.render('search')
});



router.route('/signout').get(async (req, res) => {
  try {
    if (req.session) {
      // Destroy the session
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).render('error', {
            title: 'Sign Out Error',
            errorMessage: 'Failed to sign you out. Please try again.',
          });
        }

        // Clear the session cookie
        res.clearCookie('AuthenticationState');
        console.log('User successfully signed out.');

        // Render the dedicated signout page
        return res.render('signout', { title: 'Signed Out' });
      });
    } else {
      console.log('No active session to destroy. Redirecting to /home.');
      return res.redirect('/home');
    }
  } catch (e) {
    console.error('Unexpected error during sign out:', e.message);
    return res.status(500).render('error', {
      title: 'Sign Out Error',
      errorMessage: 'An unexpected error occurred. Please try again.',
    });
  }
});









export default router