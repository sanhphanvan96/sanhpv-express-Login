import passport from "passport";
import express from "express";
import passwordHash from "password-hash";
import {Strategy as LocalStrategy} from "passport-local"
import {createAuthToken} from "../controllers/accessToken";
import {createUser, findOneUser, updateUser} from "../controllers/user";
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
    .post(async (req, res, next) => {
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

account.route("/forgot")
    .get((req, res, next) => {
        res.render("forgot.html", {csrfToken: req.csrfToken()});
    })
    .post(async (req, res, next) => {
        try {
            let user = await findOneUser({"emails.address": req.body.email});
            if (user) {
                let resetPasswordToken = CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(16)),
                    resetPasswordExpires = Date.now() + 3600000; // 1 hour
                await updateUser({_id: user._id}, {
                    $set: {
                        resetPasswordToken,
                        resetPasswordExpires, // 1 hour
                    }
                });

                // Send Reset Password Email
                nodemailerMG.sendMail({
                    from: 'demoapp@no-reply.com', // sender address
                    to: user.emails.address, // list of receivers
                    subject: 'Reset Password', // Subject line
                    html: `Reset Password: <a href="http://localhost:3000/account/resetPassword?verifyToken=${resetPasswordToken}">http://localhost:3000/account/resetPassword?verifyToken=${resetPasswordToken}</a>` // html body
                }, (error, info) => {
                    if (error) console.log(error);
                    else console.log(info);
                });

                req.flash("info", "An email has been sent to your email");
                return res.redirect('/account/login')
            }
            req.flash("error", "Email not found");
            res.redirect("/account/forgot");
        } catch (e) {
            next(e);
        }
    });


account.use('/resetPassword', async (req, res, next) => {
    try {
        if (req.query.verifyToken) {
            let token = await findOneUser({resetPasswordToken: req.query.verifyToken});
            if (token) {
                if (Date.now() > new Date(token.resetPasswordExpires).getTime()) {
                    req.flash('error', "Token is expired");
                } else {
                    req.userResetPassword = token._id; // Save userId to req.userResetPassword
                    return next();
                }
            }
        } else {
            req.flash("info", "Please insert your email");
        }
        res.redirect("/account/forgot");
    } catch (e) {
        next(e);
    }
});

account.route('/resetPassword')
    .get(async (req, res, next) => {
        try {
            req.flash("info", "Insert your new password");
            return res.render("resetPassword.html", {csrfToken: req.csrfToken(), verifyToken: req.query.verifyToken});
        } catch (e) {
            next(e);
        }
    })
    .post(async (req, res, next) => {
        try {
            let {password, repassword} = req.body;
            if(password && repassword) {
                if(password !== repassword) {
                    req.flash("error", "Password and RePassword are not matched");
                } else {
                    await updateUser({_id: req.userResetPassword}, {
                        $set: {
                            password: passwordHash.generate(password)
                        },
                        $unset: {
                            resetPasswordToken: "",
                            resetPasswordExpires: "",
                        }
                    });
                    req.flash("success", "Password reset completely");
                    return res.redirect("/account/login");
                }
            } else {
                req.flash("error", "Password is required");
            }
            res.redirect(`/account/resetPassword?verifyToken=${req.query.verifyToken}`);
        } catch (e) {
            next(e);
        }
    });

export default account;