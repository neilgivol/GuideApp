import React, { Component } from 'react';
import { Card, ListGroup, ListGroupItem, Form, Button, Dropdown } from 'react-bootstrap';

class ProfileCard extends Component {
    constructor(props){
        super(props)
        this.state={
            facebookLogin:this.props.facebookLogin,
            picture:this.props.picture,
            firstName:this.props.firstName,
            lastName:this.props.lastName,
            email:this.props.email,
            details:this.props.details
        }
    }
    funcPic = ()=>{
        let ifFace = this.state.facebookLogin;
        if (ifFace) {
            return  <Card.Img variant="top" src={this.state.picture} style={{height:'50px', width:'50px'}} />
        }
        else{
            return <Card.Img variant="top" src="" style={{height:'50', width:'50'}} />

        }
    }
    funcName=()=>{
        let ifFace = this.state.facebookLogin;
        if(ifFace)
        {
            return <h1>{this.state.firstName} {this.state.lastName}</h1>
        }
        else{
            return <h1>{this.state.details.givenName} {this.state.details.familyName} </h1>;
        }
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