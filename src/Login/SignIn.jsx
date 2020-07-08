import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBModalFooter } from 'mdbreact';
import logo from '../Img/logo.png';
import Facebook from "./Facebook.js";
import { Link, withRouter } from 'react-router-dom';
import Google from './Google';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Button, Col, Row, Form, ListGroup, Card, ListGroupItem, Container } from 'react-bootstrap';

import Checkbox from '@material-ui/core/Checkbox';
import Swal from 'sweetalert2'
import logo2 from '../Img/Isravisionlogo.png';
import logo3 from '../Img/Isravisionlogo1.png';
import logo4 from '../Img/Isravisionlogo2.png';
import Dialog from '@material-ui/core/Dialog';
import logoLast from '../Img/logoadvisor.png';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import './SignIn.css';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="#" to='#'>
                IsrAdvisor
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
            rememberMe: false,
            lieceneNum: "",
            govILAsk: false,

        }
    }
    componentWillUnmount() {
        clearInterval(this.myInterval)
    }
    componentWillMount() {
        //אם החליף תמונה
        if (this.props.location.state !== undefined) {
            this.props.history.push({
                pathname: '/home/',
                state: { GuideTemp: this.props.location.state.GuideTemp }
            });
        }
    }
    //במידה והמשתמש לחץ על כפתור שמור את הפרטים שלי - הפרטים יופיעו על המסך בכל כניסה שלו
    componentDidMount() {
        if (localStorage.getItem('rememberMe') !== null) {
            const rememberMe = localStorage.getItem('rememberMe') === 'true';
            const usernameEntered = rememberMe ? localStorage.getItem('usernameEntered') : '';
            const PasswordEntered = rememberMe ? localStorage.getItem('PasswordEntered') : '';
            this.setState({
                email: usernameEntered,
                password: PasswordEntered,
                rememberMe: rememberMe,
                govILAsk: !this.state.govILAsk
            });
        }
      
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
    HandelNumberInput = (e) => {
        this.setState({
            lieceneNum: e.target.value
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
//יוצא מהשאלה אם המדריך רשום באתר משרד התיירות
    Exit = () => {
        console.log("Exist");
        this.setState({
            govILAsk: false
        })
    }

    //שואל אם המדריך רשום באתר משרד התיירות
    alertGuidesGovILAsk = () => {
        let licenseNum
        return (
            <Row className="divGov">
                <h5>Do you have an account at the ministry of tourism  website?</h5>
                <Col className="InputNumber" md="12">
                    <MDBInput
                        type="number"
                        onChange={this.HandelNumberInput}
                        label="Enter Your Liecnse Number"
                    />
                </Col>
                <Col className="ButtonClass" md="12">
                    <Col className="ButtonClass" md="6">
                        <MDBBtn
                            type="button"
                            gradient="blue"
                            rounded
                            className="btn-block z-depth-1a"
                            onClick={this.SignInWithGovIL}>
                            Yes
                                            </MDBBtn>
                    </Col>
                    <Col className="ButtonClass" md="6">
                        <MDBBtn
                            type="button"
                            gradient="peach"
                            rounded
                            className="btn-block z-depth-1a"
                            onClick={this.Exit}>
                            No
                                            </MDBBtn>
                    </Col>
                </Col>


            </Row>)
    }

    //לוקח את פרטי המשתמש ושולח אותם למסד נתונים כדי לבדוק האם קיים משתמש כזה
    SignInFunc = () => {
        localStorage.clear();
        localStorage.setItem('rememberMe', this.state.rememberMe);
        localStorage.setItem('usernameEntered', this.state.rememberMe ? this.state.email : '');
        localStorage.setItem('PasswordEntered', this.state.rememberMe ? this.state.password : '');
        let signInUser = {
            Email: this.state.email,
            Password: this.state.password
        }
        //הפרטים נשלחים לפונקציה שנמצאת בAPP.JS
        this.props.checkSignIn(signInUser,2);
    }

    SignInWithGovIL = () => {
        if (this.state.lieceneNum !== "") {
            this.props.GovList(this.state.lieceneNum);
        }
        else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please insert License Number!',
              })
        }
    }

    render() {
        return (
            <div className="Cont">
                {this.state.govILAsk ? <div className="aletGov">{this.alertGuidesGovILAsk()}</div> : null}
                <Container className='AdminContainer'>
                    <Row className="logoRow">
                        <Col md="12 text-center" className="divLogo" >
                            <img className="LogoDiv" alt="" src={logoLast} />
                        </Col>
                    </Row>
                    {this.state.govILAsk ? null  :  
                    <Row className="RowDivSignIn text-center">
                        <Col className="ColDivSignIn" xl="6">
                            <Card className="CardDivSignIn">
                                <MDBCardBody className="cardBody mx-4">
                                    <div className="text-center titleSignIn">
                                        <h3 className="dark-grey-text">
                                            <strong>Sign in</strong>
                                        </h3>
                                    </div>
                                    <div className="text-center EmailInput">
                                        <MDBInput size="lg"
                                            label="Your email"
                                            value={this.state.email}
                                            group
                                            type="email"
                                            validate
                                            error="wrong"
                                            success="right"
                                            onChange={this.HandelEmailInput}
                                        />
                                        <MDBInput size="lg"
                                        className="passwordInput"
                                            label="Your password"
                                            value={this.state.password}
                                            group
                                            type="password"
                                            validate
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
                                    <Row>
                                        <Col lg="6" md="12">
                                            <Facebook checkifExistFunc={this.props.checkIfexistUsers} PostGuideToSQLFromFacebook={this.props.PostGuideToSQLFromFacebook} />
                                        </Col>
                                        <Col lg="6" md="12">
                                            <Google checkifExistFunc={this.props.checkIfexistUsers} PostGuideToSQLFromGoogle={this.props.PostGuideToSQLFromGoogle} />
                                        </Col>
                                    </Row>
                                </MDBCardBody>
                                <MDBModalFooter className="mx-5 pt-3 mb-1">
                                    <Row className="footerSignIn">
                                        <Col xs="6" className="forgotPass">
                                            <p className="font-small blue-text"><Link to="/reset">Forgot Password?</Link></p>
                                        </Col>
                                        <Col xs="6" className="signUp">
                                            <p className="font-small grey-text">
                                                Not a member?
                                                <Link to="/SignUp">SignUp</Link>
                                            </p>
                                        </Col>
                                    </Row>
                                </MDBModalFooter>
                            </Card>
                        </Col>
                    </Row>
                    }
                    <Link to="/Admin"> Admin </Link>
                  <Row>
                  <Box id="" mt={8} className="copy2">
                        <Copyright />
                    </Box>
                  </Row>
                  
                </Container>
            </div>
        );
    }
}

export default withRouter(SignIn);

