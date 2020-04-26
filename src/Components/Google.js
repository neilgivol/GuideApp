
import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import { withRouter } from 'react-router-dom';
import ReactLoading from 'react-loading';

class Google extends Component {
  constructor() {
    super();
    this.state = {
      userDetails: {},
      isUserLoggedIn: false,
      guide:"",
      startDate: new Date(),
      isLoading:false
    };
  }

  
  responseGoogle = response => {
    this.setState({ userDetails: response.profileObj, isUserLoggedIn: true, isLoading:true });
    let signDate = this.state.startDate.toLocaleDateString('en-US');
    const GoogleUser = {
      SignDate:signDate,
      Email: this.state.userDetails.email,
      FirstName: this.state.userDetails.givenName,
      LastName: this.state.userDetails.familyName,
      picture:"",
      Password:"NoPassword",
      Birthday:signDate,
      Gender:""
    }
    this.props.checkifExistFunc(GoogleUser);
  };
  logout = () => {
    this.setState({ isUserLoggedIn: false })
  };

  render() {
    return (
      <div>
        {!this.state.isUserLoggedIn && (
          <GoogleLogin
            clientId="383883505141-igdv29benmn8rp60edikg4j8ed5t20rs.apps.googleusercontent.com" //CLIENTID NOT CREATED YET

            buttonText="Login With Google"
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
          />
        )}

      </div>
    );
  }
}

export default withRouter(Google);