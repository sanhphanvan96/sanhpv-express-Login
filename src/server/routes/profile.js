import express from "express";

const profile = express.Router();

profile.use((req, res, next) => {
   if(req.user) {
       next()
   } else {
       req.flash("info", "You must login");
       res.redirect("/account/login");
   }
});

profile.route("/")
    .get((req, res ,next) => {
        res.render("profile.html", {csrfToken: req.csrfToken(), user: req.user});
    });

export default profile;