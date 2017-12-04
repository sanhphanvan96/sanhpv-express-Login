import { createClient } from "redis";
import debug from "debug";

const redis = createClient(6379, "localhost");

redis.on("error", function (err) {
   debug("DemoApp")(`Error ${err}`);
});

export default redis;

