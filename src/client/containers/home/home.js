import React, {Component} from "react";

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
            <div>Hello</div>
        )
    }
}

export default Home;