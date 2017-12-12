import React from 'react';
import PropTypes from "prop-types";

class CreateUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            csrfToken: ""
        }
    }

    componentDidMount() {
        // Run code after rendered
        setTimeout(() => {
            let csrfToken = $("#_csrf").val();
            this.setState({csrfToken});
        }, 0);
    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3>Create User</h3>
                </div>
                <div className="panel-body">
                    <form action="/api/users" method="post">
                        <div className="form-group">
                            <input className="form-control" name="email" type="email" placeholder="Email" required={true}/>
                        </div>
                        <div className="form-group">
                            <input className="form-control" name="password" type="password" placeholder="Password" required={true}/>
                        </div>

                        <div className="form-group">
                            <input className="form-control" name="name" type="text" placeholder="Name"/>
                        </div>
                        <input type="hidden" name="_csrf" value={this.state.csrfToken}/>
                        <button type="submit" className="btn btn-success" ><span className="glyphicon glyphicon-ok-sign"></span> Create</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default CreateUser;