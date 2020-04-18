import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import '../Css/Home.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import { Container, Row, Col } from "shards-react";

class Chat extends Component {
    constructor(props){
        super(props);
        this.state={
            navbar: this.props.navbarOpenCheck
        }
     
    }
    componentDidMount(){
    }
   
    render () {
        return (
            <Container fluid id={this.props.navbarOpenCheck} className="HomePageContainer" >
            <div>Chat</div>
            </Container>
        )
    }
}

export default withRouter(Chat)