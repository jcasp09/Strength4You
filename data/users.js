import { ObjectId } from 'mongodb'; // object id validation
import bcrypt from 'bcryptjs'; // for hashing passwords
import { users } from '../config/mongoCollections.js'; // user collection from database

const exportedMethods = {
  // Throws error if userId is already in the database
  async duplicateUserCheck(userId) {
    const userCollection = await users()
    const user = await userCollection.findOne({userId: userId})
    if (user) throw `Error: there is already a user with that user ID.`
    return
  },


  // create new user
  async createUser(firstName, lastName, userId, password, email, dob, city, state) {
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      firstName,
      lastName,
      userId,
      password: hashedPassword,
      email,
      dob,
      city, 
      state
    };

    // Insert user object into database
    const userCollection = await users();
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo) throw `Error: Could not add user.`
  },

  // get a user by id
  async getUserById(userId) {
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) return null; // Return null if user not found

    user._id = user._id.toString(); // Convert _id to string before returning
    return user;
  },

  // update user information
  async updateUser(userId, updatedData) {
    const userCollection = await users();
    const updatedUser = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updatedData },
      { returnDocument: 'after' }
    );
    return updatedUser.value;
  },

  // delete user by id
  async deleteUser(userId) {
    const userCollection = await users();
    const deletionInfo = await userCollection.deleteOne({ _id: new ObjectId(userId) });
    return { deleted: deletionInfo.deletedCount > 0 };
  },
};

export default exportedMethods;
