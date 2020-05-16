import React, { Component } from 'react';
import { Button, Col, Row, Form, ListGroup, Card, ListGroupItem, Container } from 'react-bootstrap';
import "shards-ui/dist/css/shards.min.css";
import "../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import '../Css/ProfileDetails.css';
import '../Css/Home.css';
import pic from '../Img/Default-welcomer.png';
import '../Css/TouristProfile.css';
import '../Css/Hobbies.css';
class TouristProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tourist: this.props.tourist
        }
    }
    render() {
        return (
            <Container fluid id={this.props.navbarOpenCheck} className="HomePageContainer tourContainer" >
                <Card small className="profileDetails1">
                    <Card.Header className="NameToruistDiv">
                        <h2>{this.state.tourist.FirstName} {this.state.tourist.LastName}</h2>
                    </Card.Header>
                    <ListGroup flush>
                        <ListGroupItem className="p-3">
                            <Row>
                                <Form className="myForm">
                                    <Row form>
                                        <Col md="3" className="form-group colImgDiv">
                                            {this.state.tourist.ProfilePic ? <Card.Img className="TouristImg" src={this.state.tourist.ProfilePic} /> : <Card.Img className="TouristImg" src={pic} />}
                                        </Col>
                                        <Col md="4" className="form-group personalDetails">
                                            <p><b>Email:</b> {this.state.tourist.Email} </p>
                                            <p><b>Gender:</b> {this.state.tourist.Gender} </p>
                                            <p><b>BirthDay:</b> {this.state.tourist.YearOfBirth} </p>
                                            <p><b>Language:</b> {this.state.tourist.Language} </p>
                                        </Col>
                                        <Col md="5" className="form-group tripDetails">
                                            <h2>Trip Details:</h2>
                                            {this.state.tourist.FirstTimeInIsrael ? <p><b>First Time In Israel?: </b> yes</p> : <p><b>First Time In Israel?: </b> no </p>}
                                            <p><b>Trip Type: </b>{this.state.tourist.TripType}</p>
                                            <p><b>Budget: </b> {this.state.tourist.Budget.trim()}</p>
                                            {this.state.tourist.EstimateDate ? <p><b>Estimate Date: </b>{this.state.tourist.EstimateDate}</p> : <p>From {this.state.tourist.FromDate} To {this.state.tourist.ToDate}</p>}
                                        </Col>
                                    </Row>
                                </Form>
                            </Row>
                        </ListGroupItem>
                    </ListGroup>
                </Card>
                <Card small className="profileDetails">
                    <ListGroup flush>
                        <ListGroupItem className="p-3">
                            <Row>
                                <Col>
                                    <Form className="myForm needs-validation" noValidate onSubmit={this.UpdateDetails}>
                                        <Row>
                                            <Col md="12" className="form-group hobbiesDivList">
                                                <h2>Hobbies:</h2>
                                                <div className="HobbiesDivTourist">{this.state.tourist.HobbiesNames.map(hobby => <div className="CardItem">
                                                    <img alt="" className="CardImage" rel="preload" variant="top" src={hobby.image} />
                                                    <div className="titleCardDivTourist"><h4 className="titleh">{hobby.name}</h4></div>
                                                </div>)}</div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" className="form-group ExpertisesDivList">
                                                <h2>Expertises:</h2>
                                                <div className="HobbiesDivTourist">{this.state.tourist.ExpertisesNames.map(expertise => <div className="CardItem">
                                                    <img alt="" className="CardImage" rel="preload" variant="top" src={expertise.image} />
                                                    <div className="titleCardDivTourist"><h4 className="titleh">{expertise.name}</h4></div>
                                                </div>)}</div>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Col>
                            </Row>
                        </ListGroupItem>
                    </ListGroup>
                </Card>
            </Container>

        );
    }
}

export default TouristProfile;