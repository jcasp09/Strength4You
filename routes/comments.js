import { Router } from 'express';
import * as commentsData from '../data/comments.js'; // Import the comments data methods
import validation from '../validation.js'; // Import validation functions

const router = Router();

// Create a new comment
router.post('/', async (req, res) => {
  const { userId, aboutId, commentBody } = req.body; // extract comment data from request body

  try {
    // validate input data
    const vUserId = validation.checkId(userId, 'User ID');
    const vAboutId = validation.checkId(aboutId, 'About ID');
    const vCommentBody = validation.checkString(commentBody, 'Comment Body');

    // call the data function to create a comment
    const newC = await commentsData.createComment(vUserId, vAboutId, vCommentBody);

    // respond with the newly created comment
    res.status(201).json(newC);
  } catch (error) {
    res.status(400).json({ error: error.message || error }); // return an error response
  }
});

// Get a comment by id
router.get('/:id', async (req, res) => {
  const { id } = req.params; // extract the comment id from request parameters

  try {
    const v_id = validation.checkId(id, 'Comment ID'); // validate the comment id
    const comment = await commentsData.getCommentById(v_id); // fetch the comment
    res.status(200).json(comment); // respond with the comment
  } catch (error) {
    res.status(404).json({ error: error.message || error }); // return an error if the comment isn't found
  }
});

// Update a comment by id
router.patch('/:id', async (req, res) => {
  const { id } = req.params; // extract the comment id
  const { commentBody } = req.body; // extract updated comment body

  try {
    // validate input data
    const v_id = validation.checkId(id, 'Comment ID');
    const vCommentBody = validation.checkString(commentBody, 'Comment Body');

    // call the data function to update the comment
    const updatedC = await commentsData.updateComment(v_id, { commentBody: vCommentBody });

    res.status(200).json(updatedC); // respond with the updated comment
  } catch (error) {
    res.status(400).json({ error: error.message || error }); // return an error response
  }
});

// Delete a comment by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // extract the comment id

  try {
    const v_id = validation.checkId(id, 'Comment ID'); // validate the comment id
    const deleteResult = await commentsData.deleteComment(v_id); // delete the comment
    res.status(200).json(deleteResult); // respond with success
  } catch (error) {
    res.status(400).json({ error: error.message || error }); // return an error response
  }
});

export default router;
