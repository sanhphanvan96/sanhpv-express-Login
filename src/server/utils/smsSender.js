import twilio from "twilio";

const config = {
    accountSid: "ACf5cf9f080d9253a15bab1cab9344e3ae", // Change it to process.env.TWILIO_ACCOUNT_SID
    authToken: "0d05dfb86a9336cb025c7b4a144a42db" // Change it to process.env.TWILIO_AUTH_TOKEN
};

export function sendSMS(to, message) {
    const client = twilio(config.accountSid, config.authToken);
    return client.api.messages.create({
        body: message,
        to,
        from: "+12165928648" // Twilio Phone Number
    })
}