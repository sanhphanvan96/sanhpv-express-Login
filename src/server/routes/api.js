import express from 'express';
import debug from "debug";
import * as _ from "lodash";
import {findOneUser} from "../controllers/user";
import {getRolesByName} from "../controllers/roles";
import {User} from "../models/modelConfig";
import passwordHash from "password-hash";

const api = express.Router();

api.use(async (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    try {
        if (req.user) {
            let currentUser = await findOneUser({_id: req.user._id});
            if (currentUser) {
                let adminRole = await getRolesByName("admin");
                if (_.includes(currentUser.roles, adminRole._id.toString())) {
                    return next();
                }
            }
        }
        res.status(401).end(JSON.stringify({error: {message: "Unauthorized"}}))
    } catch (e) {
        debug("DemoApp")("Error: " + e);
        res.status(500).end(JSON.stringify({error: {message: "Internal Error"}}))
    }
});

RegExp.escape = function (s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};


api.route("/users")
    .get(async (req, res, next) => {
        try {
            let filter = {},
                skip = req.query.skip,
                limit = req.query.limit;

            if(req.query.searchText) {
                Object.assign(filter, {
                    $or: [
                        {"emails.address": {$regex: RegExp.escape(req.query.searchText), $options: 'i'}},
                        {"profile.name": {$regex: RegExp.escape(req.query.searchText), $options: 'i'}}
                    ]
                })
            }

            let users = await User.find(filter, {password: false}).limit(+limit).skip(+skip).exec();
            res.status(200).end(JSON.stringify(users));
        } catch (e) {
            console.log(e);
            res.status(500).end(JSON.stringify({error: {message: "Internal Error"}}))
        }
    })
    .post(async (req, res, next) => {
        try {
            let { email, password, name } = req.body;
            if(email && password) {
                // Check if email exists
                let userCount = await User.find({"emails.address": email}).count().exec();
                if(userCount) {
                    req.flash("error", "Email exists");
                    res.redirect(req.url);
                } else {
                    await new User({
                        emails: {
                            address: email,
                            isVerified: true
                        },
                        password: passwordHash.generate(password),
                        profile: {
                            name
                        }
                    }).save();
                    req.flash("success", "User created");
                    res.redirect("/admin/users");
                }
            } else {
                req.flash("error", "Email and password is required");
                res.redirect("/admin/users/create");
            }
        } catch(e) {
            console.log(e);
            req.flash("error", "Error when create user");
            res.redirect(req.url);
        }
    });

api.get("/users/count", async (req, res, next) => {
    try {
        let filter = {};

        if(req.query.searchText) {
            Object.assign(filter, {
                $or: [
                    {"emails.address": {$regex: RegExp.escape(req.query.searchText), $options: 'i'}},
                    {"profile.name": {$regex: RegExp.escape(req.query.searchText), $options: 'i'}}
                ]
            })
        }

        let userCount = await User.find(filter).count();
        res.status(200).end(JSON.stringify(userCount));
    } catch (e) {
        console.log(e);
        res.status(500).end(JSON.stringify({error: {message: "Internal Error"}}))
    }
});

api.post('/users/update/:id', async (req, res, next) => {
    try {
        if(req.params.id) {
            let { email, password, name } = req.body;
            if(email) {

                let userCount = await User.find({"emails.address": email}).count().exec();
                if(userCount) {
                    req.flash("error", "Email exists");
                    return res.redirect("/admin/users");
                }

                let modifier = {
                    "emails.address": email,
                    "profile.name": name
                };
                if(password.length) {
                    Object.assign(modifier, {
                        password: passwordHash.generate(password),
                    })
                }
                // Update User
                await User.update({_id: req.params.id}, {$set: modifier}).exec();
                req.flash("success", "User updated");
                return res.redirect("/admin/users");
            } else {
                req.flash("error", "Email is required");
            }
        } else {
            req.flash("error", "UserID is required");
        }
        res.redirect(req.url);
    } catch (e) {
        console.log(e);
        req.flash("error", "Cannot update user");
        res.redirect(req.url);
    }
});

api.post("/users/delete/:id", async (req, res, next) => {
    try {
        if(req.params.id) {
            await User.remove({_id: req.params.id}).exec();
            req.flash("success", "User deleted");
            res.redirect("/admin/users");
        } else {
            req.flash("error", "UserID is required");
            res.redirect(req.url);
        }
    } catch (e) {
        console.log(e);
        req.flash("error", "Cannot delete user");
        res.redirect(req.url);
    }
});


export default api;