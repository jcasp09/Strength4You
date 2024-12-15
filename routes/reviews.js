import { Router } from 'express';
import reviewsData from '../data/reviews.js';

const router = Router(); // initialize

// create a new review
router.post('/', async (req, res) => {
  const { aboutId, userId, reviewBody, rating } = req.body; // extract data from request body

  try {
    if (!aboutId || !userId || !reviewBody || rating === undefined) throw 'Missing required fields'; // check required fields

    const newReview = await reviewsData.createReview(aboutId, userId, reviewBody, rating); // create review

    res.status(201).json(newReview); // respond with created review
  } catch (error) {
    res.status(400).json({ error }); // handle errors
  }
});

// get a review by id
router.get('/:id', async (req, res) => {
  const { id } = req.params; // extract id from request parameters

  try {
    if (!id) throw 'Missing review ID'; // check if id exists

    const review = await reviewsData.getReviewById(id); // get review by id

    res.status(200).json(review); // respond with review data
  } catch (error) {
    res.status(404).json({ error }); // handle errors
  }
});

// delete a review by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // extract id from request parameters

  try {
    if (!id) throw 'Missing review ID'; // check if id exists

    const result = await reviewsData.deleteReview(id); // delete review by id

    res.status(200).json(result); // respond with success message
  } catch (error) {
    res.status(400).json({ error }); // handle errors
  }
});

export default router;
