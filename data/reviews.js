import { ObjectId } from 'mongodb'; // for object id validation
import { reviews } from '../config/mongoCollections.js'; // reviews collection
import * as gymsData from './gyms.js'; // to validate gym ids
import usersData from './users.js'; // to validate user ids

const exportedMethods = {
  // create a new review
  async createReview(aboutId, userId, reviewBody, rating) {
    if (!aboutId) throw 'aboutId is required';
    if (typeof aboutId !== 'string') throw 'aboutId must be a string';
    aboutId = aboutId.trim();
    if (!ObjectId.isValid(aboutId)) throw 'aboutId must be a valid ObjectId';

    if (!userId) throw 'userId is required';
    if (typeof userId !== 'string') throw 'userId must be a string';
    userId = userId.trim();
    if (!ObjectId.isValid(userId)) throw 'userId must be a valid ObjectId';

    if (!reviewBody) throw 'reviewBody is required';
    if (typeof reviewBody !== 'string') throw 'reviewBody must be a string';
    reviewBody = reviewBody.trim();
    if (reviewBody.length === 0) throw 'reviewBody cannot be empty';

    if (rating === undefined || rating === null) throw 'rating is required';
    if (typeof rating !== 'number') throw 'rating must be a number';
    if (rating < 1 || rating > 5) throw 'rating must be between 1 and 5';

    const gym = await gymsData.getGymById(aboutId);
    if (!gym) throw 'aboutId does not reference a valid gym';

    const user = await usersData.getUserById(userId);
    if (!user) throw 'userId does not reference a valid user';

    const revCollection = await reviews();

    const newReview = {
      aboutId,
      userId,
      reviewBody,
      rating,
    };

    const insertInfo = await revCollection.insertOne(newReview);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'could not add review';

    newReview._id = insertInfo.insertedId.toString();
    return newReview;
  },

  // get a review by id
  async getReviewById(reviewId) {
    if (!reviewId) throw 'reviewId is required';
    if (typeof reviewId !== 'string') throw 'reviewId must be a string';
    reviewId = reviewId.trim();
    if (!ObjectId.isValid(reviewId)) throw 'reviewId must be a valid ObjectId';

    const revCollection = await reviews();
    const rlist = await revCollection.find({}).toArray(); // get all reviews

    let freview = null; // search for matching review by id
    for (let review of rlist) {
      if (review._id.toString() === reviewId) {
        freview = review;
        break;
      }
    }

    if (!freview) throw 'review not found';
    freview._id = freview._id.toString();
    return freview;
  },

  // delete a review by id
  async deleteReview(reviewId) {
    if (!reviewId) throw 'reviewId is required';
    if (typeof reviewId !== 'string') throw 'reviewId must be a string';
    reviewId = reviewId.trim();
    if (!ObjectId.isValid(reviewId)) throw 'reviewId must be a valid ObjectId';

    const revCollection = await reviews();
    const rlist = await revCollection.find({}).toArray(); // get all reviews

    let rf = false; //review found
    for (let i = 0; i < rlist.length; i++) { // locate and remove review
      if (rlist[i]._id.toString() === reviewId) {
        rlist.splice(i, 1);
        rf = true;
        break;
      }
    }

    if (!rf) throw 'review not found';
    return { deleted: true };
  },
};

export default exportedMethods;
