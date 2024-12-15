import { dbConnection } from './mongoConnection.js';

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

// Databases
export const users = getCollectionFn('users');
export const gyms = getCollectionFn('gyms');
export const reviews = getCollectionFn('reviews');
export const comments = getCollectionFn('comments');