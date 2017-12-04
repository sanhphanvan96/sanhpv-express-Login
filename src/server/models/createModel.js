import db from "./database";

export default function (schemaName, modelSchema, collection) {
    return db.model(schemaName, modelSchema, collection);
}