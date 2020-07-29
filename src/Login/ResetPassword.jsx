import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn } from 'mdbreact';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import './ResetPassword.css';
import './SignIn.css';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Swal from 'sweetalert2';
import logoLast from '../Img/logoadvisor.png';
import { myFirestore, myFirebase } from "../services/firebase";

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

class ResetPassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: "",
            local: this.props.local
        }

        let local = this.state.local;
        this.apiUrl = 'http://localhost:49948/api/Guide';
        if (!local) {
            this.apiUrl = 'https://proj.ruppin.ac.il/bgroup10/PROD/api/Guide';
        }
    }

    //שולח את האימייל של המשתמש למסד הנתונים ושם משנה את סיסמתו
    ResetUserPassword = (user) => {
        fetch(this.apiUrl + '/Reset', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
            })
        })
            .then(res => {
                return res.json()
            })
            .then(
                (result) => {
                    this.updateInFirebase(user.PasswordGuide, result);
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'password sent to your email',
                        showConfirmButton: false,
                        timer: 1200
                    });



                },
                (error) => {
                    console.log("err post=", error);
                });


    }

    updateInFirebase = (oldPassword, result) => {
        myFirebase.auth().signInWithEmailAndPassword(result.Email, oldPassword)
            .then(async res => {
                var user = myFirebase.auth().currentUser;
                if (user) {
                    await myFirestore.collection('users')
                        .where('id', "==", user.uid)
                        .get()
                        .then(function (querySnapshot) {
                            querySnapshot.forEach(function (doc) {
                                const currentdata = doc.data()
                                localStorage.setItem('docId', doc.id);
                                localStorage.setItem('idChat', currentdata.id);
                                user.updatePassword(result.PasswordGuide).then(function () {
                                    myFirebase.firestore().collection("users").doc(doc.id).update({
                                        password: result.PasswordGuide
                                        // Update successful.
                                    }).catch(function (error) {
                                        // An error happened.
                                    });
                                })
                            })
                        })
                }


            })
    }

    GetGuideFromSQL = () => {
        let email = this.state.email;
        fetch(this.apiUrl + '?email=' + email, {
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
                    if (result.Email !== null) {
                        this.ResetUserPassword(result);
                    }
                    else {
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: 'Error email address',
                            showConfirmButton: false,
                            timer: 1200
                        });
                    }
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

    HandelEmailInput = (e) => {
        this.setState({
            email: e.target.value
        }
        )

    }
    render() {
        return (
            <div className="Cont">
                <MDBContainer>
                <MDBRow className="logoRow">
          <MDBCol md="12" id="signUpImage" className="divLogo"><img className="LogoDiv" alt="" src={logoLast} /></MDBCol>
          </MDBRow>    
                              <MDBRow className="RowDivSignIn">
                        <MDBCol className="ColDivSignIn resetDivBody" md="6">
                            <MDBCard className="CardDivSignIn">
                                <MDBCardBody className="mx-4 CardBody cardReset">
                                    <div>
                                        <Link to="/"><i className="fa fa-undo" aria-hidden="true"></i></Link>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="dark-grey-text mb-5">
                                            <strong>Reset Password</strong>
                                        </h3>
                                    </div>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>Enter your email address to reset your password</Form.Label>
                                        <input
                                            placeholder="email"
                                            onChange={this.HandelEmailInput}
                                        />
                                        <Form.Text className="text-muted">
                                            We'll never share your email with anyone else.
    </Form.Text>
                                        <MDBBtn
                                            type="button"
                                            gradient="blue"
                                            rounded
                                            className="btn-block z-depth-1a btnReset"
                                            onClick={this.GetGuideFromSQL}
                                        >Reset Password</MDBBtn>
                                    </Form.Group>

                                </MDBCardBody>

                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                  <Box mt={8} className="copy2">
                        <Copyright />
                    </Box>
                  </MDBRow>
                </MDBContainer>
            </div>

        );
    }
}

export default ResetPassword;
