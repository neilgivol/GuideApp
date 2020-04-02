import React, { Component, useState } from 'react';
import {  Button } from 'react-bootstrap';
import '../Css/ProfileCard.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import {Card, CardBody, CardText, CardImg, CardTitle, CardLink, ListGroupItem,ListGroup} from 'shards-react';

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
    componentWillMount(){
    }
    // componentDidMount() {
    //     console.log(this.props.GuideLinks)
    //     const areas = JSON.parse(localStorage.getItem('areas'));
    //     const languages = JSON.parse(localStorage.getItem('languages'));
    //     const links = JSON.parse(localStorage.getItem('links'));
    //     console.log(links)

    //   if (this.state.areas.length === 0) {
    //     this.setState({
    //         areas:areas
    //     })
    //   }
    //   if (this.state.languages.length === 0) {
    //     this.setState({
    //         languages:languages
    //     })
    //   }
    //     let tempSum = 10;
    //     let userBirth = this.state.user.BirthDay;
    //     let userPhone = this.state.user.Phone;
    //     let userDescription = this.state.user.DescriptionGuide
    //     let userPicture = this.state.user.ProfilePic;
    //     let userAreas = this.state.areas;
    //     let userLanguages = this.state.languages;
    //     if (userBirth !== "") {
    //         tempSum=parseInt(tempSum)+10;
    //     }
    //      if(userPhone !== ""){
    //         tempSum=parseInt(tempSum)+10;
    //     }
    //      if(userDescription !== ""){
    //         tempSum=parseInt(tempSum)+10;
    //     }
    //      if(userPicture !== ""){
    //         tempSum=parseInt(tempSum)+10;
    //     }
    //      if(areas.length !== 0){
    //         tempSum=parseInt(tempSum)+10;
    //     }
    //      if(languages.length !== 0){
    //         tempSum=parseInt(tempSum)+10;
    //     }
    //     if(links.length !== 0){
    //         tempSum=parseInt(tempSum)+10;
    //     }

    //     this.setState({
    //         sum:tempSum
    //     })
    // }


    funcPic = () => {
        return <div className="imageClass">
            <CardImg variant="top" src={this.state.user.ProfilePic} style={{ height: '50', width: '50' }} />
            <span className="uploadPicIcon">
                <i class="far fa-image"></i></span>
        </div>
    }
    funcName = () => {
        return <h2>{this.state.user.FirstName} {this.state.user.LastName}</h2>
    }
    render() {
        return (
            <Card className="CardBodyDiv">
                {this.funcPic()}
                <CardBody>
                    <CardTitle>{this.funcName()}</CardTitle>
                    <CardText>
                       <h1>{this.state.sum}%</h1>
                                      </CardText>
                </CardBody>
                <ListGroup className="list-group-flush">
                    <ListGroupItem>Cras justo odio</ListGroupItem>
                    <ListGroupItem>Dapibus ac facilisis in</ListGroupItem>
                    <ListGroupItem>Vestibulum at eros</ListGroupItem>
                </ListGroup>
                <CardBody>
                    <CardLink href="/">Logout</CardLink>
                </CardBody>
            </Card>
        );
    }
}

export default ProfileCard;