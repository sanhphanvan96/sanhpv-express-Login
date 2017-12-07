import {Roles} from "../models/modelConfig";
import debug from "debug";

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
        debug("DemoApp")("Roles Name: " + name);
        return await Roles.findOne({roleName: name}).exec();
    } catch(e) {
        throw e;
    }
}