import React, { Component, useState, useEffect } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBIcon, MDBModalFooter } from 'mdbreact';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import '../Css/SignIn.css';
import logo from '../Img/logo.png';
import Facebook from "../Components/Facebook.js";
import { Link, withRouter } from 'react-router-dom';
import Google from '../Components/Google';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Swal from 'sweetalert2'

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="#">
                IsraVisor
        </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}
class SignIn extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: "",
            checkBoxVal: "unCheck",
            rememberMe: false
        }
    }

    componentDidMount() {
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        const usernameEntered = rememberMe ? localStorage.getItem('usernameEntered') : '';
        const PasswordEntered = rememberMe ? localStorage.getItem('PasswordEntered') : '';
        this.setState({
            email: usernameEntered,
            password: PasswordEntered,
            rememberMe: rememberMe
        });
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
    RememberMe = () => {
        if (!this.state.rememberMe) {
            this.setState({ rememberMe: true });
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'מעתה פרטי המשתמש ישמרו לכניסות הבאות',
                showConfirmButton: false,
                timer: 1200
            })
        }
        else {
            this.setState({ rememberMe: false });
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'מעתה פרטי המשתמש אינם ישמרו לכניסות הבאות',
                showConfirmButton: false,
                timer: 1200
            })
        }
    }

    SignInFunc = () => {
        localStorage.setItem('rememberMe', this.state.rememberMe);
        localStorage.setItem('usernameEntered', this.state.rememberMe ? this.state.email : '');
        localStorage.setItem('PasswordEntered', this.state.rememberMe ? this.state.password : '');
        let signInUser = {
            Email: this.state.email,
            Password: this.state.password
        }
        this.props.checkSignIn(signInUser);
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
                                <div className="text-center mb-3">
                                    <MDBInput
                                        label="Your email"
                                        value={this.state.email}
                                        group
                                        type="email"
                                        validate
                                        error="wrong"
                                        success="right"
                                        onChange={this.HandelEmailInput}
                                    />
                                    <MDBInput
                                        label="Your password"
                                        value={this.state.password}
                                        group
                                        type="password"
                                        validate
                                        containerClass="mb-0"
                                        onChange={this.HandelPasswordInput}

                                    />
                                </div>

                                <div className="divRemember">
                                    <FormControlLabel
                                        control={<Checkbox id="rememberMe" value="lsRememberMe" checked={this.state.rememberMe} color="primary" />}
                                        label="Remember me"
                                        onChange={this.RememberMe}
                                    />
                                </div>
                                <div className="text-center mb-3 btnSignIn">
                                    <MDBBtn
                                        type="button"
                                        gradient="blue"
                                        rounded
                                        className="btn-block z-depth-1a"
                                        onClick={this.SignInFunc}
                                    >
                                        Sign in
                </MDBBtn>
                                </div>
                                <div>
                                    <div className="or-seperator"><i>or</i></div>

                                </div>

                                <div className="text-center mb-3">
                                    <Facebook checkifExistFunc={this.props.checkIfexistUsers} Allusers={this.props.Allusers} PostGuideToSQLFromFacebook={this.props.PostGuideToSQLFromFacebook} />
                                    <Google checkifExistFunc={this.props.checkIfexistUsers} Allusers={this.props.Allusers} PostGuideToSQLFromGoogle={this.props.PostGuideToSQLFromGoogle} />
                                </div>


                            </MDBCardBody>
                            <MDBModalFooter className="mx-5 pt-3 mb-1">
                                <div className="row col-12">
                                    <div className="col-6 forgotPass">
                                        <p className="font-small blue-text d-flex justify-content-end"><Link to="/reset">Forgot Password?</Link></p>
                                    </div>
                                    <div className="col-6 signUp">
                                        <p className="font-small grey-text d-flex justify-content-end">
                                            Not a member?
                                <Link to="/SignUp">SignUp</Link>
                                        </p>
                                    </div>
                                </div>
                            </MDBModalFooter>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </MDBContainer>
        );
    }
}

export default withRouter(SignIn);

