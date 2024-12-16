import {Router} from 'express';
import {ObjectId} from 'mongodb';
import * as gymData from '../data/gyms.js';
import validation from '../validation.js'
import xss from 'xss'


const router = Router();

// /gyms/signup functionality
router
    .route('/signup')
    .get(async (req, res) => {
        // Render signup page
        return res.render('signupgym')
    })
    .post(async (req, res) => {
        // Clean data (xss)
        let name = xss(req.body.name)
        let userId = xss(req.body.userId)
        let password = xss(req.body.password)
        let email = xss(req.body.email)
        let address = xss(req.body.address)
        let monday = xss(req.body.monday)
        let tuesday = xss(req.body.tuesday)
        let wednesday = xss(req.body.wednesday)
        let thursday = xss(req.body.thursday)
        let friday = xss(req.body.friday)
        let saturday = xss(req.body.saturday)
        let sunday = xss(req.body.sunday)

        const hours = {monday, tuesday, wednesday, thursday, friday, saturday, sunday}
        const role = 'gym'

        // Attempt to Sign Up as a gym
        try {
            const newGym = await gymData.createGym(name, userId, password, email, address, hours, role);
            if (!newGym) {
                return res.status(500).render('error', {error: 'Could not add gym'})
            }
            // Render signin page
            else {
                return res.status(200).render('signingym')
            }
        } catch (e) {
            return res.status(400).render('error', {error: e})
        }
});

// /gyms/signin functionality
router
  .route('/signin')
  .get(async (req, res) => {
    // Render signup page
    return res.render('signingym')
  })
  .post(async (req, res) => {
    // Clean data (xss)
    let userId = xss(req.body.userId)
    let password = xss(req.body.password)
    
    // Attempt to Sign In as a gym
    try {
      const gym = await gymData.signInGym(userId, password);

      if (!gym) {
        return res.status(500).render('error', {error: 'Could not sign in gym'})
      }
      // Create session / Render signin page
      else {
        req.session.user = gym
        return res.status(200).render('search')
      }
    } catch (e) {
        return res.status(400).render('error', {error: e})
    }
});


// Get a gym by objectId
router.get('/:id', async (req, res) => {
    // Render gym profile page
});

// Update a gym profile using obectId
router.patch('/:id', async (req, res) => {
    // User role must be gym or admin, gyms can only update their own gym profile
});

// Delete a gym profile by objectId
router.delete('/:id', async (req, res) => {
    // User role must be gym or admin, gyms can only delete their own gym profile

});


export default router;
  