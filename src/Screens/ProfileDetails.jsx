import React, { Component, useState } from 'react';
import { Button, Col, Row, Form, ListGroup, Card, ListGroupItem } from 'react-bootstrap';
//import DatePicker from 'react-datepicker';
import DatePicker from 'react-date-picker'
import "react-datepicker/dist/react-datepicker.css";
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
//import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import ReactPhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import 'react-dropdown/style.css';
import '../Css/globalhome.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import '../Css/ProfileDetails.css';
import Swal from 'sweetalert2';
import Links from '../Components/Links';
//import {Card, CardHeader} from 'shards-react';
class ProfileDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            BirthDay: new Date(),
            gender: '',
            size: '',
            phone: "",
            user: "",
            local: this.props.local,
            linksfromSQL: [],
            firstNameIsValid: true,
            lastNameIsValid: true,
            licesnseIsValid: true
        };
        let local = this.state.local;
        this.apiUrl = 'http://localhost:49948/api/';
        if (!local) {
            this.apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/';
        }
    }

    componentDidMount() {
        let dateBirth = new Date(this.props.GuideDetails.BirthDay);
        this.setState({
            user: this.props.GuideDetails,
            size: this.props.GuideDetails.Gender,
            BirthDay: dateBirth,
            phone: this.props.GuideDetails.Phone,
            fulllink: this.props.GuideLinks
        })
    }
    componentDidUpdate(PrevProps, state) {
        if (PrevProps.GuideLinks !== this.props.GuideLinks) {
            this.setState({
                fulllink: this.props.GuideLinks
            })
        }
    }

    handleOnChange3 = value => {
        this.setState({ phone: value }, () => {
        });
    };
    handleChangeGender = (e) => {
        this.setState({
            gender: e.target.value,
            size: e.target.value,
            user: { ...this.state.user, Gender: e.target.value }

        });
    }

    onChangeFirstName = (e) => {
        this.setState({ 
            user: { ...this.state.user, FirstName: e.target.value },
            firstNameIsValid: e.target.validity.valid
        });
        
    }
    onChangeLastName = (e) => {
       
        this.setState({
            user: { ...this.state.user, LastName: e.target.value },
            lastNameIsValid: e.target.validity.valid
        });
       // console.log(this.state.lastNameIsValid)
   
    }
    onChangePhone = (e) => {
        this.setState({
            user: { ...this.state.user, Phone: e.target.value }
        });
    }
    onChangeLicense = (e) => {
        this.setState({
            user: { ...this.state.user, License: e.target.value },
            licesnseIsValid:e.target.validity.valid
        });
    }
    onChangeDescriptionGuide = (e) => {
        this.setState({
            user: { ...this.state.user, DescriptionGuide: e.target.value }
        });
    }



    //עדכון פרטי המשתמש והכנסתם למסד הנתונים
    UpdateDetails = (event) => {
        event.preventDefault();
        if (this.state.lastNameIsValid && this.state.firstNameIsValid && this.state.licesnseIsValid) {
            let userGuide = this.state.user;
        let BirthDay = this.state.BirthDay.toLocaleDateString('en-US');
        let phoneGuide = this.state.phone;
        fetch(this.apiUrl + 'Guide', {
            method: 'PUT',
            body: JSON.stringify({
                FirstName: userGuide.FirstName,
                LastName: userGuide.LastName,
                Email: userGuide.Email,
                Phone: this.state.phone,
                License: userGuide.License,
                Gender: userGuide.Gender,
                DescriptionGuide: userGuide.DescriptionGuide,
                BirthDay: BirthDay
            }),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
            })
        })
            .then(res => {
                console.log('res=', res);
                return res.json()
            })
            .then(
                (result) => {
                    console.log("fetch PUT= ", result);
                    this.uploadNewDetails(result);
                },
                (error) => {
                    console.log("err post=", error);
                });

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'הפרטים שלך עודכנו בהצלחה',
            showConfirmButton: false,
            timer: 1200
        });
        }
        else{
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'something is wrong!',
                text: 'please check you filled all the inputs correctly',
                showConfirmButton: false,
                timer: 2000
              });
        }
       
        
    }


    //שינוי הפרטים של המשתמש על המסך לאחר שלחץ על כפתור העידכון
    uploadNewDetails = (guideUpdate) => {
        if (this.state.linksfromSQL.length === 0) {
            console.log("del")
            fetch(this.apiUrl + 'Links/' + this.state.user.gCode, {
                method: 'DELETE',
                //body: JSON.stringify({id:7}),
                headers: new Headers({
                    'accept': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
                })
            })
                .then(res => {
                    console.log('res=', res);
                    return res.json()
                })
                .then(
                    (result) => {
                        console.log(result);
                    },
                    (error) => {
                        console.log("err post=", error);
                    });
        }
        else {
            this.postLinksToSQL(this.state.linksfromSQL);
        }
        this.renderPage(guideUpdate);
    }
    renderPage = (guideUpdate) => {
        localStorage.setItem('Guide', JSON.stringify(guideUpdate))
        this.props.history.push({
            pathname: '/',
            state: { GuideTemp: guideUpdate }
        });
    }


    postLinksToSQL = (links) => {
        fetch(this.apiUrl + 'Link/UpdateLinks', {
            method: 'PUT',
            body: JSON.stringify(links),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
            })
        })
            .then(res => {
                console.log('res=', res);
                return res.json()
            })
            .then(
                (result) => {
                    console.log("fetch PUT= ", result);
                },
                (error) => {
                    console.log("err post=", error);
                });
    }


    updateLinks = (linksList) => {
        console.log(linksList);
        this.setState({
            linksfromSQL: linksList
        })
    }
    render() {
        return (
            <Card small className="mb-4 profileDetails">
                <Card.Header className="border-bottom">
                    <h6 className="m-0">Profile Details</h6>
                </Card.Header>
                <ListGroup flush>
                    <ListGroupItem className="p-3">
                        <Row>
                            <Col>
                                <Form className="myForm needs-validation" noValidate onSubmit={this.UpdateDetails}>
                                    <Row form>
                                        <Col md="6" className="form-group">
                                            <label htmlFor="feFirstName">First Name</label>
                                            <input
                                                className="form-control"
                                                name="firstName"
                                                id="feFirstName"
                                                placeholder="First Name"
                                                validate
                                                value={this.state.user.FirstName}
                                                onChange={this.onChangeFirstName}
                                                required
                                                pattern="[A-Za-z]{2,32}"
                                                
                                            />
                                        </Col>
                                        <Col md="6" className="form-group">
                                            <label htmlFor="feLastName">Last Name</label>
                                            <input
                                                className="form-control"
                                                name="lastName"
                                                id="feLastName"
                                                placeholder="Last Name"
                                                value={this.state.user.LastName}
                                                onChange={this.onChangeLastName}
                                                pattern="[A-Za-z]{2,32}"
                                                validate
                                                required
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="6" className="form-group">
                                            <label htmlFor="feEmail">Email</label>
                                            <input
                                                className="form-control"
                                                name="email"
                                                id="feEmail"
                                                placeholder="Email Address"
                                                value={this.state.user.Email}
                                                validate
                                                required
                                                readOnly
                                            />
                                        </Col>
                                        <Col md="6" className="form-group">
                                            <label htmlFor="feLicense">License Number</label>
                                            <input
                                                className="form-control"
                                                id="feLicense"
                                                name="licenseNumber"
                                                placeholder="License Number"
                                                value={this.state.user.License}
                                                onChange={this.onChangeLicense}
                                                validate
                                                pattern={"[0-9]{2,32}"}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="6" className="form-group">
                                            <label htmlFor="feBirth">Birthday</label><br />

                                            <DatePicker
                                                selected={this.state.BirthDay}
                                                value={this.state.BirthDay}
                                                onChange={(newDate) => this.setState({ BirthDay: newDate })}
                                                name="birthDate"
                                                dateFormat="dd/MM/yyyy"
                                            />

                                        </Col>
                                        <Col md="6" className="form-group">
                                            <label htmlFor="feGender">Gender</label>
                                            <br />
                                            <Radio
                                                checked={this.state.size === "female"}
                                                onChange={this.handleChangeGender}
                                                value="female"
                                                name="radio-button-demo"
                                                color="default"
                                            />
                                            <label>Female</label>
                                            <Radio
                                                checked={this.state.size === "male"}
                                                onChange={this.handleChangeGender}
                                                value="male"
                                                name="radio-button-demo"
                                                color="default"
                                            />
                                            <label>Male</label>



                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="6" className="form-group">
                                            <label htmlFor="fephone">Phone</label>
                                            <ReactPhoneInput
                                                inputExtraProps={{
                                                    name: "phone",
                                                    required: true,
                                                    autoFocus: true
                                                }}
                                                country={'il'}
                                                value={this.state.phone}
                                                onChange={this.handleOnChange3}
                                            />
                                        </Col>
                                    </Row>
                                    <Links linksFromSQL={this.state.linksfromSQL} Guide={this.state.user} updateLinks={this.updateLinks} GuideLinks={this.props.GuideLinks} />
                                    <Row>
                                        <Col>
                                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                                <Form.Label>Short Description</Form.Label>
                                                <Form.Control as="textarea" rows="3"
                                                    value={this.state.user.DescriptionGuide}
                                                    onChange={this.onChangeDescriptionGuide}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Button variant="primary" type="submit" >Update Your Account</Button>
                                        </Col>

                                    </Row>
                                </Form>
                            </Col>
                        </Row>
                    </ListGroupItem>
                </ListGroup>

            </Card>
        );
    }
}

export default withRouter(ProfileDetails);