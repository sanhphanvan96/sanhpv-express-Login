import config from "../config";

export const ACCOUNT = {
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT"
};

export const USER = {
    FETCH_USER: "FETCH_USER",
    USER_COUNT: "USER_COUNT"
};

export const MODAL = {
    SET_ID: "SET_ID",
    SET_TITLE: "SET_TITLE",
    SET_BODY: "SET_BODY",
    SET_FOOTER: "SET_FOOTER"
};

export const API = {
    FETCH_USER: `${config.baseURL}/api/users`,
    USER_COUNT: `${config.baseURL}/api/users/count`
};