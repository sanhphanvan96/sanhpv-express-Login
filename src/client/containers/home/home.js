import React, {Component} from "react";
import AllUser from "../users/allUser";

class Home extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){}

    componentDidMount(){}

    shouldComponentUpdate(nextProps, nextState) {
        return true
    }

    componentWillReceiveProps(nextProps) {}

    render() {
        return (
            <section>
                <h1>Dashboard</h1>
            </section>
        )
    }
}

export default Home;