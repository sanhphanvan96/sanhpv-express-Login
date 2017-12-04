import express from "express";
import {findOneUser} from "../controllers/user";
import {User} from "../models/modelConfig";

const verify = express.Router();

verify.route('/email')
    .get(async (req, res, next) => {
        try {
            if(req.query.verifyToken) {
                let user = await findOneUser({emailVerificationToken: req.query.verifyToken});
                if(user) {
                    if(Date.now() > user.emailVerificationExpired) {
                        req.flash("error", "Token is expired");
                        return res.redirect("/");
                    } else {
                        await User.update({_id: user._id}, {$set: {"emails.isVerified": true}}).exec();
                    }
                } else {
                    req.flash("error", "User not found");
                    return res.redirect("/")
                }
            }
            req.flash("info", "You Must Verify Your Email");
            res.redirect("/")
        } catch(e) {
            next(e);
        }
    });

export default verify;