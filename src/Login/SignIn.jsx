import React, { Component } from 'react';
import { MDBCardBody, MDBInput, MDBBtn } from 'mdbreact';
import Facebook from "./Facebook.js";
import { Link, withRouter } from 'react-router-dom';
import Google from './Google';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Col, Row, Card, Container } from 'react-bootstrap';

import Checkbox from '@material-ui/core/Checkbox';
import Swal from 'sweetalert2'
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
                title: 'Your Password and Email are saved',
                showConfirmButton: false,
                timer: 1200
            })
        }
        else {
            this.setState({ rememberMe: false });
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Your Password and Email are not saved',
                showConfirmButton: false,
                timer: 1200
            })
        }
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
        this.props.checkSignIn(signInUser, 2);
    }

    SignInWithGovIL = () => {
        if (this.state.lieceneNum !== "") {
            this.props.GovList(this.state.lieceneNum);
        }
        else {
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
                <Container className='AdminContainer'>
                    <Row className="logoRow">
                        <Col md="12 text-center" className="divLogo" >
                            <img className="LogoDiv" alt="" src={logoLast} />
                        </Col>
                    </Row>
                        <Row className="RowDivSignIn text-center">
                            <Col className="ColDivSignIn" xl="6">
                                <Card className="CardDivSignIn">
                                    <MDBCardBody className="cardBody">
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
                                        <div>
                                            <div className="or-seperator"><i>or</i></div>

                                        </div>
                                        <Row>

                                            <Col sm="12">
                                                <h5>Do you have an account at the ministry of tourism  website?</h5>

                                            </Col>
                                            <Col className="InputNumber" sm="12">
                                                <MDBInput
                                                    type="number"
                                                    onChange={this.HandelNumberInput}
                                                    label="Enter Your Liecnse Number"
                                                />
                                            </Col>
                                            <Col className="text-center mb-3 btnSignIn" xl="6">
                                                <MDBBtn
                                                    type="button"
                                                    rounded
                                                    className="btn-block z-depth-1a winter-neva-gradient"
                                                    onClick={this.SignInWithGovIL}>
                                                    Enter
                                            </MDBBtn>
                                            </Col>
                                        </Row>
                                    </MDBCardBody>
                                    {/* <MDBModalFooter className="mx-5 pt-3 mb-1"> */}
                                    <div className="footerSignIn">
                                        <div className="col-6 forgotPass">
                                            <p className="font-small blue-text"><Link to="/reset">Forgot Password?</Link></p>
                                        </div>
                                        <div className="col-6 signUp">
                                            <p className="font-small grey-text">
                                                Not a member?
                                                <Link to="/SignUp">SignUp</Link>
                                            </p>
                                        </div>
                                    </div>
                                    {/* </MDBModalFooter> */}
                                </Card>
                            </Col>
                        </Row>
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

