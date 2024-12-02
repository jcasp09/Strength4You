// import necessary libraries and user data functions
import { Router } from 'express';
import userData from '../data/users.js';

const router = Router(); // initialize router

// create a new user
router.post('/', async (req, res) => {
  const { firstName, lastName, username, email, password, dob } = req.body;

  try {
    // ensure all required fields are provided
    if (!firstName || !lastName || !username || !email || !password || !dob) throw 'missing required fields';

    // call the data function to create a user
    const newUser = await userData.createUser(firstName, lastName, username, email, password, dob);

    // respond with the created user's data, excluding sensitive information
    res.status(201).json({
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      username: newUser.username,
      email: newUser.email,
      dob: newUser.dob,
    });
  } catch (error) {
    // handle errors such as validation failures
    res.status(400).json({ error });
  }
});

// get a user by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // call the data function to retrieve user information by id
    const user = await userData.getUserById(id);

    // respond with the retrieved user data
    res.status(200).json(user);
  } catch (error) {
    // handle errors such as user not found or invalid id
    res.status(404).json({ error });
  }
});

// update a user by id
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    // call the data function to update user data
    const updatedUser = await userData.updateUser(id, updatedData);

    // respond with the updated user data
    res.status(200).json(updatedUser);
  } catch (error) {
    // handle errors such as invalid input or user not found
    res.status(400).json({ error });
  }
});

// delete a user by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // call the data function to delete the user by id
    const result = await userData.deleteUser(id);

    // respond with a success message
    res.status(200).json(result);
  } catch (error) {
    // handle errors such as user not found
    res.status(400).json({ error });
  }
});

export default router;
