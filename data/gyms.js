import {ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import {gyms} from '../config/mongoCollections.js';
import validation from '../validation.js'
const saltRounds = 10;

// Create gym
export const createGym = async (name, username, password, email, address, hours, equipment, classes, extra, link) => {
    name = validation.checkString(name)
    username = validation.checkUser(username);
    email = validation.checkEmail(email);
    password = validation.checkPassword(password)
    address = validation.checkString(address)
    hours = validation.checkHours(hours)

    let 
    equipment = [],
    classes = [],
    extra = [],
    link = "",
    reviews = [],
    rating = 0,
    comments = [],
    trainers = [];

    password = await bcrypt.hash(password, saltRounds)

    let newGym = {
        name,
        username,
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
    }



    const gymsCollection = await gyms();

    const insertInfo = await gymsCollection.insertOne(newGym);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add gym';

    return insertInfo;
}

// Get gym by id
export const getGymById = async (id) => {
    id = validation.checkId(id);
    const gymsCollection = await gyms();
    gym = await gymsCollection.findOne()
    const gym = await gymsCollection.findOne({_id: new ObjectId(id)});
    if (!gym) throw 'Gym not found';
    return gym;
}

// Update gym content
export const updateGym = async (id, gymObject) => {
    id = validation.checkId(id);
    if (!await this.getGymById(id))
        throw `Gym with ${id} not found`
    let fields = ["name", "username", "password", "email", "address", "hours", "equipment", "classes", "extra", "link"];
    Object.keys(gymObject).forEach((field) => {
        if (!fields.includes(field))
            throw `gymObject contains an invalid field for updating`
    })
    if (gymObject.name)
        gymObject.name = validation.checkString(gymObject.name)
    if (gymObject.username)
        gymObject.username = validation.checkUser(gymObject.username);
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
export const deleteGym = async (gymID) => {
    id = validation.checkId(id);
    const gymsCollection = await gym();
    const deletionInfo = await gymsCollection.findOneAndDelete({
        _id: new ObjectId(id)
    });
    if (!deletionInfo) throw `Could not delete gym with id of ${id}`;

    return {_id: id, deleted: true};
}