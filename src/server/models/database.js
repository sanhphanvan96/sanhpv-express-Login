import mongoose from "mongoose";
import debug from "debug";
const
    mongoURI = `mongodb://localhost:27017/pilot1`,
    options = {
        useMongoClient: true
    };

mongoose.connect(mongoURI, options);

const conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));

conn.once('open', function () {
    debug("DemoApp")(`Database successfully connected`);
});
export {conn};
export default mongoose;