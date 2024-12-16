import { Router } from 'express';
import { ObjectId } from 'mongodb';
import * as userData from '../data/users.js';
import validation from '../validation.js'
import xss from 'xss'


const router = Router();
const key = 'admin'


// /users/signup functionality
router
  .route('/signup')
  .get(async (req, res) => {
    // Render signup page
    return res.render('signupuser')
  })
  .post(async (req, res) => {
    // Clean data (xss)
    let firstName = xss(req.body.firstName)
    let lastName = xss(req.body.lastName)
    let userId = xss(req.body.userId)
    let password = xss(req.body.password)
    let adminKey = xss(req.body.adminKey)
    let email = xss(req.body.email)
    let dob = xss(req.body.dob)
    let city = xss(req.body.city)
    let state = xss(req.body.state)

    
    // Invalid admin key: redirect to error page
    if (adminKey && adminKey !== key) {
      return res.status(400).render('error', {error: 'Incorrect Admin password... We keep a tight ship around here mister!'})
    }
    let role
    // adminKey is valid: admin
    if (adminKey === key) {
      role = 'admin'
    }
    // no adminKey entered: user
    else {
      role = 'user'
    }

    
    // Attempt to Sign Up as a user
    try {
      const newUser = await userData.createUser(firstName, lastName, userId, password, email, dob, city, state, role);
      if (!newUser) {
        return res.status(500).render('error', {error: 'Could not add user'})
      }
      // Render signin page
      else {
        return res.status(200).render('signinuser')
      }
    } catch (e) {
      return res.status(400).render('error', {error: e})
    }
});

// /users/signin functionality
router
  .route('/signin')
  .get(async (req, res) => {
    // Render signup page
    return res.render('signinuser')
  })
  .post(async (req, res) => {
    // Clean data (xss)
    let userId = xss(req.body.userId)
    let password = xss(req.body.password)

    // Attempt to Sign In as a user
    try {
      const user = await userData.signInUser(userId, password)

      if (!user) {
        return res.status(500).render('error', {error: 'Could not sign in user'})
      }
      // Create session / Render signin page
      else {
        req.session.user = user
        return res.status(200).render('search')
      }
    } catch (e) {
      return res.status(400).render('error', {error: e})
    }
});




// Get a user by ID
router.get('/:id', async (req, res) => {
  // Render user profile page
  const { id } = req.params;

  try {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid ObjectId');
    }
    const user = await userData.getUserById(id);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// Update a user by ID
router.patch('/:id', async (req, res) => {
  // User role must be user or admin, users can only update their own profile
  const { id } = req.params;
  const updatedData = req.body;

  try {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid ObjectId');
    }
    const updatedUser = await userData.updateUser(id, updatedData);
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
  // User role must be user or admin, users can only delete their own profile
  const { id } = req.params;

  try {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid ObjectId');
    }
    const result = await userData.deleteUser(id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});


export default router;
