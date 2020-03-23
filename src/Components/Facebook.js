
import React, { Component } from 'react';
import FacebookLoginBtn from 'react-facebook-login';
import { withRouter } from 'react-router-dom';

class Facebook extends Component {
    constructor(props){
        super(props)
        this.state={
            isLoggedIn:false,
            userID:'',
            name:'',
            email:'',
            picture:'',
            firstName:'',
            lastName:""
        }
    }

  
    componentClicked = () =>{
    }
    responseFacebook = (response) =>{
        if (response.status !== 'unknown')
        {
            const fullName = response.name.split(" ");
        this.setState({
            isLoggedIn:true,
            userID:response.userID,
            email:response.email,
            picture:response.picture.data.url,
            firstName:fullName[0],
            lastName:fullName[1]

        });
        console.log(response);
       
      
    }

    }
    userEnter=()=>{
        const facebookLogin = true;
        const googleLogin = false;
        const FacebookUser = {
            Email:this.state.email,
            picture:this.state.picture,
            FirstName:this.state.firstName,
            LastName:this.state.lastName,
            facebookLogin:facebookLogin,
            googleLogin:googleLogin
        }
        let guideTemp
        for (let i = 0; i < this.props.Allusers.length; i++) {
            const element = this.props.Allusers[i];
            if (element.Email === FacebookUser.Email) {
                guideTemp = element
            }
        }

        localStorage.setItem('Guide',JSON.stringify(guideTemp))

        this.props.history.push({
            pathname: '/home/',
        });
        const gFacebook = {
            firstName:this.state.firstName,
            lastName:this.state.lastName,
            email:this.state.email,
            picture:this.state.picture
        }
        return<div> {this.props.PostGuideToSQLFromFacebook(gFacebook)}</div>;
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
                autoLoad={false}
                fields="name,email,picture"
                onClick={this.componentClicked}
                callback={this.responseFacebook} />
            );

        return (
            <div className="FacebookBTN">
                {fbContent}
            </div>
        );
    }
}

export default withRouter(Facebook);