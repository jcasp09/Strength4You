import { Router } from 'express';
import { ObjectId } from 'mongodb';
import * as gymData from '../data/gyms.js';
import validation from '../validation.js';

const router = Router();

// /gyms/signup functionality
router
  .route('/signup')
  .get(async (req, res) => {
    // Render signup page
    return res.render('signupgym');
  })
  .post(async (req, res) => {
    // Render signin page
    const hours = {
      monday: req.body.monday,
      tuesday: req.body.tuesday,
      wednesday: req.body.wednesday,
      thursday: req.body.thursday,
      friday: req.body.friday,
      saturday: req.body.staturday,
      sunday: req.body.sunday,
    };
    const { name, userId, password, email, address } = req.body;

    const role = 'gym';

    try {
      const newGym = await gymData.createGym(
        name,
        userId,
        password,
        email,
        address,
        hours,
        role
      );
      if (!newGym) {
        return res
          .status(500)
          .render('error', { error: 'Could not add gym' });
      } else {
        return res.status(200).render('signingym');
      }
    } catch (e) {
      return res.status(400).render('error', { error: e });
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
    // Validate req.body Sign In form fields: userId and password
    let userId, password;
    try {
      userId = validation.checkUser(req.body.userId, 'User ID');
    } catch (e) {
      return res.status(400).render('signingym', { error: e });
    }
    try {
      password = validation.checkPassword(req.body.password, 'Password');
    } catch (e) {
      return res.status(400).render('signingym', { error: e });
    }

    try {
      const gym = await gymData.signInGym(userId, password);

      req.session.user = gym;
      return res.status(200).render('search');
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
router.patch('/:id', async (req, res) => {
  const { id } = req.params; 
  const { name, email, address, hours } = req.body;

  try {
    const validatedId = validation.checkId(id, 'Gym ID');
    const updatedFields = {};

    if (name) updatedFields.name = validation.checkString(name, 'Gym Name');
    if (email) updatedFields.email = validation.checkEmail(email);
    if (address) updatedFields.address = validation.checkString(address, 'Gym Address');
    if (hours) updatedFields.hours = validation.checkHours(hours);

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
