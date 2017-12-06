import {User} from "../models/modelConfig";
import {getRolesByName} from "./roles";

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

export async function createUser(user, role) {
    try {
        let role = await getRolesByName(role);
        Object.assign(role, {roles: role._id});
        return await new User(user).save();
    } catch(e) {
        throw e;
    }
}

export async function getCurrentUser(userId) {
    try {
        return await User.findOne({_id: userId}, {
            password: false,
        }).exec();
    } catch (e) {
        throw e;
    }
}