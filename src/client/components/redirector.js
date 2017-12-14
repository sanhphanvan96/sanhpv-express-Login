import React from "react";
import {Redirect} from "react-router-dom";

class Redirector extends React.Component  {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Redirect to={this.props.route.redirect}/>
        )
    }
}

export default Redirector;