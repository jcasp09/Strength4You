import {Router} from 'express';
import {ObjectId} from 'mongodb';
import * as gymData from '../data/gyms.js';

const router = Router();

// /gyms/signup functionality
router
    .route('/signup')
    .get(async (req, res) => {
        // Render signup page
        res.render('signupgym')
    })
    .post(async (req, res) => {
        // Render signin page
        res.render('signin')
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
  