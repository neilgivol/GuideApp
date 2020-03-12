
import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import { GoogleLogout } from "react-google-login";
import { Link, withRouter, Redirect } from 'react-router-dom';

class Google extends Component {
  constructor() {
    super();
    this.state = {
      userDetails: {},
      isUserLoggedIn: false,
      email:'',
      picture:'',
      firstName:'',
      lastName:""
    };
  }
  responseGoogle = response => {
    this.setState({ userDetails: response.profileObj, isUserLoggedIn: true });
    const googleLogin = true;
    const facebookLogin = false;
    this.props.history.push({
      pathname: '/home/',
      state: { profileObj: response.profileObj, googleLogin: googleLogin, facebookLogin: facebookLogin }
    });
  return <div>{this.props.PostGuideToSQLFromGoogle(this.state.userDetails)}</div>
  };
  logout = () => {
    this.setState({ isUserLoggedIn: false })
  };

  render() {
    return (
      <div className="App">
        {!this.state.isUserLoggedIn && (
          <GoogleLogin
            clientId="383883505141-igdv29benmn8rp60edikg4j8ed5t20rs.apps.googleusercontent.com" //CLIENTID NOT CREATED YET
            // render={renderProps => (
            //   <button
            //     className="button"
            //     onClick={renderProps.onClick}
            //     disabled={renderProps.disabled}
            //   >
            //     Log in with Google
            //   </button>
            // )}
            buttonText="Login With Google"
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
          />
        )}
        {/* {this.state.isUserLoggedIn && (
           
        )} */}
        </div>
    );
  }
}

export default withRouter(Google);