import {combineReducers} from "redux";
import account from "./account";
import user from "./user";
import modal from "./modal";

const appReducer = combineReducers({account, user, modal});

export default appReducer;