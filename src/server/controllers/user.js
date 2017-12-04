import {User} from "../models/modelConfig";

export async function findOneUser(filter) {
    try {
        let user = await User.findOne(filter).exec();
        return user;
    } catch(e) {
        throw e;
    }
}

export async function sendEmail() {
    
}

export async function createUser(user) {
    try {
        return await new User(user).save();
    } catch(e) {
        throw e;
    }
}

export async function getCurrentUser(userId) {
    try {
        return await User.findOne({_id: userId}, {emails: 1, profile: 1}).exec();
    } catch (e) {
        throw e;
    }
}