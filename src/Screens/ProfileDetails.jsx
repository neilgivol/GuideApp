import React, { Component, useState } from 'react';
import { Card, ListGroup, ListGroupItem, Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Radio from '@material-ui/core/Radio';
import ReactPhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import '../Css/ProfileDetails.css';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';


const GreenRadio = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})(props => <Radio color="default" {...props} />);



class ProfileDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            BirthDay: new Date(),
            gender: '',
            size: '',
            phone: "",
            linkURL: "",
            linkType: "",
            user: {
                FirstName: "",
                LastName: "",
                Phone: "",
                License: "",
                Email: "",
                Gender: "",
                DescriptionGuide: ""
            },
            //allUsers: this.props.Allusers,
            options: [
                {
                    name: 'Select…',
                    value: null,
                },
                {
                    name: 'Instegram',
                    value: 'Instegram',
                },
                {
                    name: 'Facebook',
                    value: 'Facebook',
                },
                {
                    name: 'Twitter',
                    value: 'Twitter',
                },
                {
                    name: 'Linkdin',
                    value: 'Linkdin',
                },
                {
                    name: 'Website',
                    value: 'Website',
                },
            ],
        };
        let local = true;
        this.apiUrl = 'http://localhost:49948/api/Guide';
        if (!local) {
            this.apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Guide';
        }
    }

    componentDidMount() {
        let dateBirth = new Date(this.props.GuideDetails.BirthDay);
        this.setState({
            user: this.props.GuideDetails,
            size: this.props.GuideDetails.Gender,
            BirthDay: dateBirth,
            phone: this.props.GuideDetails.Phone
        })

    }
    handleOnChange3 = value => {
        console.log(value);
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

    // onFormSubmit(e) {
    //     e.preventDefault();
    //     console.log(this.state.startDate)
    // }

    onChangeFirstName = (e) => {
        this.setState({
            user: { ...this.state.user, FirstName: e.target.value }
        });
    }
    onChangeLastName = (e) => {
        this.setState({
            user: { ...this.state.user, LastName: e.target.value }
        });
    }
    onChangePhone = (e) => {
        this.setState({
            user: { ...this.state.user, Phone: e.target.value }
        });
    }
    onChangeLicense = (e) => {
        this.setState({
            user: { ...this.state.user, License: e.target.value }
        });
    }
    onChangeDescriptionGuide = (e) => {
        this.setState({
            user: { ...this.state.user, DescriptionGuide: e.target.value }
        });
    }
    handleChangeListType = (event) => {
        this.setState({ linkType: event.target.value });
        console.log(this.state.value)
    }
    UpdateDetails = () => {
        console.log(this.state.phone);
        let userGuide = this.state.user;
        let BirthDay = this.state.BirthDay.toLocaleDateString('en-US');
        let phoneGuide = this.state.phone;
        //let startDate =  Date.parse(startDate);
        console.log(phoneGuide);
        fetch(this.apiUrl, {
            method: 'PUT',
            body: JSON.stringify({
                FirstName: userGuide.FirstName,
                LastName: userGuide.LastName,
                Email: userGuide.Email,
                Phone: this.state.phone,
                License: userGuide.License,
                Gender: userGuide.Gender,
                DescriptionGuide: userGuide.DescriptionGuide,
                BirthDay: BirthDay,
                Phone: phoneGuide
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

        alert("Success");
    }
    Addlinks = () => {
        // const fullLinkList = [];
        // let type = this.state.linkType;
        // let urlLink = this.state.linkURL;
        // let link = type + " - " + urlLink; 
        // fullLinkList.push(link);
        console.log("fullLinkList");
    }
    handleOnChangeTypeList = (e) => {
        this.setState({
            linkType: e.target.value
        })
        console.log(this.state.linkType);

    }
    handleChangeLinkUrl = (e) => {
        this.setState({
            linkURL: e.target.value
        })
        console.log(this.state.linkURL);

    }

    uploadNewDetails = (guideUpdate) => {
        console.log(guideUpdate);
        if (guideUpdate !== null) {
            let dateBirth = new Date(guideUpdate.BirthDay);
            this.setState({
                user: guideUpdate,
                size: guideUpdate.Gender,
                //BirthDay: dateBirth,
                phone: guideUpdate.Phone
            })
            this.forceUpdate()
            localStorage.setItem('Guide', JSON.stringify(this.state.user))
        }

    }
    render() {
        return (
            <Card small className="mb-4">
                <Card.Header className="border-bottom">
                    <h6 className="m-0">Profile Details</h6>
                </Card.Header>
                <ListGroup flush>
                    <ListGroupItem className="p-3">
                        <Form>
                            <div className="row labelInputs">
                                <div className="col-lg-6 col-sm-12 form-group"><label htmlFor="feFirstName">First Name</label><br />
                                    <input
                                        id="feFirstName"
                                        placeholder="First Name"
                                        value={this.state.user.FirstName}
                                        onChange={this.onChangeFirstName}
                                    />
                                </div>
                                <div className="col-lg-6 col-sm-12 form-group" ><label htmlFor="feLastName">Last Name</label><br />
                                    <input
                                        id="feLastName"
                                        placeholder="Last Name"
                                        value={this.state.user.LastName}
                                        onChange={this.onChangeLastName}
                                    />
                                </div>
                            </div>
                            <div className="row labelInputs">
                                <div className="col-lg-6 col-sm-12 form-group"><label htmlFor="feEmail">Email</label><br />
                                    <input
                                        id="feEmail"
                                        placeholder="Email"
                                        value={this.state.user.Email}
                                    //onChange={() => { }}
                                    />
                                </div>
                                <div className="col-lg-6 col-sm-12 form-group" ><label htmlFor="feLicense">License Number</label><br />
                                    <input
                                        id="feLicense"
                                        placeholder="License Number"
                                        value={this.state.user.License}
                                        onChange={this.onChangeLicense}
                                    />
                                </div>
                            </div>
                            <div className="row labelInputs">
                                <div className="col-lg-6  col-sm-12form-group"><label htmlFor="feBirth">Birthday</label><br />
                                    <DatePicker
                                        selected={this.state.BirthDay}
                                        onChange={(newDate) => this.setState({ BirthDay: newDate })}
                                        name="birthDate"
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </div>
                                <div className="col-lg-6 col-sm-12 form-group" ><label htmlFor="feGender">Gender</label><br />
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
                                </div>
                            </div>
                            <div className="row labelInputs">
                                <div className="col-lg-6 col-sm-12 form-group"><label htmlFor="fephone">Phone </label><br />
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
                                </div>

                            </div>
                            <div className="row labelInputs">
                                <div className="col-lg-12 form-group">
                                    <label htmlFor="feLinks">Link Type</label><br />
                                </div>
                            </div>
                            <div className="row labelInputs">
                                <div className="col-lg-3">
                                    <select id="listLinks" onChange={this.handleChangeListType} value={this.state.linkType}>
                                        {this.state.options.map(item => (
                                            <option key={item.value} value={item.value}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>

                                </div>
                                <div className="col-lg-7 chooseLink">
                                    <input
                                        id="feFirstName"
                                        placeholder="First Name"
                                        value={this.state.linkURL}
                                        onChange={this.handleChangeLinkUrl}
                                    />
                                </div>
                                <div className="col-lg-2 Addlinks">
                                    <Button onClick={() => { this.Addlinks() }}>+</Button>
                                </div>
                                <div className="LinkList col-12">

                                </div>
                            </div>
                            <div>
                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Short Description</Form.Label>
                                    <Form.Control as="textarea" rows="3"
                                        value={this.state.user.DescriptionGuide}
                                        onChange={this.onChangeDescriptionGuide}
                                    />
                                </Form.Group>
                            </div>
                            <div>
                                <Button onClick={() => { this.UpdateDetails(); }}>Save</Button>
                            </div>

                        </Form>
                    </ListGroupItem>
                </ListGroup>
            </Card>
        );
    }
}

export default ProfileDetails;