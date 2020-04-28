import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import ReactLoading from 'react-loading'
//import firebase from './services/firebase';
import '../Css/Home.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import { Container } from "shards-react";
class BuildTrip extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <Container fluid id={this.props.navbarOpenCheck} className="HomePageContainer" >
                <div>
                    build
                </div>
            </Container>

        );
    }
}

export default withRouter(BuildTrip);