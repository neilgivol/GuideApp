import React, { Component } from "react";
import {
    Button,
    Col,
    Row,
    Form,
    ListGroup,
    Card,
    ListGroupItem,
    Container
} from "react-bootstrap";
import "shards-ui/dist/css/shards.min.css";
import "../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import "../Profile/Css/ProfileDetails.css";
import "../Profile/Css/Home.css";
import pic from "../Img/Default-welcomer.png";
import "../Css/TouristProfile.css";
import '../Profile/Css/Hobbies.css';
class TouristProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tourist: this.props.tourist,
            pic: ""
        };
        this.pic = 'http://proj.ruppin.ac.il/bgroup10/PROD/Images/Default-welcomer.png';

    }
    componentDidMount() {
        console.log(this.props.tourist);
        if (this.props.tourist.ProfilePic == "" || this.props.tourist.ProfilePic == null) {
            this.setState({
                pic: this.pic
            })

        }
        else {
            this.setState({
                pic: this.props.tourist.ProfilePic
            })
        }
    }
    render() {
        return (
            // <Container fluid id={this.props.navbarOpenCheck} className="HomePageContainer tourContainer" >
            <div className="divProfileTourist">
                <Card small className="profileDetails1">
                    <Card.Header className="NameToruistDiv">
                        <h2 id="nameTourist">
                            {this.state.tourist.FirstName}{" "}
                            {this.state.tourist.LastName}
                        </h2>
                        <div className='delProfileTourist' onClick={() => this.props.ExitProfile('close')}>
                            <span className='delSpanTour'><i class="fas fa-times"></i></span>
                        </div>
                    </Card.Header>
                    <ListGroup flush>
                        <ListGroupItem className="p-3">
                            <Row>
                                <Form className="myForm">
                                    <Row form>
                                        <Col
                                            md="3"
                                            className="form-group colImgDiv">
                                            {this.state.tourist.ProfilePic ? (
                                                <Card.Img
                                                    className="TouristImg"
                                                    src={
                                                        this.state.pic

                                                    }
                                                />
                                            ) : (
                                                    <Card.Img
                                                        className="TouristImg"
                                                        src={pic}
                                                    />
                                                )}
                                        </Col>
                                        <Col
                                            md="4"
                                            sm="5"
                                            xs="5"

                                            className="form-group personalDetails">
                                            <p>
                                                <b>Email:</b>{" "}
                                                {this.state.tourist.Email}{" "}
                                            </p>
                                            <p>
                                                <b>Gender:</b>{" "}
                                                {this.state.tourist.Gender}{" "}
                                            </p>
                                            <p>
                                                <b>BirthDay:</b>{" "}
                                                {this.state.tourist.YearOfBirth}{" "}
                                            </p>
                                            <p>
                                                <b>Language:</b>{" "}
                                                {this.state.tourist.Language}{" "}
                                            </p>
                                        </Col>
                                        <Col
                                            md="5"
                                            sm="5"
                                            xs="5"
                                            className="form-group tripDetails">
                                            {this.state.tourist
                                                .FirstTimeInIsrael ? (
                                                    <p>
                                                        <b>
                                                            First Time In Israel?:{" "}
                                                        </b>{" "}
                                                    yes
                                                    </p>
                                                ) : (
                                                    <p>
                                                        <b>
                                                            First Time In Israel?:{" "}
                                                        </b>{" "}
                                                    no{" "}
                                                    </p>
                                                )}
                                            <p>
                                                <b>Trip Type: </b>
                                                {this.state.tourist.TripType}
                                            </p>
                                            <p>
                                                <b>Budget: </b>{" "}
                                                {this.state.tourist.Budget.trim()}
                                            </p>
                                            {this.state.tourist.EstimateDate ? (
                                                <p>
                                                    <b>Estimate Date: </b>
                                                    {
                                                        this.state.tourist
                                                            .EstimateDate
                                                    }
                                                </p>
                                            ) : (
                                                    <p>
                                                        From{" "}
                                                        {
                                                            this.state.tourist
                                                                .FromDate
                                                        }{" "}
                                                    To{" "}
                                                        {this.state.tourist.ToDate}
                                                    </p>
                                                )}
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
                                        <Row>
                                            <div
                                                className="form-group hobbiesDivList">
                                                <h2>Hobbies:</h2>
                                                <div className="HobbiesDivTourist">
                                                    {this.state.tourist.HobbiesNames.map(
                                                        (hobby) => (
                                                            <div className="CardItem">
                                                                <img
                                                                    alt=""
                                                                    className="CardImage"
                                                                    rel="preload"
                                                                    variant="top"
                                                                    src={
                                                                        hobby.image
                                                                    }
                                                                />
                                                                <div className="titleCardDivTourist">
                                                                    <h4 className="titleh">
                                                                        {
                                                                            hobby.name
                                                                        }
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </Row>
                                        <Row>
                                        <div   className="form-group hobbiesDivList">
                                                <h2>Expertises:</h2>
                                                <div className="HobbiesDivTourist">
                                                    {this.state.tourist.ExpertisesNames.map(
                                                        (expertise) => (
                                                            <div className="CardItem">
                                                                <img
                                                                    alt=""
                                                                    className="CardImage"
                                                                    rel="preload"
                                                                    variant="top"
                                                                    src={
                                                                        expertise.image
                                                                    }
                                                                />
                                                                <div className="titleCardDivTourist">
                                                                    <h4 className="titleh">
                                                                        {
                                                                            expertise.name
                                                                        }
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                                </div>
                                        </Row>
                                </Col>
                            </Row>
                        </ListGroupItem>
                    </ListGroup>
                </Card>
            </div>
            // </Container>
        );
    }
}

export default TouristProfile;
