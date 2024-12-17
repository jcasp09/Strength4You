import { Router } from 'express';
import { ObjectId } from 'mongodb';
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
    return res.render('signingym');
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
      return res.status(400).render('error', { error: e });
    }
  });

// Get a gym by objectId
router.get('/:id', async (req, res) => {
  try {
    const gymId = validation.checkId(req.params.id, 'Gym ID'); 
    const gym = await gymData.getGymById(gymId); 
    if (!gym) throw 'Gym not found'; 
    return res.status(200).render('gymprofile', { gym }); // Render gym profile page
  } catch (e) {
    return res.status(404).render('error', { error: e });
  }
});

// Update a gym profile using objectId
router.patch('update/:id', async (req, res) => {
  const { id } = req.params; 
  const { name, email, address, hours } = req.body;

  try {
    const validatedId = validation.checkId(id, 'Gym ID');
    const updatedFields = {};

    if (Object.keys(updatedFields).length === 0) throw 'No valid fields to update'; 

    const updatedGym = await gymData.updateGym(validatedId, updatedFields); // Update gym data
    return res.status(200).render('gymprofile', { gym: updatedGym }); // Render updated gym profile page
  } catch (e) {
    return res.status(400).render('error', { error: e });
  }
});

// Delete a gym profile by objectId
router.delete('/:id', async (req, res) => {
  try {
    const gymId = validation.checkId(req.params.id, 'Gym ID'); 
    const deletionResult = await gymData.deleteGym(gymId); // Delete gym by ID
    if (!deletionResult) throw 'Could not delete gym'; // Ensure deletion succeeded
    return res.status(200).render('success', { message: 'Gym successfully deleted' });
  } catch (e) {
    return res.status(400).render('error', { error: e });
  }
});

export default router;
