import React from "react";
import PropTypes from "prop-types";
import Pagination from "./pagination";

class DataTable extends React.Component {
    constructor(props) {
        super(props);
    }

    getDeepValue(obj, path) {
        path = path.split('.');
        for (let i = 0, len = path.length; i < len; i++) {
            if(obj != undefined) {
                obj = obj[path[i]];
            }
        }
        return obj;
    }

    componentDidMount() {
        $("[data-toggle=tooltip]").tooltip();
    }

    onClickEdit(item) {
        this.props.onClickEdit(item);
    }

    onClickDelete(item) {
        this.props.onClickDelete(item);
    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading h3 text-center">
                    {this.props.title}
                </div>
                <div className="panel-body">
                    {this.props.renderHeader()}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="table-responsive">
                                <table id="dataTable" className="table table-bordred table-striped">
                                    <thead>
                                    <tr>
                                        {this.props.fields.map((item, index) => {
                                            return <th key={index}>{item.label}</th>
                                        })}
                                        <th>Edit</th>

                                        <th>Delete</th>
                                    </tr>
                                    </thead>
                                    <tbody>

                                    {this.props.dataSource.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                {this.props.fields.map((field, i) => {
                                                    return <td key={i}>{this.getDeepValue(item, field.fieldName)}</td>
                                                })}
                                                <td>
                                                    <p data-placement="top" data-toggle="tooltip" title="Edit">
                                                        <button className="btn btn-primary btn-xs" data-title="Edit"
                                                                data-toggle="modal"
                                                                data-target="#edit" onClick={this.onClickEdit.bind(this, item)}><span
                                                            className="glyphicon glyphicon-pencil"></span>
                                                        </button>
                                                    </p>
                                                </td>
                                                <td>
                                                    <p data-placement="top" data-toggle="tooltip" title="Delete">
                                                        <button className="btn btn-danger btn-xs" data-title="Delete"
                                                                onClick={this.onClickDelete.bind(this, item)}
                                                                data-toggle="modal" data-target="#delete"><span
                                                            className="glyphicon glyphicon-trash"></span></button>
                                                    </p>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                                <div className="clearfix"></div>
                                <Pagination
                                    {...this.props}
                                    dataCount={this.props.dataCount} limit={this.props.limit}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

DataTable.propTypes = {
    title: PropTypes.string,
    dataSource: PropTypes.array,
    fields: PropTypes.array,
    limit: PropTypes.number,
    onClickEdit: PropTypes.func,
    onClickDelete: PropTypes.func,
    dataCount: PropTypes.number,
    renderHeader: PropTypes.func
};

DataTable.defaultProps = {
    title: "",
    dataSource: [],
    fields: [],
    limit: 0,
    onClickEdit: () => {},
    onClickDelete: () => {},
    dataCount: 0,
    renderHeader: () => {}
};

export default DataTable;