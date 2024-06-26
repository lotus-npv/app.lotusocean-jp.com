import React from "react"
import { CardBody, Container, Card } from "reactstrap"
import PropTypes from "prop-types"

import TableDatas from "./TableDatas"
import TicketInbox from "./TicketInbox"
import { ToastContainer } from "react-toastify"

const TicketPage = props => {
  document.title = "Support Page"
  return (
    <>
      <div className="page-content bg-light">
        <Container fluid={true} className="">
          <TicketInbox />
          <ToastContainer />
        </Container>
      </div>
    </>
  )
}

TicketPage.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

// export default withRouter(withTranslation()(StatusPage));
export default TicketPage
