import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBCard, MDBCardBody } from 'mdbreact';
import logo from '../Img/logo.png';
import { Link, withRouter } from "react-router-dom";
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Swal from 'sweetalert2';
import logoLast from '../Img/logoadvisor.png';
import './SignUp.css';
import './SignIn.css';
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="#">
        IsraAdvisor
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: {
        val: "",
        isValid: false
      },
      password: {
        val: "",
        isValid: false
      },
      confirmPassword: {
        val: "",
        isValid: false
      },
      firstName: {
        val: "",
        isValid: false
      },
      lastName: {
        val: "",
        isValid: false
      },
      startDate: new Date(),

    }
  }

  changeHandler = event => {
    const { name, value } = event.target;

    switch (name) {
      case 'firstName':
        let firstName = { ...this.state.firstName }
        firstName.isValid = event.target.validity.valid
        firstName.val = event.target.value;
        this.setState({ firstName })

        break;
      case 'lastName':
        let lastName = { ...this.state.lastName }
        lastName.val = event.target.value;
        lastName.isValid = event.target.validity.valid
        this.setState({ lastName })
        break;
      case 'email':
        let email = { ...this.state.email }
        email.val = event.target.value;
        email.isValid = event.target.validity.valid
        this.setState({ email })
        break;
      case 'password':
        let newPassword = { ...this.state.password }
        newPassword.val = event.target.value;
        newPassword.isValid = event.target.validity.valid
        this.setState({ password: newPassword })
        break;
      case 'confirmPassword':
        let confirmPassword = { ...this.state.confirmPassword }
        confirmPassword.val = event.target.value;
        confirmPassword.isValid = event.target.validity.valid
        this.setState({ confirmPassword })
        break;
      default:
        break;
    }


  };
  submitHandler = event => {
    event.preventDefault();
    event.target.className += " was-validated";
    if (this.state.firstName.isValid && this.state.lastName.isValid && this.state.email.isValid && this.state.password.isValid && this.state.confirmPassword.isValid) {
      this.CheckPasswordConfirm();
    }
    else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'something is wrong!',
        text: 'please check you filled all the inputs correctly',
        showConfirmButton: false,
        timer: 2000
      });
    }

  };

  //בודק האם השדה של סיסמא תואם לשדה של אשר סיסמא
  CheckPasswordConfirm = () => {
    let password = this.state.password.val;
    let confirmPassword = this.state.confirmPassword.val;

    if (password !== confirmPassword) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: ' password error!',
        text: 'please make sure the password input and confirm password input are match',
        showConfirmButton: false,
        timer: 2000
      });
    }
    else {
      this.moveFunc();
    }
  }

  //APP.JS  לוקח את הפרטים שהמשתמש הזין ושולח אותם למסד נתונים שם נבדק אם המשתמש כבר רשום או לא(הפונקציה נמצאת ב
  moveFunc = () => {
    let signDate = this.state.startDate.toLocaleDateString('en-US');
    let GuideSignUp = {
      Email: this.state.email.val,
      FirstName: this.state.firstName.val,
      LastName: this.state.lastName.val,
      Password: this.state.password.val,
      picture: "",
      SignDate: signDate,
      Birthday: signDate,
      Gender: ""
    }
    this.props.checkIfExistAndSignUP(GuideSignUp);
  }

  render() {
    return (
        <div className="Cont">
      <MDBContainer>
          <MDBRow className="logoRow">
          <MDBCol md="12" id="signUpImage" className="divLogo"><img className="LogoDiv" alt="" src={logoLast} /></MDBCol>
          </MDBRow>
          <MDBRow className="RowDivSignIn">

          <MDBCol className="ColDivSignIn" md="6">
            <MDBCard className="CardDivSignIn">
              <MDBCardBody className="mx-4 CardBody">
                <div>
                  <Link to="/"><i className="fa fa-undo" aria-hidden="true"></i></Link>
                </div>
                <div className="text-center">
                  <h3 className="dark-grey-text mb-1">
                    <strong>Sign Up</strong>
                  </h3>
                </div>
                <form
                  className="needs-validation EmailInput"
                  onSubmit={this.submitHandler}
                  noValidate
                >
                  <MDBRow>
                    <MDBCol md="12">
                      <MDBInput
                        label="First Name"
                        name="firstName"
                        icon="user"
                        group
                        type="text"
                        validate
                        error="wrong"
                        success="right"
                        onChange={this.changeHandler}
                        required
                        pattern="^[a-zA-Z\s]{2,32}"
                      />
                      <div className="valid-feedback">Looks good!</div>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="12">
                      <MDBInput
                        label="Last Name"
                        name="lastName"
                        icon="user"
                        group
                        type="text"
                        validate
                        error="wrong"
                        success="right"
                        onChange={this.changeHandler}
                        required
                        pattern="^[a-zA-Z\s]{2,32}"
                      />
                      <div className="valid-feedback">Looks good!</div>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="12">
                      <MDBInput
                        label="Your email"
                        name="email"
                        icon="envelope"
                        group
                        type="email"
                        validate
                        error="wrong"
                        success="right"
                        onChange={this.changeHandler}
                        required
                        pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$"
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="12">
                      <MDBInput
                        label="Your password"
                        name="password"
                        icon="lock"
                        id="signUpPassword"
                        group
                        type="password"
                        validate
                        onChange={this.changeHandler}
                        required
                        pattern=".{6,}"
                      />
                      <div className="invalid-feedback">
                        Please provide a valid password.
                </div>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="12">
                      <MDBInput
                        label="Confirm your password"
                        name="confirmPassword"
                        icon="lock"
                        group
                        id="signUpConfirmPassword"
                        type="password"
                        validate
                        error="wrong"
                        success="right"
                        onChange={this.changeHandler}
                        required
                        pattern=".{6,}"
                      />
                      <div className="invalid-feedback">
                        Please provide a valid password.
                </div>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="12">
                      <MDBBtn gradient="blue"
                        rounded
                        className="btn-block z-depth-1a" type="submit"
                      // onClick={()=>{this.CheckPasswordConfirm()}}
                      >
                        Register
                  </MDBBtn>
                    </MDBCol>
                  </MDBRow>
                </form>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        <Box mt={8}>
          <Copyright />
        </Box>
      </MDBContainer>
      </div>
    );
  }
}
export default withRouter(SignUp);
