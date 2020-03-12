import React, { Component, useState } from 'react';
import { Card, ListGroup, ListGroupItem, Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Radio from '@material-ui/core/Radio';
import ReactPhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'
import { Dropdown } from 'semantic-ui-react'
const friendOptions = [
    {
        key: 'Instegram',
        text: 'Instegram',
        value: 'Instegram',
        image: { avatar: true, src: '/images/avatar/small/jenny.jpg' },
    },
    {
        key: 'Facebook',
        text: 'Facebook',
        value: 'Facebook',
        image: { avatar: true, src: '/images/avatar/small/elliot.jpg' },
    },
    {
        key: 'Twitter',
        text: 'Twitter',
        value: 'Twitter',
        image: { avatar: true, src: '/images/avatar/small/stevie.jpg' },
    },
    {
        key: 'Website',
        text: 'Website',
        value: 'Website',
        image: { avatar: true, src: '/images/avatar/small/christian.jpg' },
    },
]

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
            startDate: new Date(),
            gender: '',
            size: '',
            phone: ""

        };
        this.handleChange = this.handleChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }
    handleOnChange3 = value => {
        console.log(value);
        this.setState({ phone: value }, () => {
            console.log(this.state.phone);
        });
    };
    handleChange2 = (e) => {
        this.setState({
            gender: e.target.value,
            size: e.target.value
        });
    }
    handleChange(date) {
        this.setState({
            startDate: date
        })
    }


    onFormSubmit(e) {
        e.preventDefault();
        console.log(this.state.startDate)
    }
    render() {
        return (
            <div className="col-lg-8">
                <Card small className="mb-4">
                    <Card.Header className="border-bottom">
                        <h6 className="m-0">Profile Details</h6>
                    </Card.Header>
                    <ListGroup flush>
                        <ListGroupItem className="p-3">
                            <Form>
                                <div className="row labelInputs">
                                    <div className="col-lg-6 form-group"><label htmlFor="feFirstName">First Name</label><br />
                                        <input
                                            id="feFirstName"
                                            placeholder="First Name"
                                            value="Aviel"
                                            onChange={() => { }}
                                        />
                                    </div>
                                    <div className="col-lg-6 form-group" ><label htmlFor="feLastName">Last Name</label><br />
                                        <input
                                            id="feLastName"
                                            placeholder="Last Name"
                                            value="Palgi"
                                            onChange={() => { }}
                                        />
                                    </div>
                                </div>
                                <div className="row labelInputs">
                                    <div className="col-lg-6 form-group"><label htmlFor="feEmail">Email</label><br />
                                        <input
                                            id="feEmail"
                                            placeholder="Email"
                                            value="avielpalgi@gmail.com"
                                            onChange={() => { }}
                                        />
                                    </div>
                                    <div className="col-lg-6 form-group" ><label htmlFor="feLicense">License Number</label><br />
                                        <input
                                            id="feLicense"
                                            placeholder="License Number"
                                            value="123456789"
                                            onChange={() => { }}
                                        />
                                    </div>
                                </div>
                                <div className="row labelInputs">
                                    <div className="col-lg-6 form-group"><label htmlFor="feBirth">Birthday</label><br />
                                        <DatePicker
                                            selected={this.state.startDate}
                                            onChange={this.handleChange}
                                            name="startDate"
                                            dateFormat="MM/dd/yyyy"
                                        />
                                    </div>
                                    <div className="col-lg-6 form-group" ><label htmlFor="feGender">Gender</label><br />
                                        <Radio
                                            checked={this.state.size === "female"}
                                            onChange={this.handleChange2}
                                            value="female"
                                            name="radio-button-demo"
                                            color="default"
                                        />
                                        <label>Female</label>
                                        <Radio
                                            checked={this.state.size === "male"}
                                            onChange={this.handleChange2}
                                            value="male"
                                            name="radio-button-demo"
                                            color="default"
                                        />
                                        <label>Male</label>
                                    </div>
                                </div>
                                <div className="row labelInputs">
                                    <div className="col-lg-6 form-group"><label htmlFor="fephone">Phone </label><br />
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
                                        <Dropdown
                                            placeholder='Select Friend'
                                            fluid
                                            selection
                                            options={friendOptions}
                                        />
                                    </div>
                                    <div className="col-lg-9">
                                    <input
                                            id="feFirstName"
                                            placeholder="First Name"
                                            value="Aviel"
                                            onChange={() => { }}
                                        />
                                    </div>
                                    </div>
                            </Form>
                        </ListGroupItem>
                    </ListGroup>
                </Card>
            </div>
        );
    }
}

export default ProfileDetails;