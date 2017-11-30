import React, {Component} from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux"
import {renderRoutes} from "react-router-config";
import {BrowserRouter} from "react-router-dom";
import routes from "./routes";
import store from "./store/store";

class Root extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    {renderRoutes(routes)}
                </BrowserRouter>
            </Provider>
        )
    }
}

ReactDOM.hydrate(<Root/>, document.getElementById("root"));