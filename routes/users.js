// import necessary libraries and user data functions
// Import necessary libraries and user data functions
// Import necessary libraries and user data functions
import { Router } from 'express';
import { ObjectId } from 'mongodb';
import userData from '../data/users.js';

const router = Router(); // Initialize router

// Create a new user
router.post('/', async (req, res) => {
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

// Render the sign-in page
router.get('/signin', (req, res) => {
  res.render('signin', { title: 'Sign In' });
});

// Handle sign-in form submission
router.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userData.authenticate(username, password);

    if (!user) throw new Error('Invalid username or password');

    req.session.user = {
      id: user._id,
      username: user.username,
    };

    res.redirect('/'); // Redirect to the home page on successful sign-in
  } catch (error) {
    res.status(400).render('signin', {
      title: 'Sign In',
      errorMessage: error.message,
    });
  }
});

export default router;
