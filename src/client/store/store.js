import {applyMiddleware, createStore} from "redux";
import appReducer from "../reducers/index";
import thunk from "redux-thunk";

const store = createStore(appReducer, window.__INITIAL_STATE__, applyMiddleware(thunk));

export default store;