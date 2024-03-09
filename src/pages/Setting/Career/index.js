import React, { useMemo, useState, useEffect } from "react";
import {Container} from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from '../../../components/Common/TableContainer';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import withRouter from "components/Common/withRouter";

import { withTranslation } from "react-i18next";

const CareerPage = (props) => {
    const [rows, setRows] = useState([]);
    document.title = "Status Page";
    const navigate = useNavigate();

    const columns = useMemo(
        () => [
            {
                Header: 'Tên ngành nghề',
                accessor: 'name',
            },
            {
                Header: 'Ghi chú',
                accessor: 'note'
            },
            {
                Header: 'Thao tác',
                accessor: 'action'
            }
        ],
        []
    );

    const data = [
        {
            name: "Hoàn thiện nội thất",
            note: "Ngành hoàn thiện nội thất Nhật Bản",
        },
        {
            name: "Điện tử",
            note: "Ngành điện tử",
        },
        {
            name: "Giàn giáo",
            note: "Ngành giàn giáo",
        },
    ];

    const addForm = () => {
        navigate('/input-career');
    }

    const createTableData = (item) => {
        const name = item.name;
        const note = item.note;

        const action = (
            <div className="d-flex flex-wrap gap-2">
                <button
                    type="button"
                    className="btn btn-success  sm"
                    onClick={() => alert(`Edit item name: ${item.name}`)}
                >
                    <i className="mdi mdi-pencil d-block font-size-14"></i>{" "}
                </button>
                <button
                    type="button"
                    className="btn btn-danger  sm"
                    onClick={() => alert(`Delete item name: ${item.name}`)}
                >
                    <i className="mdi mdi-trash-can d-block font-size-14"></i>{" "}
                </button>
            </div>
        )

        return {name, note, action}
    }

    useEffect(() => {
        let arr = [];
        const fetchAllData = () => {
          arr = data.map((e) => createTableData(e));
        };
        fetchAllData();
        setRows(arr);
      }, []);



    return (
        <>
            <div className="page-content">

                <Container fluid={true}>
                    <Breadcrumbs title="Career Form" breadcrumbItem="Career Form" />
                    <div className="d-flex mb-2 justify-content-end">
                        <button
                            type="button"
                            className="btn btn-success  w-sm"
                            onClick={addForm}
                        >
                            <i className="bx bx-add-to-queue d-block font-size-24"></i>{" "}
                        </button>
                    </div>

                    <TableContainer
                        columns={columns}
                        data={rows}
                        isGlobalFilter={true}
                        isAddOptions={false}
                        customPageSize={10}
                        isPagination={true}
                        tableClass="align-middle table-nowrap table-check table"
                        theadClass="table-dark"
                        paginationDiv="col-12"
                        pagination="justify-content-center pagination pagination-rounded"
                    />
                </Container>
            </div>
        </>
    );
}

CareerPage.propTypes = {
    preGlobalFilteredRows: PropTypes.any,
};

// export default withRouter(withTranslation()(StatusPage));
export default CareerPage;