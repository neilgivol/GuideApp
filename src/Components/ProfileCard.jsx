import React, { Component, useState } from 'react';
import { Card, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import '../Css/ProfileCard.css';

class ProfileCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.GuideDetails,
            languages:this.props.languages,
            areas:this.props.areas,
            sum:0
        }
    }
    componentDidMount() {
        let tempSum = 0;
        let userBirth = this.state.user.BirthDay;
        let userPhone = this.state.user.Phone;
        let userDescription = this.state.user.DescriptionGuide
        let userPicture = this.state.user.ProfilePic;
        let userAreas = this.state.areas;
        let userLanguages = this.state.languages;
        if (userBirth !== "") {
            tempSum=tempSum+10;
        }
        else if(userPhone !== ""){
            tempSum=tempSum+10;
        }
        else if(userDescription !== ""){
            tempSum=tempSum+10;
        }
        else if(userPicture !== ""){
            tempSum=tempSum+10;
        }
        else if(userAreas !== ""){
            tempSum=tempSum+10;
        }
        else if(userLanguages !== ""){
            tempSum=tempSum+10;
        }

        this.setState({
            sum:tempSum
        })
        console.log(this.state.sum);
        console.log(tempSum);
    }


    funcPic = () => {
        return <div className="imageClass">
            <Card.Img variant="top" src={this.state.user.ProfilePic} style={{ height: '50', width: '50' }} />
            <span className="uploadPicIcon">
                <i class="far fa-image"></i></span>
        </div>
    }
    funcName = () => {
        return <h1>{this.state.user.FirstName} {this.state.user.LastName}</h1>
    }
    render() {
        return (
            <Card className="CardBodyDiv">
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