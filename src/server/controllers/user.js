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

export async function createUser(user, roleName) {
    try {
        let role = await getRolesByName(roleName);
        if(role) {
            Object.assign(user, {roles: [role._id.toString()]});
            return await new User(user).save();
        }
        throw new Error("ROLE_NOT_FOUND");
    } catch(e) {
        throw e;
    }
}

export function updateUser(criteria, modifier, option) {
    try {
        return User.update(criteria, modifier, option).exec();
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