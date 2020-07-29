
import React, { Component } from 'react';
import FacebookLoginBtn from 'react-facebook-login';
import { withRouter } from 'react-router-dom';
import Swal from "sweetalert2";


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
        if (response.email !== null && response.email !== undefined) {
            this.setState({
                isLoggedIn: true,
                userID: response.userID,
                email: response.email,
                picture: response.picture.data.url,
                firstName: response.first_name,
                lastName: response.last_name,
                //BirthDay:response.birthday,
                //Gender:response.gender
            });
        }
        else{
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Error with facebook',
                showConfirmButton: true,
                timer: 1800
            });
        }
    }
    userEnter = () => {
        let signDate = this.state.startDate.toLocaleDateString('en-US');
        let birthDayTemp = this.state.BirthDay.toLocaleDateString('en-US');
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
//240993680265877
//189882132323354

        this.state.isLoggedIn ?
            fbContent = (
                <div>{this.userEnter()}</div>
            ) :
            fbContent = (
                <FacebookLoginBtn
                    appId="189882132323354"
                    scope="public_profile, email"
                    autoLoad={false}
                    fields="email,first_name,last_name,picture.width(280).height(280)"
                    onClick={this.componentClicked}
                    callback={this.responseFacebook} 
                    cssClass="loginBtn loginBtn--facebook"
                    cookie={true}
                    xfbml={true}
                    isMobile={false}
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