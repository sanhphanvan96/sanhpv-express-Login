import mailer from "nodemailer";
import mg from "nodemailer-mailgun-transport";

let auth = {
    auth: {
        api_key: 'key-26dd25a54f58fc9abee7cf50244140ea', // MAILGUN API KEYS
        domain: "sandbox50f175f1179e4d308f93cfd1749f7b48.mailgun.org" // MAILGUN DOMAIN
    }
};

const nodemailerMG = mailer.createTransport(mg(auth));

export default nodemailerMG;