import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBIcon, MDBModalFooter } from 'mdbreact';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import '../Css/SignIn.css';
import logo from '../Img/logo.png';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import '../Css/passwordReset.css';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Swal from 'sweetalert2';

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

class ResetPassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: "",
            local:this.props.local
            

        }
     
        let local = this.state.local;
        this.apiUrl = 'http://localhost:49948/api/Guide';
        if (!local) {
            this.apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Guide';
        }
    }
  

    // GetGuides = () => {   //gets guide list 
    //     fetch(this.apiUrl, {
    //         method: 'GET',
    //         headers: new Headers({
    //             'Content-Type': 'application/json; charset=UTF-8',
    //         })
    //     })
    //         .then(res => {
    //             return res.json()
    //         })
    //         .then(
    //             (result) => {
    //                 this.CheckIfUserExist(result);
                    
    //             },
    //             (error) => {
    //                 console.log("err post=", error);
    //             });


    // }
    // CheckIfUserExist = (result) => { //check if guide exist
    //     let emailFound = false
    //     let tempUser ="";
    //     for (let i = 0; i < result.length; i++) {
    //         const element = result[i];
    //         if (element.Email===this.state.email) {
                
    //             emailFound=true;
    //             tempUser=element;
    //         }
          
            
    //     }
    //     if (emailFound) {
    //         this.ResetUserPassword(tempUser)
    //     }
    //     else{
    //         alert("there is no user with the following email")
    //     }


    // }
    ResetUserPassword = ()=>{
         let tempMail = this.state.email; 
        fetch(this.apiUrl + '/Reset', {
            method: 'POST',
            body: JSON.stringify(tempMail),
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
               console.log("success")
                
              },
              (error) => {
                console.log("err post=", error);
              });
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'נשלחה סיסמא חדשה למייל',
                showConfirmButton: false,
                timer: 1200
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
            <MDBContainer>
                <MDBRow className="RowDivSignIn">
                    <MDBCol md="6" className="LogoDiv"><img src={logo} /></MDBCol>
                    <MDBCol className="ColDivSignIn" md="6">
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
                                        onClick={this.ResetUserPassword}
                                    >Reset Password</MDBBtn>
                                </Form.Group>

                            </MDBCardBody>

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

export default ResetPassword;
