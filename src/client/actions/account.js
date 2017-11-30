import {ACCOUNT} from "../constants/actionTypes";
import store from "../store/store";

function loginAction(payload) {
    return {
        type: ACCOUNT.LOGIN,
        payload
    }
}

export function login() {
    store.dispatch({user: {}, auth: {}})
}