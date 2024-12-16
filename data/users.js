import { ObjectId } from 'mongodb'; // object id validation
import bcrypt from 'bcryptjs'; // for hashing passwords
import { users } from '../config/mongoCollections.js'; // user collection from database
import validation from '../validation.js'
const saltRounds = 10


// Throws error if userId is already in the database
const duplicateUserCheck = async (userId) => {
  const userCollection = await users()
  const user = await userCollection.findOne({userId: userId})
  if (user) throw `Error: there is already a user with that user ID.`
}

// create new user
export const createUser = async (firstName, lastName, userId, password, email, dob, city, state, role) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
      firstName,
      lastName,
      userId,
      password: hashedPassword,
      email,
      dob,
      city,
      state,
      role
  };

  const userCollection = await users();
  const insertInfo = await userCollection.insertOne(newUser);

  if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add user';

  newUser._id = insertInfo.insertedId.toString();
  return newUser;
};



export const signInUser = async (userId, password) => {
  // Validate userID and password
  userId = validation.checkUser(userId, 'user ID')
  password = validation.checkPassword(password, 'password')

  // Query the db for user
  const userCollection = await users()
  const user = await userCollection.findOne({userId: userId})
  if (!user) throw `Error: either the userId or password is invalid.`

  // Compare passwords
  let compare = await bcrypt.compare(password, user.password)
  if (!compare) throw `Error: either the userId or password is invalid.`

  // Return user fields... without passsword!
  delete user.password
  return user
};



// get a user by id
export const getUserById = async (userId) => {
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: new ObjectId(userId) });
  if (!user) return null; // Return null if user not found

  user._id = user._id.toString(); // Convert _id to string before returning
  return user;
}

// update user information
export const updateUser = async (userId, updatedData) => {
  const userCollection = await users();
  const updatedUser = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $set: updatedData },
    { returnDocument: 'after' }
  );
  return updatedUser.value;
}

// delete user by id
export const deleteUser = async (userId) => {
  const userCollection = await users();
  const deletionInfo = await userCollection.deleteOne({ _id: new ObjectId(userId) });
  return { deleted: deletionInfo.deletedCount > 0 };
}
