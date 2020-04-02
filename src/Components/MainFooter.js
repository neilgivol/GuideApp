import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Nav, NavItem, NavLink, Col } from "shards-react";
import { Link } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "shards-ui/dist/css/shards.min.css";
// import "../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import '../Css/Footer.css';
const MainFooter = ({ contained, menuItems, copyright }) => (
  <footer className="main-footer d-flex p-2 px-3 bg-white border-top">
    <Container fluid={contained}>
      <Row>
        <Col sm="6"><Nav className="nav">
          {menuItems.map((item, idx) => (
            <NavItem key={idx}>
              <NavLink tag={Link} to={item.to}>
                {item.title}
              </NavLink>
            </NavItem>
          ))}
        </Nav></Col>
        <Col className="copy" sm="6"><span className="copyright ml-auto my-auto mr-2">{copyright}</span></Col>
      </Row>
    </Container>
  </footer>
);

MainFooter.propTypes = {
  /**
   * Whether the content is contained, or not.
   */
  contained: PropTypes.bool,
  /**
   * The menu items array.
   */
  menuItems: PropTypes.array,
  /**
   * The copyright info.
   */
  copyright: PropTypes.string
};

MainFooter.defaultProps = {
  contained: false,
  copyright: "Copyright © 2020 IsraVisor",
  menuItems: [
    {
      title: "Home",
      to: "#"
    },
    {
      title: "Chat",
      to: "#"
    },
    {
      title: "About",
      to: "#"
    },
    {
      title: "Products",
      to: "#"
    },
    {
      title: "Blog",
      to: "#"
    }
  ]
};

export default MainFooter;
