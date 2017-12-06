import {Roles} from "../models/modelConfig";

export async function createRole (roleName) {
    try {
        return await new Roles({
            roleName: roleName.toLowerCase()
        }).save();
    } catch(e) {
        throw e;
    }
}

export async function countRoles () {
    try {
        return await Roles.find({}).count().exec();
    } catch(e) {
        throw e;
    }
}

export async function getRolesByName(name) {
    try {
        return await Roles.find({roleName: name}).exec();
    } catch(e) {
        throw e;
    }
}