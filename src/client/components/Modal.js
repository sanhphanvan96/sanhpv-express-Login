import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import * as _ from "lodash";

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ID: "",
            title: "",
            renderBody: () => {},
            renderFooter: () => {}
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.state, nextState);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            ID: nextProps.ID,
            title: nextProps.title,
            renderBody: nextProps.renderBody,
            renderFooter: nextProps.renderFooter
        })
    }

    render() {
        return (
            <div className="modal fade" id={this.state.ID} tabIndex="-1" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true"><span
                                className="glyphicon glyphicon-remove" aria-hidden="true"></span></button>
                            <h4 className="modal-title custom_align" id="Heading">{this.state.title}</h4>
                        </div>
                        <div className="modal-body">
                            {this.state.renderBody()}
                        </div>
                        <div className="modal-footer ">
                            {this.state.renderFooter()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Modal.propTypes = {
    ID: PropTypes.string,
    title: PropTypes.string,
    renderBody: PropTypes.func,
    renderFooter: PropTypes.func
};

Modal.defaultProps = {
    ID: "",
    title: "",
    renderBody: () => {
    },
    renderFooter: () => {
    }
};

const mapStateToProps = (state) => {
    return {
        ID: state.modal.ID,
        title: state.modal.title,
        renderBody: state.modal.renderBody,
        renderFooter: state.modal.renderFooter
    }
};

export default connect(mapStateToProps, null)(Modal);