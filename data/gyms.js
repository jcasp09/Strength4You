import {ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import {gyms} from '../config/mongoCollections.js';
import validation from '../validation.js'
const saltRounds = 10;

// Throws error if userId is already in the database
const duplicateGymCheck = async (userId) => {
    const gymCollection = await gyms()
    const gym = await gymCollection.findOne({userId: userId})
    if (gym) throw `Error: there is already a user with that user ID.`
}

// Create gym
export const createGym = async (name, userId, password, email, address, hours) => {
    // Server-side validation
    name = validation.checkString(name);
    userId = validation.checkUser(userId);
    await duplicateGymCheck(userId); // Check for duplicate gyms with userId
    password = validation.checkPassword(password);
    email = validation.checkEmail(email);
    address = validation.checkString(address);
    hours = validation.checkHours(hours);

    let equipment = [],
        classes = [],
        extra = [],
        link = "",
        reviews = [],
        rating = 0,
        comments = [],
        trainers = [];

    password = await bcrypt.hash(password, saltRounds);

    let newGym = {
        name,
        userId,
        password,
        email,
        address,
        hours,
        equipment,
        classes,
        trainers,
        extra,
        link,
        reviews,
        rating,
        comments,
        role: 'gym'
    };

    const gymsCollection = await gyms();
    const insertInfo = await gymsCollection.insertOne(newGym);

    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add gym';

    // Attach the insertedId to the gym object and return it
    newGym._id = insertInfo.insertedId.toString();
    return newGym;
};



export const signInGym = async (userId, password) => {
    // Validate userID and password
    userId = validation.checkUser(userId, 'user ID')
    password = validation.checkPassword(password, 'password')
  
    // Query the db for user
    const gymCollection = await gyms()
    const gym = await gymCollection.findOne({userId: userId})
    if (!gym) throw `Error: either the userId or password is invalid.`
  
    // Compare passwords
    let compare = await bcrypt.compare(password, gym.password)
    if (!compare) throw `Error: either the userId or password is invalid.`
  
    // Return user fields... without passsword!
    delete gym.password
    return gym
  };
  

// Get gym by id
export const getGymById = async (id) => {
    id = validation.checkId(id); // Validate the gym ID
    const gymsCollection = await gyms(); // Get the collection

    const gym = await gymsCollection.findOne({ _id: new ObjectId(id) }); // Query for gym
    if (!gym) throw 'Gym not found'; // Throw an error if gym doesn't exist

    return gym; // Return the gym
};


// Update gym content
export const updateGym = async (id, gymObject) => {
    id = validation.checkId(id);
    if (!await getGymById(id))
        throw `Gym with ${id} not found`
    let fields = ["name", "userId", "password", "email", "address", "hours", "equipment", "classes", "extra", "link"];
    Object.keys(gymObject).forEach((field) => {
        if (!fields.includes(field))
            throw `gymObject contains an invalid field for updating`
    })
    if (gymObject.name)
        gymObject.name = validation.checkString(gymObject.name)
    if (gymObject.userId)
        gymObject.userId = validation.checkUser(gymObject.userId);
    if (gymObject.password)
        gymObject.password = validation.checkPassword(gymObject.password)
    if (gymObject.email)
        gymObject.email = validation.checkEmail(gymObject.email)
    if (gymObject.address)
        gymObject.address = validation.checkPassword(gymObject.address)
    if (gymObject.hours)
        gymObject.hours = validation.checkHours(gymObject.hours)
    if (gymObject.equipment)
        gymObject.equipment = validation.checkEquipment(gymObject.equipment)
    if (gymObject.classes)
        gymObject.classes = validation.checkClasses(gymObject.classes)
    if (gymObject.extra)
        gymObject.extra = gymObject.extra.map((ex) => validation.checkString(ex));
    if (gymObject.link)
        gymObject.link = validation.checkLink(gymObject.link);

    const gymsCollection = await gyms();
    const updateInfo = await gymsCollection.findOneAndUpdate(
      {_id: new ObjectId(id)},
      {$set: gymObject},
      {returnDocument: 'after'}
    );
    if (!updateInfo) throw 'Update failed';

    return await updateInfo;

}

// Delete gym
export const deleteGym = async (id) => {
    id = validation.checkId(id);
    const gymsCollection = await gyms();
    const deletionInfo = await gymsCollection.findOneAndDelete({
        _id: new ObjectId(id)
    });
    if (!deletionInfo) throw `Could not delete gym with id of ${id}`;

    return {_id: id, deleted: true};
}

export const addReview = async (gymId, userId, rating, comment) => {
    const gymsCollection = await gyms();
    const gym = await getGymById(gymId);
    if (!gym) throw 'Gym not found';
  
    const review = { userId, rating, comment, createdAt: new Date() };
    await gymsCollection.updateOne(
      { _id: new ObjectId(gymId) },
      { $push: { reviews: review } }
    );
  
    return review;
};
