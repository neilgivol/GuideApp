
import React, { Component } from 'react';
import FacebookLoginBtn from 'react-facebook-login';
import { withRouter } from 'react-router-dom';


class Facebook extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: false,
            userID: '',
            email: '',
            picture: '',
            firstName: '',
            lastName: "",
            startDate: new Date(),
            BirthDay:new Date(),
            Gender:""
        }
    }
    componentClicked = () => {
    }
    responseFacebook = (response) => {
        if (response.status !== 'unknown') {
            this.setState({
                isLoggedIn: true,
                userID: response.userID,
                email: response.email,
                picture: response.picture.data.url,
                firstName: response.first_name,
                lastName: response.last_name,
                BirthDay:response.birthday,
                Gender:response.gender
            });
            console.log(response);
        }
    }
    userEnter = () => {
        let signDate = this.state.startDate.toLocaleDateString('en-US');
        let birthDayTemp = this.state.BirthDay;
        const FacebookUser = {
            SignDate: signDate,
            Email: this.state.email,
            picture: this.state.picture,
            FirstName: this.state.firstName,
            LastName: this.state.lastName,
            Password: "NoPassword",
            Birthday:birthDayTemp,
            Gender:this.state.Gender
        }
        this.props.checkifExistFunc(FacebookUser);
    }

    render() {
        let fbContent;

        this.state.isLoggedIn ?
            fbContent = (
                <div>{this.userEnter()}</div>
            ) :
            fbContent = (
                <FacebookLoginBtn
                    appId="189882132323354"
                    scope="user_gender,user_birthday,public_profile"
                    autoLoad={false}
                    fields="first_name,last_name,email,picture.width(280).height(280),gender,birthday"
                    onClick={this.componentClicked}
                    callback={this.responseFacebook} 
                    cssClass="loginBtn loginBtn--facebook"
                    />
            );

        return (
            <div className="FacebookBTN">
                {fbContent}
            </div>
        );
    }
}

export default withRouter(Facebook);