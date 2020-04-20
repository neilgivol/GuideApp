import React, { Component, useState } from 'react';
import { Button, Col, Row, Form, ListGroup, Card, ListGroupItem } from 'react-bootstrap';
//import DatePicker from 'react-datepicker';
import DatePicker from 'react-date-picker'
import "react-datepicker/dist/react-datepicker.css";
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
//import { withStyles } from '@material-ui/core/styles';
//import { green } from '@material-ui/core/colors';
import Radio from '@material-ui/core/Radio';
import ReactPhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import 'react-dropdown/style.css';
import '../Css/globalhome.css';
import Select from 'react-select';
import facebook from '../Img/facebook.png';
import twitter from '../Img/twitter.png';
import website from '../Img/website.png';
import linkdin from '../Img/linkedin.png';
import instegram from '../Img/The_Instagram_Logo.jpg';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import '../Css/ProfileDetails.css';
import Swal from 'sweetalert2';
//import {Card, CardHeader} from 'shards-react';
class ProfileDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            BirthDay: new Date(),
            gender: '',
            size: '',
            phone: "",
            linkURL: "",
            fulllink: [],
            user: {
                FirstName: "",
                LastName: "",
                Phone: "",
                License: "",
                Email: "",
                Gender: "",
                DescriptionGuide: ""
            },
            options: [
                {
                    id: 0,
                    name: 'Select…',
                    value: null,
                    label: null
                },
                {
                    id: 1,
                    name: 'Instagram',
                    value: 'Instagram',
                    label: <div><img className="imageicons" src={instegram} /><span>Instagram</span></div>
                },
                {
                    id: 2,
                    name: 'Facebook',
                    value: 'Facebook',
                    label: <div><img className="imageicons" src={facebook} /><span>Facebook</span></div>
                },
                {
                    id: 3,
                    name: 'Twitter',
                    value: 'Twitter',
                    label: <div><img className="imageicons" src={twitter} /><span>Twitter</span></div>
                },
                {
                    id: 4,
                    name: 'Linkdin',
                    value: 'Linkdin',
                    label: <div><img className="imageicons" src={linkdin} /><span>Linkdin</span></div>
                },
                {
                    id: 5,
                    name: 'Website',
                    value: 'Website',
                    label: <div><img className="imageicons" src={website} /><span>Website</span></div>
                },
            ],
            selectedOption: null,
            linksfromSQL: [],
            local:this.props.local
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
    handleChangeList = (selectedOption) => {
        this.setState({ selectedOption });
    }
    handleChangeLinkUrl = (e) => {
        this.setState({
            linkURL: e.target.value
        })
    }

    //עדכון פרטי המשתמש והכנסתם למסד הנתונים
    UpdateDetails = () => {
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
    //הוספת לינקים
    Addlinks = () => {
        const fullLinkList = [];
        const linksToSQL = [];
        for (let i = 0; i < this.state.fulllink.length; i++) {
            const element = this.state.fulllink[i];
            fullLinkList.push(element);
        }
        let type = this.state.selectedOption;
        let urlLink = this.state.linkURL;
        let temppp = type.value + ' - ' + urlLink;
        fullLinkList.push(temppp);
        this.setState({
            fulllink: fullLinkList
        })
        console.log(this.state.fulllink);

        let link = {
            LinksCategoryLCode: type.id,
            linkPath: urlLink,
            guidegCode: this.state.user.gCode
        }
        for (let i = 0; i < this.state.linksfromSQL.length; i++) {
            const element = this.state.linksfromSQL[i];
            linksToSQL.push(element);
        }
        linksToSQL.push(link);
        this.setState({
            linksfromSQL: linksToSQL
        })
    }

    //שינוי הפרטים של המשתמש על המסך לאחר שלחץ על כפתור העידכון
    uploadNewDetails = (guideUpdate) => {
        this.renderPage(guideUpdate);
        // if (guideUpdate !== null) {
        //     let dateBirth = new Date(guideUpdate.BirthDay);
        //     this.setState({
        //         user: guideUpdate,
        //         size: guideUpdate.Gender,
        //         phone: guideUpdate.Phone,
        //         License:guideUpdate.License
        //     })
        //     localStorage.setItem('Guide', JSON.stringify(this.state.user))
        // }
        // let codetype = "";
        // let Link = "";
        // const arraylinks = [];
        // for (let i = 0; i < this.state.fulllink.length; i++) {
        //     const element = this.state.fulllink[i];
        //     let t = element.split(" - ");
        //     let namelink = t[0];
        //     for (let j = 0; j < this.state.options.length; j++) {
        //         const element2 = this.state.options[j];
        //         if (element2.value == namelink) {
        //             Link = {
        //                 guidegCode: this.state.user.gCode,
        //                 linkPath: t[1],
        //                 LinksCategoryLCode: element2.id
        //             }
        //             arraylinks.push(Link);
        //         }
        //     }
        // }
        // console.log(arraylinks);
        
        // if (arraylinks.length === 0) {
        //     console.log("del")
        //     fetch(this.apiUrl + 'Links/' + this.state.user.gCode, {
        //         method: 'DELETE',
        //         //body: JSON.stringify({id:7}),
        //         headers: new Headers({
        //             'accept': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
        //         })
        //     })
        //         .then(res => {
        //             console.log('res=', res);
        //             return res.json()
        //         })
        //         .then(
        //             (result) => {
        //                 this.uploadLinks(result);
        //             },
        //             (error) => {
        //                 console.log("err post=", error);
        //             });
        // }
        // else {
        //     this.postLinksToSQL(arraylinks);
        // }
      
    }
    renderPage=(guideUpdate)=>{
        localStorage.setItem('Guide', JSON.stringify(guideUpdate))
        this.props.history.push({
            pathname: '/',
            state: { GuideTemp: guideUpdate }
        });
    }
    //לינקים
    funarray = () => {
        return this.state.fulllink ? null : this.state.fulllink.map(item => <div>{item}</div>)
    }
    delUrl = (e) => {
        let temparray = [];
        for (let i = 0; i < this.state.fulllink.length; i++) {
            const element = this.state.fulllink[i];
            if (element !== e) {
                temparray.push(element);
            }
        }
        this.setState({
            fulllink: temparray
        })
    }
    uploadLinks = (links) => {
        let templink = "";
        let temparraylinks = [];
        for (let j = 0; j < links.length; j++) {
            const link = links[j].LinksCategoryLCode;
            for (let i = 0; i < this.state.options.length; i++) {
                const element = this.state.options[i];
                if (element.id == link) {
                    temparraylinks.push(element.value + " - " + links[j].linkPath)
                }
            }
        }
        this.setState({
            fulllink: temparraylinks
        })
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
                    this.uploadLinks(result);
                },
                (error) => {
                    console.log("err post=", error);
                });
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
                                <Form className="myForm">
                                    <Row form>
                                        <Col md="6" className="form-group">
                                            <label htmlFor="feFirstName">First Name</label>
                                            <input
                                                className="form-control"
                                                id="feFirstName"
                                                placeholder="First Name"
                                                value={this.state.user.FirstName}
                                                onChange={this.onChangeFirstName}
                                            />
                                        </Col>
                                        <Col md="6" className="form-group">
                                            <label htmlFor="feLastName">Last Name</label>
                                            <input
                                                className="form-control"
                                                id="feLastName"
                                                placeholder="Last Name"
                                                value={this.state.user.LastName}
                                                onChange={this.onChangeLastName}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="6" className="form-group">
                                            <label htmlFor="feEmail">Email</label>
                                            <input
                                                className="form-control"
                                                id="feEmail"
                                                placeholder="Email Address"
                                                value={this.state.user.Email}
                                            />
                                        </Col>
                                        <Col md="6" className="form-group">
                                            <label htmlFor="feLicense">License Number</label>
                                            <input
                                            className="form-control"
                                                id="feLicense"
                                                placeholder="License Number"
                                                value={this.state.user.License}
                                                onChange={this.onChangeLicense}
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
                                    {/* <Row>
                                        <Col md="6" className="form-group">
                                            <label htmlFor="feLinks">Link Type</label><br />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="3" className="form-group">
                                            <Select
                                                values={this.state.selectedOption}
                                                onChange={this.handleChangeList}
                                                options={this.state.options} >
                                            </Select>
                                        </Col>
                                        <Col md="7" className="form-group chooseLink">
                                            <input
                                                id="feInsertYourLink"
                                                placeholder="Insert Your Link"
                                                value={this.state.linkURL}
                                                onChange={this.handleChangeLinkUrl}
                                            />
                                        </Col>
                                        <Col md="2" className="form-group Addlinks">
                                            <Button onClick={() => { this.Addlinks() }}>+</Button>
                                        </Col>
                                        <Col md="12" className="form-group LinkList">
                                            <ul>
                                                {this.state.fulllink.map(item => <li onClick={() => { this.delUrl(item) }} value={item} className="urlAndType">{item} <i value={item} class="fas fa-backspace" ></i></li>)}
                                            </ul>
                                        </Col>

                                    </Row> */}
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
                                            <Button variant="primary" onClick={() => { this.UpdateDetails(); }}>Update Your Account</Button>


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