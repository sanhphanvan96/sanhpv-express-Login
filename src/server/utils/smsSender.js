import twilio from "twilio";

const config = {
    accountSid: "AC7ee90db5ded0080f2704c83b332b13fe", // Change it to process.env.TWILIO_ACCOUNT_SID
    authToken: "03709919f3dfc9062277c3d5b2d9555e" // Change it to process.env.TWILIO_AUTH_TOKEN
};

export function sendSMS(to, message) {
    const client = twilio(config.accountSid, config.authToken);
    return client.api.messages.create({
        to,
        from: "+12165928648", // Twilio Phone Number
        body: message,
    })
}