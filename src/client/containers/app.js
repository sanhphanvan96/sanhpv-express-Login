import React, { Component } from "react";
import {renderRoutes} from "react-router-config";
import Sidebar from "../components/sidebar";
import Modal from "../components/Modal";

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-fluid main-container">
                <Sidebar/>
                <section className="col-md-10 content">
                    {renderRoutes(this.props.route.routes)}
                </section>
                <Modal/>
            </div>
        )
    }
}

export default App