import express from 'express';
import {findOneUser} from "../controllers/user";
import {getRolesByName} from "../controllers/roles";
import * as _ from "lodash";

const admin = express.Router();

admin.use(async (req, res, next) => {
   try {
       if(req.user) {
            let currentUser = await findOneUser({_id: req.user._id});
            if(currentUser) {
                let adminRole = await getRolesByName("admin");
                if(_.includes(currentUser.roles, adminRole._id.toString())) {
                    return next();
                } else {
                    req.flash("error", "You don't have permission here");
                }
            } else {
                req.flash("error", "User not found");
            }
       } else {
           req.flash("error", "You must login");
       }
       res.redirect("/account/login");
   } catch(e) {
       req.flash("error", "Internal Server Error");
       res.redirect("/")
   }
});

admin.get("*", (req, res, next) => {
   res.render("admin.html", {csrfToken: req.csrfToken(), user: req.user})
});

export default admin;