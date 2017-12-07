import express from "express";

const profile = express.Router();

profile.route("/")
    .get((req, res ,next) => {
        res.render("profile.html", {csrfToken: req.csrfToken(), user: req.user});
    });

export default profile;