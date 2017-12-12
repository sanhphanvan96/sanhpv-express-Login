import {MODAL} from "../constants/actionTypes";

const initialState = {
    ID: "",
    title: "",
    renderBody: () => {},
    renderFooter: () => {}
};

export default function (state = initialState, action = {}) {
    switch (action.type) {
        case MODAL.SET_ID: {
            return {
                ...state,
                ID: action.payload
            }
        }
        case MODAL.SET_TITLE: {
            return {
                ...state,
                title: action.payload
            }
        }
        case MODAL.SET_BODY: {
            return {
                ...state,
                renderBody: action.payload
            }
        }
        case MODAL.SET_FOOTER: {
            return {
                ...state,
                renderFooter: action.payload
            }
        }
        default: return state
    }
}