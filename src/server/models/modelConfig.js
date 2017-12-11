import createModel from "./createModel";
import {Schema} from "mongoose";
import CryptoJS from "crypto-js";
import {ttl} from "../utils/utils";

const AccessToken = createModel("access_token", new Schema({
    access_token: {type: String, default: CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(16))},
    refresh_token: {type: String, default: CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(16))},
    ttl: {type: Number, default: ttl()},
    createdAt: {type: String, default: new Date()},
    userId: {type: String, required: true}
}), "access_token");

const User = createModel("users", new Schema({
    emails: {
        address: {
            type: String,
            validate: {
                validator: function (v) {
                    return (new RegExp((/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm))).test(v);
                },
                message: '{VALUE} is not a valid email !'
            },
            required: true
        },
        isVerified: {type: Boolean, default: false}
    },
    phoneNumber: {
        number: {
            type: String,
            validate: {
                validator: (v) => {
                    return (new RegExp(/^\+\d{1,3}?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$/)).test(v);
                },
                message: "{VALUE} is not a valid phone number"
            }
        },
        isVerified: {type: Boolean, default: false}
    },
    password: {type: String, required: true},
    profile: {
        image: {type: String},
        name: {type: String}
    },
    roles: {
        type: Array
    },
    createdAt: {type: String, default: new Date().toISOString()},
    phoneNumberVerifiedCode: {type: String},
    phoneNumberCodeExpires: {type: Date},
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date},
    emailVerificationToken: {type: String},
    emailVerificationExpired: {type: Date},
    phoneNumberCodeSentCount: {type:Number},
    phoneNumberSentCountReset: {type: Date}
}), "users");


const Roles = createModel("roles", new Schema({
    roleName: {type: String, required: true},
    description: {type: String}
}), "roles");

export {AccessToken, User, Roles};