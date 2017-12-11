import {USER} from "../constants/actionTypes";

const initialState = {
    data: [],
    count: 0
};

export default function (state = initialState, action = {}) {
    switch (action.type) {
        case USER.FETCH_USER: {
            return {
                ...state,
                data: action.payload
            }
        }
        case USER.USER_COUNT: {
            return {
                ...state,
                count: action.payload
            }
        }
        default: return state
    }
}