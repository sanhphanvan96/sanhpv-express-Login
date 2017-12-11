import {API, USER} from "../constants/actionTypes";
import store from "../store/store";

function fetchUserAction (payload) {
    return {
        type: USER.FETCH_USER,
        payload
    }
}

export async function fetchUser(filter, limit, skip) {
    try {
        let url = `${API.FETCH_USER}?limit=${limit}&skip=${skip}`;

        if(filter) {
            url += `&searchText=${filter}`;
        }

        let response = await fetch(url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cache': 'no-cache'
            },
            credentials: 'include'
        });
        response = await response.json();
        return store.dispatch(fetchUserAction(response))
    } catch(e) {
        throw e;
    }
}

function userCountAction (payload) {
    return {
        type: USER.USER_COUNT,
        payload
    }
}

export async function userCount (filter) {
    try {
        let url = API.USER_COUNT;

        if(filter) {
            url += `?searchText=${filter}`;
        }

        let response = await fetch(url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cache': 'no-cache'
            },
            credentials: 'include'
        });
        response = await response.json();
        return store.dispatch(userCountAction(response))
    } catch(e) {
        throw e;
    }
}