import { ObjectId } from 'mongodb'; // object id validation
import bcrypt from 'bcrypt'; // for hashing passwords
import { users } from '../config/mongoCollections.js'; // user collection from database
import validation from '../validation.js'

const saltRounds = 10; // salt rounds for hashing passwords

const exportedMethods = {
  // create new user
  async createUser(firstName, lastName, username, email, password, dob) {
    //validate
    firstName = validation.checkString(firstName);
    lastName = validation.checkString(lastName);
    username = username.checkString(lastName).toLowerCase();
    email = validation.checkString(email).toLowerCase();
    password = validation.checkPassword(password);
    validation.checkDOB(dob)
    const userCollection = await users(); // get user collection
    const existingUsername = await userCollection.findOne({ username: username.trim().toLowerCase() });// check for duplicate username
    if (existingUsername) throw 'username already exists'; 
    const existingEmail = await userCollection.findOne({ email: email.trim().toLowerCase() });// check for duplicate email
    if (existingEmail) throw 'email already exists'; 
    const hashedPassword = await bcrypt.hash(password, saltRounds); // hash the password for security

    // create user object
    const newUser = {
      firstName,
      lastName,
      username,
      email,
      hashedPassword, 
      dob: new Date(dob), //store as date object
      profilePicture: "no_image.jpeg", // placeholder 
    };

    // insert user into the database
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'could not add user'; 

    return { ...newUser, _id: insertInfo.insertedId.toString() }; // return the new user object with string id using spread op
  },

  // get a user by id
  async getUserById(userId) {
    userId = validation.checkId(userId, "userId")

    const userCollection = await users(); // get user collection
    const user = await userCollection.findOne({ _id: new ObjectId(userId) }); // find user by id
    if (!user) throw 'user not found'; // ensure user exists

    user._id = user._id.toString(); // convert id to string for consistency
    return user; // return user object
  },

  // update user information
  async updateUser(userId, updatedData) {
    if (!userId || typeof userId !== 'string' || !ObjectId.isValid(userId.trim())) throw 'invalid user id'; // validate user id
    if (!updatedData || typeof updatedData !== 'object' || Array.isArray(updatedData)) throw 'invalid update data'; // validate update data

    const updateFields = {}; // object to store fields to update

    // validate and add fields to update object
    if (updatedData.firstName) updateFields.firstName = validation.checkString(firstName);
    if (updatedData.lastName) updateFields.lastName = validation.checkString(lastName);
    if (updatedData.city && typeof updatedData.city === 'string' && updatedData.city.trim()) {
      updateFields.city = updatedData.city.trim(); 
    }
    if (updatedData.state && typeof updatedData.state === 'string' && updatedData.state.trim()) {
      updateFields.state = updatedData.state.trim(); 
    }
    if (updatedData.age && typeof updatedData.age === 'number' && updatedData.age > 0) {
      updateFields.age = updatedData.age; 
    }

    if (Object.keys(updateFields).length === 0) throw 'no valid fields to update'; // ensure fields exist

    const userCollection = await users(); // get user collection
    const updatedUser = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(userId.trim()) }, // find user by id
      { $set: updateFields }, // set fields to update
      { returnDocument: 'after' } // return updated document
    );

    if (!updatedUser.value) throw 'could not update user'; // ensure update success

    updatedUser.value._id = updatedUser.value._id.toString(); // convert id to string
    return updatedUser.value; // return updated user
  },

  // delete user by id
  async deleteUser(userId) {
    if (!userId || typeof userId !== 'string' || !ObjectId.isValid(userId.trim())) throw 'invalid user id'; // validate user id

    const userCollection = await users(); // get user collection
    const deletionInfo = await userCollection.deleteOne({ _id: new ObjectId(userId.trim()) }); // delete user by id
    if (deletionInfo.deletedCount === 0) throw 'could not delete user'; // ensure deletion success

    return { deleted: true }; // return success message
  },
};

export default exportedMethods;