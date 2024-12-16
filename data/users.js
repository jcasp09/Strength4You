import { ObjectId } from 'mongodb'; // object id validation
import bcrypt from 'bcryptjs'; // for hashing passwords
import { users } from '../config/mongoCollections.js'; // user collection from database
import validation from '../validation.js'
saltRound = 10


// Throws error if userId is already in the database
const duplicateUserCheck = async (userId) => {
  const userCollection = await users()
  const user = await userCollection.findOne({userId: userId})
  if (user) throw `Error: there is already a user with that user ID.`
}

// create new user
export const createUser = async (firstName, lastName, userId, password, email, dob, city, state) => {
  // Server-side validation
  firstName = validation.checkName(firstName)
  lastName = validation.checkName(lastName)
  userId = validation.checkUser(userId)
  await duplicateUserCheck(userId) // Check for duplicate users with userId
  password = validation.checkPassword(password)
  email = validation.checkEmail(email)
  dob = validation.checkDOB(dob)
  city = validation.checkString(city)
  state = validation.checkString(state)


  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = {
    firstName,
    lastName,
    userId,
    password: hashedPassword,
    email,
    dob,
    city, 
    state
}

  // Insert user object into database
  const userCollection = await users();
  const insertInfo = await userCollection.insertOne(newUser);
  if (!insertInfo) throw `Error: Could not add user.`
  // User successfully added to db
  return true
}

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
