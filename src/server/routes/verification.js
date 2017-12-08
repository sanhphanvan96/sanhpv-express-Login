import express from "express";
import {findOneUser} from "../controllers/user";
import {User} from "../models/modelConfig";
import nodemailerMG from "../utils/nodemailer";
import {sendSMS} from "../utils/smsSender";

const verify = express.Router();

/**
 * Check if user logged in
 */

verify.use(async (req, res, next) => {
    if (req.user) {
        next()
    } else {
        req.flash("error", "You must login");
        res.redirect("/account/login");
    }
});

/**
 * Verify Email
 */

verify.use('/email', (req, res, next) => {
   if(req.user.emails.isVerified) {
       return res.redirect("/")
   }
   next();
});

verify.route('/email')
    .get(async (req, res, next) => {
        try {
            if (req.query.verifyToken) {
                // Get Email Verifying Token
                let user = await findOneUser({emailVerificationToken: req.query.verifyToken});

                // Check Token
                if (user) {
                    if (Date.now() > user.emailVerificationExpired) {
                        // Check Token Expires
                        req.flash("error", "Token is expired");
                        return res.redirect("/verify/email");
                    } else {
                        // Create Token
                        await User.update({_id: user._id}, {
                            $set: {
                                "emails.isVerified": true,
                            },
                            $unset: {
                                emailVerificationToken: "",
                                emailVerificationExpired: ""
                            }
                        }).exec();

                        // Redirect To Verify Phone Number when verified token
                        req.flash("success", "Your email has been verified");
                        return res.redirect("/verify/phoneNumber");
                    }
                } else {
                    req.flash("error", "Token not found");
                    return res.redirect("/verify/email")
                }
            }

            // Render template when
            req.flash("info", "You Must Verify Email");
            res.render("verifyEmail.html", {csrfToken: req.csrfToken(), user: req.user});
        } catch (e) {
            next(e);
        }
    })
    .post(async (req, res, next) => {
        try {
            if (req.user) {
                if (req.user.emails.isVerified) {
                    req.flash("Your email has been verified");
                    res.redirect("/");
                } else {
                    nodemailerMG.sendMail({
                        from: 'demoapp@no-reply.com', // sender address
                        to: req.user.emails.address, //receiver
                        subject: 'Email Verification', // Subject line
                        html: `Thanks for your registration please confirm your email: <a href="http://localhost:3000/verify/email?verifyToken=${req.user.emailVerificationToken}">http://localhost:3000/verify/email?verifyToken=${req.user.emailVerificationToken}</a>` // html body
                    }, (error, info) => {
                        if (error) console.log(error);
                        else {
                            console.log(info);
                            req.flash("info", "An email has been sent to your email");
                            res.redirect("/verify/email");
                        }
                    });
                    res.redirect("/verify/email");
                }
            } else {
                req.flash("info", "Please Login");
                res.redirect("/account/login");
            }
        } catch (e) {
            next(e);
        }
    });

/**
 * Phone Number Verification
 */
verify.use('/phoneNumber', (req, res, next) => {
    if(req.user.phoneNumber.isVerified) {
        return res.redirect("/")
    }
    next();
});

verify.route("/phoneNumber")
    .get(async (req, res, next) => {
        try {
            if(!req.user.phoneNumber.number) {
                res.render("verifyPhoneNumber.html", {csrfToken: req.csrfToken(), user: req.user});
            } else {
                res.render("verifyCodePhoneNumber.html", {csrfToken: req.csrfToken(), user: req.user});
            }
        } catch (e) {
            next(e);
        }
    })
    .post(async (req, res, next) => {
        try {
            if (!req.body.phoneNumber) {
                req.flash("info", "Phone Number cannot be empty");
                res.redirect("/verify/phoneNumber");
            } else {
                let {phoneNumber} = req.body;
                let phoneNumberVerifiedCode = Math.floor(Math.random() * 90000) + 10000,
                    phoneNumberCodeExpires = Date.now() + 3600000; // 1 hour
                await User.findOneAndUpdate({_id: req.user._id}, {
                    $set: {
                        'phoneNumber.number': phoneNumber,
                        phoneNumberVerifiedCode,
                        phoneNumberCodeExpires
                    }
                });
                let result = await sendSMS(phoneNumber, `Your verified code is: ${phoneNumberVerifiedCode}`); // This only for +1 code area number
                req.flash("info", "An SMS has been sent to your phone number");
                res.render("verifyCodePhoneNumber.html", {csrfToken: req.csrfToken(), user: req.user});
            }
        } catch (e) {
            next(e);
        }
    });

verify.route("/phoneNumber/code")
    .post(async (req, res, next) => {
        try {
            if(req.body.code) {
                let code = await User.findOne({phoneNumberVerifiedCode: req.body.code});
                if(code) {
                    if(Date.now() > new Date(code.phoneNumberCodeExpires).getTime()) {
                        req.flash("error", "Code is expired");
                        return res.redirect("/verify/phoneNumber");
                    } else {
                        await User.update({_id: code._id}, {
                            $set: {
                                "phoneNumber.isVerified": true,
                            },
                            $unset: {
                                phoneNumberVerifiedCode: "",
                                phoneNumberCodeExpires: ""
                            }
                        }).exec();
                        req.flash("success", "Your phone number has been verified");
                        return res.redirect("/");
                    }
                } else {
                    req.flash("error", "Code is invalid");
                    res.redirect("/verify/phoneNumber")
                }
            } else {
                req.flash("error", "Code is required");
                res.redirect("/verify/phoneNumber")
            }
        } catch(e) {
            next(e);
        }
    });

/**
 * Resend Phone Number Verification Code
 */

verify.route("/phoneNumber/resendCode")
    .post(async (req, res, next) => {
        try {
            let { phoneNumber } = req.user;
            if(phoneNumber != undefined) {
                if(phoneNumber.number.length) {

                    // Resend phoneNumber verification
                    let phoneNumberVerifiedCode = `${Math.floor(Math.random() * 90000) + 10000}`, // Cast to String
                        phoneNumberCodeExpires = Date.now() + 3600000; // 1 hour
                    await User.findOneAndUpdate({_id: req.user._id}, {
                        $set: {
                            phoneNumberVerifiedCode,
                            phoneNumberCodeExpires
                        }
                    });
                    let result = await sendSMS(phoneNumber.number, `Your verified code is: ${phoneNumberVerifiedCode}`); // This only for +1 code area number
                    req.flash("info", "An SMS has been sent to your phone number");
                    res.redirect("/verify/phoneNumber")
                } else {
                    req.flash("error", "Phone number is required");
                }
            } else {
                req.flash("error", "An error occurred when get phone number");
            }
            res.redirect("/verify/phoneNumber")
        } catch(e) {
            next(e);
        }
    });

export default verify;