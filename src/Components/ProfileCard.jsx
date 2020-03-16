import React, { Component, useState } from 'react';
import { Card, ListGroup, ListGroupItem, Form, Button, Dropdown } from 'react-bootstrap';
const FacebookUser = JSON.parse(localStorage.getItem('FacebookUser'));
const GoogleUser = JSON.parse(localStorage.getItem('GoogleUser'));
const SignUpUser = JSON.parse(localStorage.getItem('SignUpUser'));

class ProfileCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                FirstName: "",
                LastName: "",
                Email: "",
            },
            allUsers: this.props.Allusers
        }

    }
    componentWillMount() {
        this.GetGuide();
        console.log("Check")
    }

    GetGuide = () => {
        let logginUser = "";
        for (let i = 0; i < this.state.allUsers.length; i++) {
            const element = this.state.allUsers[i];
            if (element.Email === this.props.email) {
                logginUser = element;
            }
        }
        this.setState({
            user: logginUser
        })

    }
    funcPic = () => {
        return <Card.Img variant="top" src={this.state.user.ProfilePic} style={{ height: '50', width: '50' }} />
    }
    funcName = () => {
        return <h1>{this.state.user.FirstName} {this.state.user.LastName}</h1>
    }
    render() {
        return (
            <Card>
                {this.funcPic()}
                <Card.Body>
                    <Card.Title>{this.funcName()}</Card.Title>
                    <Card.Text>
                        Some quick example text to build on the card title and make up the bulk of
                        the card's content.
                                      </Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    <ListGroupItem>Cras justo odio</ListGroupItem>
                    <ListGroupItem>Dapibus ac facilisis in</ListGroupItem>
                    <ListGroupItem>Vestibulum at eros</ListGroupItem>
                </ListGroup>
                <Card.Body>
                    <Card.Link href="#">Card Link</Card.Link>
                    <Card.Link href="#">Another Link</Card.Link>
                </Card.Body>
            </Card>
        );
    }
}

export default ProfileCard;