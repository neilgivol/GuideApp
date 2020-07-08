import React, { Component } from 'react';
import { Container } from "shards-react";
import '../Css/globalhome.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import '../Profile/Css/ProfileDetails.css'
import "../Css/Contact.css";
import { Button, Col, Row, Form, ListGroup, Card, ListGroupItem } from 'react-bootstrap';

class Contact extends Component {
    constructor(props) {
        super(props)
        this.state = {
            local: this.props.local,
            navbar: this.props.navbarOpenCheck,
            name: '',
            email: '',
            message: ''
        }
        let local = this.state.local;
        this.apiUrl = "http://localhost:49948/api/";
        if (!local) {
            this.apiUrl = "https://proj.ruppin.ac.il/bgroup10/PROD/api/";
        }

    }
    onNameChange(event) {
        this.setState({ name: event.target.value })
    }

    onEmailChange(event) {
        this.setState({ email: event.target.value })
    }

    onMessageChange(event) {
        this.setState({ message: event.target.value })
    }

    sendEmail = () => {
        let message = {
            Name: this.state.name,
            Body: this.state.message,
            EmailFrom: this.state.email,
        }
        console.log(message);
        console.log(this.apiUrl + 'Guide/SendEmailToApp')
        fetch(this.apiUrl + 'Guide/SendEmailToApp', {
            method: 'POST',
            body: JSON.stringify(message),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
            })
        })
            .then((res) => {
                return res.json();
            })
            .then(
                (result) => {
                    console.log(result);
                },
                (error) => {
                    console.log("err post=", error);
                }
            );
    }

    // handleSubmit(event) {
    //     this.sendEmail();
    // }

    render() {
        return (
            <Container fluid id={this.props.navbarOpenCheck} className="HomePageContainer" >
            <Row>
                <Col md="6">
                    <Card>
                        <Card.Header className="border-bottom headDiv">
                            <h3 className="m-0">Contact Us</h3>
                        </Card.Header>
                        <ListGroup flush>
                            <ListGroupItem className="p-3">
                                <Form className="myForm">
                                    <Row form>
                                        <Col md="12" className="form-group">
                                            <label>First Name</label>
                                            <input
                                                className="form-control"
                                                placeholder="Name"
                                                type="text"
                                                value={this.state.name}
                                                onChange={this.onNameChange.bind(this)}
                                            />
                                        </Col>
                                        <Col md="12" className="form-group">
                                            <label>Email Address</label>
                                            <input
                                                className="form-control"
                                                placeholder="Email Address"
                                                type="email"
                                                value={this.state.email}
                                                onChange={this.onEmailChange.bind(this)}
                                            />
                                        </Col>
                                        <Col md="12" className="form-group MessageBody">
                                            <label>Message</label>
                                            <textarea
                                                className="form-control"
                                                placeholder="Your Message"
                                                value={this.state.message}
                                                onChange={this.onMessageChange.bind(this)}
                                            />
                                        </Col>
                                    </Row>
                                </Form>
                                <Row>
                                    <Col className="ColBtnSave">
                                        <Button className="BtnSave" onClick={() => { this.sendEmail() }} type="button" >Send Message</Button>
                                    </Col>

                                </Row>
                            </ListGroupItem>
                        </ListGroup>
                    </Card>
                </Col>
                <Col md="6">
                    <ListGroup className="DetailsContact">
                        <ListGroupItem> <h4><span><i class="fas fa-envelope"></i></span><a href="mailto:IsraAdvisor@gmail.com"> IsraAdvisor@gmail.com</a></h4></ListGroupItem>
                        <ListGroupItem> <h4><span><i class="fas fa-phone-alt"></i></span><a href="tel:1-800-800-830"> 1-800-800-830</a></h4></ListGroupItem>
                        <ListGroupItem> <h4><span><i class="fas fa-map-marker-alt"></i></span> עמק חפר 4025000</h4></ListGroupItem>
                    </ListGroup>
                </Col>
</Row>

            </Container>
        );
    }
}

export default Contact;