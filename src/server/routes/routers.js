import express from "express";
import account from "./account";
import verify from "./verification";
import {verifyAuthToken} from "../controllers/accessToken";
import debug from "debug";
import profile from "./profile";
import admin from "./admin";
import api from "./api"

const router = express.Router();

const checkAuth = () => {
    return async (req, res, next) => {
        try {
            let authToken = req.query.access_token || req.body.access_token || req.headers["access-token"] || req.cookies["authToken"];
            if(authToken) {
                req.user = await verifyAuthToken(authToken);
                debug("DemoApp")("User: ",req.user);
            }
            next();
        } catch(e) {
            next(e);
        }

    }
};

router.use("/account", checkAuth());

router.use('/account', account);

router.use("/verify", checkAuth());

router.use('/verify', verify);

router.use("/profile", checkAuth());

router.use("/profile", profile);

router.use("/admin", checkAuth());

router.use("/admin", admin);

router.use("/api", checkAuth());

router.use('/api', api);

router.all("/", checkAuth());

router.all("/", (req, res, next) => {
    if(req.user) {
        if(!req.user.emails.isVerified) {
            req.flash("info", "You Must Verify Email");
        } else if(!req.user.phoneNumber.isVerified) {
            req.flash("info", "You Must Verify Phone Number");
        }
    }
    next();
});

router.get('/', (req, res, next) => {
    res.render("home.html", {user: req.user, hasHeader: true});
});

export default router;
