import { ObjectId } from 'mongodb'; // object id validation
import bcrypt from 'bcrypt'; // for hashing passwords
import { users } from '../config/mongoCollections.js'; // user collection from database

const exportedMethods = {
  // create new user
  async createUser(firstName, lastName, username, email, password, dob) {
    const userCollection = await users();
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password before saving

    const newUser = {
      firstName,
      lastName,
      username,
      email,
      hashedPassword,
      dob,
      profilePicture: "no_image.jpeg",
    };

    const insertInfo = await userCollection.insertOne(newUser);
    return { ...newUser, _id: insertInfo.insertedId.toString() };
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
