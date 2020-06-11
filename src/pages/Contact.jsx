import React, { Component } from 'react';
import { Container } from "shards-react";
import '../Css/Home.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";

class Contact extends Component {
    constructor(props){
        super(props)
        this.state = {
            navbar: this.props.navbarOpenCheck,
        }

    }
  

    render() {
        return (
            <Container fluid id={this.props.navbarOpenCheck} className="HomePageContainer" >
            Contact Us:
            </Container>
        );
    }
}

export default Contact;