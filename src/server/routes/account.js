import passport from "passport";
import express from "express";
import passwordHash from "password-hash";
import {Strategy as LocalStrategy} from "passport-local"
import {createAuthToken} from "../controllers/accessToken";
import {createUser, findOneUser} from "../controllers/user";
import * as _ from "lodash";
import CryptoJS from "crypto-js";
import nodemailerMG from "../utils/nodemailer";
import debug from "debug";

const account = express.Router();

const authOptions = {
    maxAge: 1000 * 60 * 60 * 24 * 14, // would expire after 14 days
    httpOnly: true, // The cookie only accessible by the web server
};

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        debug("DemoApp")("Username: ", username, " login");

        let user = await findOneUser({'emails.address': username});
        debug("DemoApp")("User found: ", user)
        if (user != undefined) {
            let passwordVerified = passwordHash.verify(password, user.password);
            if (passwordVerified) {
                let token = await createAuthToken(user._id);
                done(null, token);
            } else {
                done(null, false, "Password is wrong");
            }
        } else {
            done(null, false, "Not found email");
        }
    } catch (e) {
        done(e);
    }
}));

account.use((req, res, next) => {
    if (req.user) {
        if (!req.user.emails.isVerified) {
            req.flash("info", "You Must Verify Email");
            return res.redirect('/')
        }

        if (!req.user.phoneNumber.isVerified) {
            return res.redirect("/verify/phoneNumber")
        }
    }
    next();
});

account.route('/login')
    .get((req, res, next) => {
        res.render("login.html", {csrfToken: req.csrfToken()});
    })
    .post( async (req, res, next) => {
        passport.authenticate('local', (err, user, message) => {
            debug("DemoApp")('User Login: ', user);
            if (err || !user) {
                req.flash("error", message);
                res.redirect("/account/login");
            } else {
                res.cookie('authToken', user.access_token, authOptions); // options is optional
                res.redirect("/");
            }
        })(req, res, next);
    });

account.route("/signup")
    .get((req, res, next) => {
        res.render("signup.html", {csrfToken: req.csrfToken()});
    })
    .post(async (req, res, next) => {
        let {username, password, repassword} = req.body;
        if (username && password && repassword) {
            if (password !== repassword) {
                req.flash("info", "Password and RePassword was not matched");
                res.redirect("/account/signup");
            } else {
                let getUserByEmail = await findOneUser({"emails.address": username});
                if (!getUserByEmail) {
                    let user = await createUser({
                        emails: {
                            address: username
                        },
                        password: passwordHash.generate(password),
                        profile: {},
                        emailVerificationToken: CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(16)),
                        emailVerificationExpired: Date.now() + 3600000, // 1 hour
                    }, "user"); // Create user with role
                    user = user.toJSON();
                    let authToken = await createAuthToken(user._id.toString());
                    res.cookie('authToken', authToken.access_token, authOptions); // options is optional
                    req.user = _.pick(user, ['emails', 'password', 'profile']);
                    nodemailerMG.sendMail({
                        from: 'demoapp@no-reply.com', // sender address
                        to: user.emails.address, // list of receivers
                        subject: 'Email Verification', // Subject line
                        html: `Thanks for your registration please confirm your email: <a href="http://localhost:3000/verify/email?verifyToken=${user.emailVerificationToken}">http://localhost:3000/verify/email?verifyToken=${user.emailVerificationToken}</a>` // html body
                    }, (error, info) => {
                        if (error) console.log(error);
                        else console.log(info);
                    });
                    req.flash("info", "An Email has been sent to your email");
                    res.redirect('/');
                } else {
                    req.flash("info", "Email is existed");
                    res.redirect("/account/signup");
                }
            }
        } else {
            req.flash("info", "You must fill all fields");
            res.redirect("/account/signup");
        }
    });

export default account;