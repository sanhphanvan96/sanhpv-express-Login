import {ACCOUNT} from "../constants/actionTypes";

const initialState = {
    user: {},
    auth: {}
};

export default function (state = initialState, action = {}) {
    switch (action.type) {
        case ACCOUNT.LOGIN: {
            return {
                user: action.payload.user,
                auth: action.payload.auth
            }
        }
        default: return state
    }
}