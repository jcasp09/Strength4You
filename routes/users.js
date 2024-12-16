// import necessary libraries and user data functions
// Import necessary libraries and user data functions
// Import necessary libraries and user data functions
import { Router } from 'express';
import { ObjectId } from 'mongodb';
import userData from '../data/users.js';

const router = Router(); // Initialize router



// /users/signup functionality
router
  .route('signup')
  .get(async (req, res) => {
    // Render signup page
    res.render('signupuser')
  })
  .post(async (req, res) => {
    // Render signin page
    const { firstName, lastName, username, email, password, dob } = req.body;

    try {
      const newUser = await userData.createUser(firstName, lastName, username, email, password, dob);
      res.status(201).json({
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        email: newUser.email,
        dob: newUser.dob,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
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
