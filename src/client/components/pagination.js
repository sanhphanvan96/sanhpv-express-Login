import React from "react";
import PropTypes from "prop-types";
import querystring from "query-string";

class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.numberOfPages = 0;
    }

    checkActive(index) {
        let query = querystring.parse(this.props.location.search);
        let isActiveNumber = query.page || 1;
        return isActiveNumber == index ? "active" : "";
    }

    renderPagination() {
        let { dataCount, limit } = this.props,
            pageNumber = [];
        this.numberOfPages = Math.ceil(dataCount/limit);
        for(let i = 1; i <= this.numberOfPages; i++) {
            pageNumber.push(
                <li key={i} className={this.checkActive(i)}><a href={`/admin/users?page=${i}`}>{i}</a></li>
            )
        }
        return pageNumber;
    }

    canGoBack() {
        let query = querystring.parse(this.props.location.search);
        let isActiveNumber = query.page || 1;
        return isActiveNumber > 1
    }

    canGoForward() {
        let query = querystring.parse(this.props.location.search);
        let isActiveNumber = +query.page || 1;
        return isActiveNumber < this.numberOfPages
    }

    render() {
        let query = querystring.parse(this.props.location.search);
        let page = +query.page || 1;

        return (
            <ul className="pagination pull-right">
                <li className={this.canGoBack() ? "" : "disabled"}><a href={`/admin/users?page=${page - 1}`}><span
                    className="glyphicon glyphicon-chevron-left"></span></a></li>
                {this.renderPagination()}
                <li className={this.canGoForward() ? "" : "disabled"}><a href={`/admin/users?page=${page + 1}`}><span className="glyphicon glyphicon-chevron-right"></span></a></li>
            </ul>
        )
    }
}

Pagination.propTypes = {
    dataCount: PropTypes.number,
    limit: PropTypes.number
};

export default Pagination;