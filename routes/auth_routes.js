import {Router} from 'express'
const router = Router()
import * as userData from '../data/users.js'
import * as validate from '../validation.js'



router.route('/').get(async (req, res) => {
  //code here for GET, THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
  return res.json({error: 'YOU SHOULD NOT BE HERE!'});
});

router
  .route('/signupuser')
  .get(async (req, res) => {
    // Render Sign Up handlebar
    return res.render('signupuser')
  })
  .post(async (req, res) => {

  });

router
  .route('/signinuser')
  .get(async (req, res) => {
    // Render Sign In handlebar
    return res.render('signinuser')
  })
  .post(async (req, res) => {
    
  });

router.route('/user').get(async (req, res) => {

});

router.route('/administrator').get(async (req, res) => {

});

router.route('/signoutuser').get(async (req, res) => {
    
});

export default router