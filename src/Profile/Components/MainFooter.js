import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Nav, NavItem, NavLink, Col } from "shards-react";
import { Link } from "react-router-dom";
import '../Css/Footer.css';

const MainFooter = ({ contained, menuItems, copyright }) => (
  <footer className="main-footer d-flex p-2 px-3 bg-white border-top hidden-xs">
    <Container fluid={contained}>
      <Row>
        <Col id="datatableFooter" className="copy hidden-xs"><span className="copyright ml-auto my-auto mr-2">{copyright}</span></Col>
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
