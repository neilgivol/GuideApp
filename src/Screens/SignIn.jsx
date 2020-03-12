import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBIcon, MDBModalFooter } from 'mdbreact';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import '../Css/SignIn.css';
import logo from '../Img/logo.png';
import Facebook from "../Components/Facebook.js";
import { Link, Redirect, withRouter } from 'react-router-dom';
import Google from '../Components/Google';


class SignIn extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: "",
            users: props.Allusers,
            faceLogin: [],
        }
    }
    componentWillMount() {
        console.log(this.state.users)
    }
    HandelEmailInput = (e) => {
        this.setState({
            email: e.target.value
        }
        )
    }

    HandelPasswordInput = (e) => {
        this.setState({
            password: e.target.value
        }
        )
    }

    UserExists = () => {
        const tempUsers = this.state.users;
        let ifExist = false;
        console.log(tempUsers);
        for (let i = 0; i < tempUsers.length; i++) {
            const element = tempUsers[i];
            console.log(element)
            if (element.Email == this.state.email && element.PasswordGuide == this.state.password) {
                ifExist = true;
            }

        }
        if (ifExist) {
            this.props.history.push({
                pathname: '/home',
            });
        }
        else {
            alert("Email or Password is wrong")
        }
    }


    render() {
        return (
            <MDBContainer>
                <MDBRow className="RowDivSignIn">
                    <MDBCol md="6" className="LogoDiv"><img src={logo} /></MDBCol>
                    <MDBCol className="ColDivSignIn" md="6">
                        <MDBCard className="CardDivSignIn">
                            <MDBCardBody className="mx-4">
                                <div className="text-center">
                                    <h3 className="dark-grey-text mb-5">
                                        <strong>Sign in</strong>
                                    </h3>
                                </div>
                                <MDBInput
                                    label="Your email"
                                    group
                                    type="email"
                                    validate
                                    error="wrong"
                                    success="right"
                                    onChange={this.HandelEmailInput}
                                />
                                <MDBInput
                                    label="Your password"
                                    group
                                    type="password"
                                    validate
                                    containerClass="mb-0"
                                    onChange={this.HandelPasswordInput}

                                />
                                <div className="mb-3">
                               
                               
                                <MDBCol md="6" className="forgot">
                                <a href="#!" className="blue-text ml-1"><p className="font-small blue-text d-flex justify-content-end pb-3">Forgot Password?</p></a>
                                </MDBCol>

                               
                                </div>
                               
                                <div className="text-center mb-3">
                                    <MDBBtn
                                        type="button"
                                        gradient="blue"
                                        rounded
                                        className="btn-block z-depth-1a"
                                        onClick={this.UserExists}
                                    >
                                        Sign in
                </MDBBtn>
                                </div>
                                <div>
                                    <div className="or-seperator"><i>or</i></div>

                                </div>

                                <div className="text-center mb-3">
                                    <Facebook faceLogin={this.state.faceLogin} PostGuideToSQLFromFacebook={this.props.PostGuideToSQLFromFacebook} />
                                    <Google PostGuideToSQLFromGoogle={this.props.PostGuideToSQLFromGoogle} />

                                </div>


                            </MDBCardBody>
                            <MDBModalFooter className="mx-5 pt-3 mb-1">
                                <p className="font-small grey-text d-flex justify-content-end">
                                    Not a member?
                                <Link to="/SignUp">SignUp</Link>
                                </p>
                            </MDBModalFooter>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        );
    }
}

export default withRouter(SignIn);

