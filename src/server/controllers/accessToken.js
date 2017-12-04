import {AccessToken} from "../models/modelConfig";
import {getCurrentUser} from "./user";

export async function createAuthToken(userId) {
    try {
        let token = await new AccessToken({userId}).save();
        return token;
    } catch(e) {
        throw e;
    }
}

export async function verifyAuthToken(access_token) {
    try {
        let accessToken = await AccessToken.findOne({access_token}).exec();
        if(accessToken) {
            return getCurrentUser(accessToken.userId);
        }
        throw new Error("NOT_FOUND_TOKEN");
    } catch (e) {
        throw e;
    }
}