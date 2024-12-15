import {ObjectId} from 'mongodb';
import {comments} from '../config/mongoCollections.js';
import {users} from '../config/mongoCollections.js'
import {gyms} from '../config/mongoCollections.js'
import validation from '../validation.js'

// Create comment
export const createComment = async (userId, body) => {
    userId = validation.checkId(id);
    body = validation.checkCommentBody(body)

    const usersCollection = await users();
    const gymCollection = await gyms();
    let role = "none"
    let user = usersCollection.findOne({_id: new ObjectId(id)})
    let gym;

    //Searches for user
    if (!user) {
        //Searches for gym
        gym = gymCollection.findOne({_id: new ObjectId(id)})
        if (!gym) throw `User not found`
        role = "gym"
    }
    else
        role = "user"

    //Comment Object
    let newComment = {
        userId, 
        body
    }
    const commentsCollection = await comments();

    //Inserts into comment collection
    const insertInfo = await commentsCollection.insertOne(newComment);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add team';

    //Updates User/Gym
    let updateInfo;
    if (role === 'user') {
        user.comments.push(insertInfo.insertedId.toString);
        updateInfo = await usersCollection.findOneAndUpdate(
            {_id: new ObjectId(userId)},
            {$set: user},
            {returnDocument: 'after'}
        );
    }
    else if (role === 'gym') {
        gym.comments.push(insertInfo.insertedId.toString)
        updateInfo = await gymCollection.findOneAndUpdate(
            {_id: new ObjectId(userId)},
            {$set: gym},
            {returnDocument: 'after'}
        );
    }
    if (!updateInfo) throw 'Update failed';

    return updateInfo;

}

// Get comment by id
export const updateComment = async (id, body) => {
    id = validation.checkId(id);
    body = validation.checkCommentBody(body);

    const commentsCollection = await comments();
    const updateInfo = await commentsCollection.findOneAndUpdate(
        {_id: new ObjectId(id)},
        {$set: {body}},
        {returnDocument: 'after'}
    )

    if (!updateInfo) throw `Update Failed`
    return updateInfo;
}

// Delete comment
export const deleteComment = async (id) => {
    id = validation.checkId(id)
    const commentsCollection = await comments();
    const usersCollection = await users();
    const gymsCollection = await gyms();

    let comment  = await commentsCollection.findOne({_id: new ObjectId(id)});

    if (!comment)
        throw `Could not delete comment with id of ${id}`
    
    let user = await usersCollection.findOne({_id: new ObjectId(comment.userId)})
    if (!user) {
        let gym = await gymsCollection.findOne({_id: new ObjectId(comment.userId)});
        if (!gym)
            throw `Could not delete comment with userId of ${comment.userId}`
        
        gym.comments.filter((commentId) => commentId !== id);
        const updateInfo = await usersCollection.findOneAndUpdate(
            {_id: new ObjectId(comment.userId)},
            {$set: gym},
            {returnDocument: 'after'}
        );
        if (!updateInfo) throw 'Update failed';
    }
    else {
        user.comments.filter((commentId) => commentId !== id)
        const updateInfo = await gymsCollection.findOneAndUpdate(
            {_id: new ObjectId(comment.userId)},
            {$set: user},
            {returnDocument: 'after'}
        );
        if (!updateInfo) throw 'Update failed';
    }
    
        

    const deletedComment = await commentsCollection.findOneAndDelete({
        _id: new ObjectId(id)
    });
    if (!deletedComment) throw `Could not delete comment with id of ${id}`;

    return {_id: id, deleted: true};
}