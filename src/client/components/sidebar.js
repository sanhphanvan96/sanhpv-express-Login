import React from "react";
import {Link} from "react-router-dom";

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section className="col-md-2 sidebar">
                <div className="row">
                    {/*<!-- uncomment code for absolute positioning tweek see top comment in css -->*/}
                    <div className="absolute-wrapper"></div>
                    {/*<!-- Menu -->*/}
                    <div className="side-menu">
                        <nav className="navbar navbar-default" role="navigation">
                            {/*<!-- Main Menu -->*/}
                            <div className="side-menu-container">
                                <ul className="nav navbar-nav">
                                    <li><Link to="/admin"><span className="glyphicon glyphicon-dashboard"></span>
                                        Dashboard</Link></li>
                                    {/*<!-- Dropdown-->*/}
                                    <li className="panel panel-default" id="dropdown">
                                        <a data-toggle="collapse" href="#dropdown-lvl1">
                                            <span className="glyphicon glyphicon-user"></span> Users <span
                                            className="caret"></span>
                                        </a>

                                        {/*<!-- Dropdown level 1 -->*/}
                                        <div id="dropdown-lvl1" className="panel-collapse collapse">
                                            <div className="panel-body">
                                                <ul className="nav navbar-nav">
                                                    <li><Link to="/admin/users">All</Link></li>
                                                    <li><Link to="/admin/users/create">Create</Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            {/*<!-- /.navbar-collapse -->*/}
                        </nav>

                    </div>
                </div>
            </section>
        )
    }
}

export default Sidebar;