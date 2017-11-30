import React, { Component } from "react";
import {renderRoutes} from "react-router-config";

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return renderRoutes(this.props.route.routes);
    }
}

export default App