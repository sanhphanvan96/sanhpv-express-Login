import React from "react";
import DataTable from "../../components/DataTable";
import {connect} from "react-redux";
import {fetchUser, userCount} from "../../actions/user";
import * as _ from "lodash";
import Loading from "../../components/loading";
import {setBody, setFooter, setID, setTitle} from "../../actions/modal";

class AllUser extends React.Component {
    constructor(props) {
        super(props);
        this.fields = [{
            fieldName: "emails.address",
            label: "Email"
        }, {
            label: "Name",
            fieldName: "profile.name"
        }];
        this.limit = 10;
        this.skip = 0;
        this.filter = "";
        this.state = {
            users: [],
            loading: true,
            csrfToken: "",
            userCount: 0
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        let users = !_.isEqual(this.state.users, nextState.users),
            userCount = !_.isEqual(this.state.userCount, nextState.userCount),
            loading = !_.isEqual(this.state.loading, nextState.loading),
            change = !_.isEqual(this.state.changed, nextState.changed);
        return users || loading || userCount || change;
    }

    async loadData(filter, pageNumber) {
        let page = pageNumber || 1;
        let isActiveNumber = page > 0 ? (+page) - 1 : 0;
        this.skip = isActiveNumber * this.limit;
        await fetchUser(filter, this.limit, this.skip);
        await userCount(filter);
    }

    async componentDidMount() {
        let currentPage = this.props.match.params.page || 1;
        await this.loadData(null, currentPage);
        setTimeout(() => {
            this.setState({csrfToken: $("#_csrf").val()});
        }, 0)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({users: nextProps.users, loading: false});
        if (!_.isEqual(this.state.userCount, nextProps.userCount)) {
            this.setState({userCount: nextProps.userCount})
        }
        if(!_.isEqual(this.props.match, nextProps.match)) {
            this.loadData(this.filter, nextProps.match.params.page);
        }
    }

    modalEditBody(item) {
        setTimeout(() => {
            let selector = $("#updateUser");
            selector.find("[name='email']").val(item.emails.address);
            selector.find("[name='name']").val(item.profile != undefined ? item.profile.name : "");
        }, 0);
        return (
            <form id="updateUser" action={`/api/users/update/${item._id}`} method="post">
                <div className="form-group">
                    <input className="form-control" name="email" type="email" placeholder="Email"/>
                </div>
                <div className="form-group">
                    <input className="form-control" name="password"
                           type="password" placeholder="Password"/>
                </div>

                <div className="form-group">
                    <input className="form-control" name="name" type="text" placeholder="Name"/>
                </div>
                <input type="hidden" name="_csrf" value={this.state.csrfToken}/>
            </form>
        )
    }

    modalEditFooter() {
        return <button type="submit" form="updateUser" className="btn btn-primary btn-lg" style={{width: "100%"}}><span
            className="glyphicon glyphicon-ok-sign"></span>Update</button>
    }

    modalDeleteBody(item) {
        return <form id="deleteUser" action={`/api/users/delete/${item._id}`} method="POST">
            <div className="alert alert-danger"><span className="glyphicon glyphicon-warning-sign"></span> Are you sure
                you want to delete this Record?
            </div>
            <input type="hidden" name="_csrf" value={this.state.csrfToken}/>
        </form>
    }

    modalDeleteFooter() {
        return <section>
            <button type="submit" form="deleteUser" className="btn btn-success"><span
                className="glyphicon glyphicon-ok-sign"></span> Yes
            </button>
            <button type="button" className="btn btn-default" data-dismiss="modal"><span
                className="glyphicon glyphicon-remove"></span> No
            </button>
        </section>
    }

    async onChangeSearch(searchText) {
        this.filter = searchText;
        await this.loadData(searchText, 1);
    }

    renderHeader() {
        return (
            <div className="row">
                <div className="col-sm-6">
                    <label>Search:
                        <input type="search"
                               className="form-control input-sm"
                               onChange={(e) => this.onChangeSearch(e.target.value)}
                               placeholder=""
                               aria-controls="example1"/>
                    </label>
                </div>
            </div>
        )
    }

    onClickEdit(item) {
        setID("edit");
        setTitle("Edit");
        setBody(this.modalEditBody.bind(this, item));
        setFooter(this.modalEditFooter.bind(this));
        setTimeout(() => {
            $("#edit").modal();
        }, 50)
    }

    onClickDelete(item) {
        setID("delete");
        setTitle("Delete");
        setBody(this.modalDeleteBody.bind(this, item));
        setFooter(this.modalDeleteFooter.bind(this, item));
        setTimeout(() => {
            $("#delete").modal();
        }, 50)
    }

    render() {
        return <section>
            {
                this.state.loading &&
                <Loading/>
            }
            {
                (!this.state.loading) &&
                <DataTable
                    {...this.props}
                    title="All Users"
                    renderHeader={() => this.renderHeader()}
                    onClickEdit={this.onClickEdit.bind(this)}
                    onClickDelete={this.onClickDelete.bind(this)}
                    dataSource={this.state.users}
                    limit={this.limit}
                    dataCount={this.state.userCount}
                    fields={this.fields}/>
            }
        </section>
    }
}

const mapStateToProps = (state) => {
    return {
        users: state.user.data,
        userCount: state.user.count
    }
};

export default connect(mapStateToProps, null)(AllUser);