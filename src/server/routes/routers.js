import express from "express";
import account from "./account";
import verify from "./verification";
import {getCurrentUser} from "../controllers/user";

const router = express.Router();

const checkAuth = (callback) => {
    return async (req, res, next) => {
        try {
            let authToken = req.query.access_token || req.body.access_token || req.headers["access-token"] || req.cookies["authToken"];
            if(authToken) {
                req.user = await getCurrentUser(authToken.userId);
                if(req.user) {
                    if(!req.user.emails.isVerified) {
                        req.flash("info", "You must verify your email");
                    } else if(!req.user.phoneNumber.isVerified) {
                        req.flash("info", "You must verify your phone number");
                    }
                }
            }
            next();
        } catch(e) {
            next(e);
        }

    }
};
router.use("/account", checkAuth());

router.use('/account', account);

router.use('/verify', verify);

router.all("/", checkAuth());

router.get('/', (req, res, next) => {
    res.render("index.html", {title: "Home", user: req.user});
});

export default router;
