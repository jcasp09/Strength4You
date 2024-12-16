import {Router} from 'express'
const router = Router()
import * as userData from '../data/users.js'
import * as validate from '../validation.js'



router.route('/').get(async (req, res) => {
  // rootRedirect middleware restricts access to this route 
  return res.json({error: 'YOU SHOULD NOT BE HERE!'})
});

router.route('/home').get(async (req, res) => {
  return res.render('home')
});

router.route('/home/search').get(async (req, res) => {
  return res.render('search')
});



router
  .route('/signin')
  .get(async (req, res) => {
    // Render Sign In handlebar
    return res.render('signin')
  })
  .post(async (req, res) => {
    // Submit signin request
    
});



router.route('/signoutuser').get(async (req, res) => {
  // Render Sign out handlebar after destroying user's session
  req.session.destroy()
  return res.render('signout')
});

export default router