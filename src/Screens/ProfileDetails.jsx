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
import { Dropdown } from 'semantic-ui-react';
import '../Css/ProfileDetails.css';
const FacebookUser = JSON.parse(localStorage.getItem('FacebookUser'));
const GoogleUser = JSON.parse(localStorage.getItem('GoogleUser'));
const SignUpUser = JSON.parse(localStorage.getItem('SignUpUser'));
const friendOptions = [
    {
        key: 'Instegram',
        text: 'Instegram',
        value: 'Instegram',
        image: { avatar: true, src: 'src\Img\The_Instagram_Logo.jpg' },
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
            phone: "",
            user : {
                FirstName:"",
                LastName:"",
                Phone:"",
                License:"",
                Email:"",
                Gender:""
            },
            allUsers:this.props.Allusers
        };
        this.handleChange = this.handleChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        let local = true;
        this.apiUrl = 'http://localhost:49948/api/Guide';
        if (!local) {
          this.apiUrl = '';
        }
    }
    componentWillMount(){
       fetch(this.apiUrl, {
                method: 'GET',
                headers: new Headers({
                  'Content-Type': 'application/json; charset=UTF-8',
                })
              })
                .then(res => {
                  return res.json()
                })
                .then(
                  (result) => {
                    this.setState({allUsers:result})
                  
                  },
                  (error) => {
                    console.log("err post=", error);
                  });

    }
    componentDidMount(){
      
        let logginUser = "";
        for (let i = 0; i < this.state.allUsers.length; i++) {
            const element = this.state.allUsers[i];
            if (element.Email === this.props.email) {
                logginUser = element;
            }
        }
        this.setState({
            user:logginUser,
            size:logginUser.Gender
           // phone:logginUser.Phone
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
            user:{...this.state.user,Gender:e.target.value}

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

    onChangeFirstName=(e)=>{
        this.setState({
            user:{...this.state.user,FirstName:e.target.value}
        });
    }
    onChangeLastName=(e)=>{
        this.setState({
            user:{...this.state.user,LastName:e.target.value}
        });
    }
        onChangePhone=(e)=>{
            this.setState({
                user:{...this.state.user,Phone:e.target.value}
            });
        }
            onChangeLicense=(e)=>{
                this.setState({
                    user:{...this.state.user,License:e.target.value}
                });
            }
                onChangeLastName=(e)=>{
                    this.setState({
                        user:{...this.state.user,LastName:e.target.value}
                    });
    }
    UpdateDetails=()=>{
        console.log(this.state.phone);
        let userGuide = this.state.user;
        fetch(this.apiUrl, {
          method: 'PUT',
          body: JSON.stringify({
            FirstName:userGuide.FirstName,
            LastName:userGuide.LastName,
            Email:userGuide.Email,
            Phone:this.state.phone,
            License:userGuide.License,
            Gender:userGuide.Gender
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
              console.log(result);
            },
            (error) => {
              console.log("err post=", error);
            });

            alert("Success");
            this.setState({
                user:userGuide
            })
            //       window.location.reload(false);
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
                                            selected={this.state.startDate}
                                            onChange={this.handleChange}
                                            name="startDate"
                                            dateFormat="MM/dd/yyyy"
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
                                        <Dropdown
                                            placeholder='Select links'
                                            fluid
                                            selection
                                            options={friendOptions}
                                        />
                                    </div>
                                    <div className="col-lg-9 chooseLink">
                                        <input
                                            id="feFirstName"
                                            placeholder="First Name"
                                            value="Aviel"
                                            onChange={() => { }}
                                        />
                                    </div>
                                </div>
                                <div>
                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Short Description</Form.Label>
                                    <Form.Control as="textarea" rows="3" />
                                </Form.Group>
                                </div>
                                <div>
                                    <Button onClick={() => {this.UpdateDetails();this.props.GetGuidesFromSQL();}}>Save</Button>
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