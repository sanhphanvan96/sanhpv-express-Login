import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.numberOfPages = 0;
    }

    checkActive(index) {
        let isActiveNumber = this.props.match.params.page || 1;
        return isActiveNumber == index ? "active" : "";
    }

    renderPagination() {
        let {dataCount, limit} = this.props,
            pageNumber = [];
        this.numberOfPages = Math.ceil(dataCount / limit);
        for (let i = 1; i <= this.numberOfPages; i++) {
            pageNumber.push(
                <li key={i} className={this.checkActive(i)}><Link to={`/admin/users/${i}`}>{i}</Link></li>
            )
        }
        return pageNumber;
    }

    canGoBack() {
        let isActiveNumber = this.props.match.params.page || 1;
        return isActiveNumber > 1
    }

    canGoForward() {
        let isActiveNumber = this.props.match.params.page || 1;
        return isActiveNumber < this.numberOfPages
    }

    render() {
        let isActiveNumber = this.props.match.params.page || 1;
        let page = +isActiveNumber || 1;

        return (
            <ul className="pagination pull-right">
                <li className={this.canGoBack() ? "" : "disabled"}><Link to={`/admin/users/${page > 1 ? page - 1 : 1}`}><span
                    className="glyphicon glyphicon-chevron-left"></span></Link></li>
                {this.renderPagination()}
                <li className={this.canGoForward() ? "" : "disabled"}><Link to={`/admin/users/${page < this.numberOfPages ? page + 1 : this.numberOfPages}`}><span
                    className="glyphicon glyphicon-chevron-right"></span></Link></li>
            </ul>
        )
    }
}

Pagination.propTypes = {
    dataCount: PropTypes.number,
    limit: PropTypes.number
};

export default Pagination;