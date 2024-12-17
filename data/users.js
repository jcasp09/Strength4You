import { ObjectId } from 'mongodb'; // object id validation
import bcrypt from 'bcryptjs'; // for hashing passwords
import { users } from '../config/mongoCollections.js'; // user collection from database
import validation from '../validation.js'
const saltRounds = 10


// Throws error if userId is already in the database
const duplicateUserCheck = async (userId) => {
  const userCollection = await users()
  const user = await userCollection.findOne({userId})
  if (user) throw `Error: there is already a user with that user ID.`
}

// create new user
export const createUser = async (firstName, lastName, userId, password, email, dob, city, state) => {
  firstName = validation.checkName(firstName, "First Name")
  lastName = validation.checkName(lastName, "Last Name")
  userId = validation.checkUser(userId)
  password = validation.checkPassword(password)
  email = validation.checkEmail(email)
  validation.checkDOB(dob)
  city = validation.checkString(city, "City")
  state = validation.checkState(state);

  duplicateUserCheck(userId)

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = {
      firstName,
      lastName,
      userId,
      password: hashedPassword,
      email,
      dob,
      city,
      state,
      role: "user"
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
export const getUserById = async (id) => {
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: new ObjectId(id) });
  if (!user) return null; // Return null if user not found

  user._id = user._id.toString(); // Convert _id to string before returning
  return user;
}

// update user information
export const updateUser = async (id, updatedData) => {
  if (updatedData.firstName)
    updatedData.firstName = validation.checkName(updatedData.firstName, "First Name");
  if (updatedData.lastName)
    updatedData.lastName = validation.checkName(updatedData.lastName, "Last Name");
  if (updatedData.userId)
    updatedData.userId = validation.checkUser(updatedData.userId);
  if (updatedData.password)
    updatedData.password = validation.checkPassword(updatedData.password);
  if (updatedData.email)
    updatedData.email = validation.checkEmail(updatedData.email);
  if (updatedData.dob)
    updatedData.dob = validation.checkDOB(updatedData.dob);
  if (updatedData.city)
    updatedData.city = validation.checkString(updatedData.city, "City");
  if (updatedData.state)
    updatedData.state = validation.checkState(updatedData.state);

  duplicateUserCheck(updatedData.userId);

  let oldUser = await getUserById(id);

  if (!oldUser)
    throw `User Not Found with ${id}`
  if (updatedData.oldPassword)
    if (!await bcrypt.compare(updatedData.oldPassword, oldUser.password))
      throw `Old Password is incorrect`
  if (updatedData.password)
    updatedData.password = await bcrypt.hash(updatedData.password, saltRounds);

  const userCollection = await users();
  const updatedUser = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updatedData },
    { returnDocument: 'after' }
  );
  return updatedUser;
}

// delete user by id
export const deleteUser = async (userId) => {
  const userCollection = await users();
  const deletionInfo = await userCollection.deleteOne({ _id: new ObjectId(userId) });
  return { deleted: deletionInfo.deletedCount > 0 };
}
