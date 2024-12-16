import { Router } from 'express';
import { ObjectId } from 'mongodb';
import * as userData from '../data/users.js';
import validation from '../validation.js'

const router = Router();
const key = 'admin'


// /users/signup functionality
router
  .route('/signup')
  .get(async (req, res) => {
    // Render signup page
    res.render('signupuser')
  })
  .post(async (req, res) => {
    // Render signin page
    const {firstName, lastName, userId, password, adminKey, email, dob, city, state} = req.body;

    // Invalid admin key: redirect to error page
    if (adminKey && adminKey !== key) {
      res.status(400).render('error', {error: 'Incorrect Admin password... We keep a tight ship around here mister!'})
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

    try {
      const newUser = await userData.createUser(firstName, lastName, userId, password, email, dob, city, state, role);
      if (!newUser) {
        res.status(500).render('error', {error: 'Could not add user'})
      }
      else {
        res.status(200).render('signinuser')
      }

    } catch (e) {
      res.status(400).render('error', {error: e})
    }
});

// /users/signin functionality
router
  .route('/signin')
  .get(async (req, res) => {
    // Render signup page
    res.render('signinuser')
  })
  .post(async (req, res) => {
    // Validate req.body Sign In form fields: userId and password)
    let userId, password
    try {
      userId = validation.checkUser(req.body.userId, 'User ID')
    } catch (e) {
      return res.status(400).render('signinuser', {error: e})
    }
    try {
      password = validation.checkPassword(req.body.password, 'Password')
    } catch (e) {
      return res.status(400).render('signinuser', {error: e})
    }

    try {
      const user = await userData.signInUser(userId, password);

      req.session.user = user
      return res.status(200).render('search')

    } catch (e) {
      res.status(400).render('error', {error: e})
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
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


export default router;
