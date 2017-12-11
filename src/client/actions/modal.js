import {MODAL} from "../constants/actionTypes";
import store from "../store/store";

function setIDAction(payload) {
    return {
        type: MODAL.SET_ID,
        payload
    }
}

function setTitleAction(payload) {
    return {
        type: MODAL.SET_TITLE,
        payload
    }
}

function setBodyAction(payload) {
    return {
        type: MODAL.SET_BODY,
        payload
    }
}

function setFooterAction (payload) {
    return {
        type: MODAL.SET_FOOTER,
        payload
    }
}

export function setID(id) {
    return store.dispatch(setIDAction(id));
}

export function setTitle(title) {
    return store.dispatch(setTitleAction(title))
}

export function setBody (body) {
    return store.dispatch(setBodyAction(body))
}

export function setFooter (footer) {
    return store.dispatch(setFooterAction(footer));
}

