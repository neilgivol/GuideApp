
import React, { Component } from 'react';
import FacebookLoginBtn from 'react-facebook-login';
import { Link, withRouter,Redirect } from 'react-router-dom';
import { redirectTo } from '@reach/router';


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
        console.log("clicked");
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
        this.props.history.push({
            pathname: '/home/',
            state: {firstName:this.state.firstName,lastName:this.state.lastName,email:this.state.email,picture:this.state.picture,userID:this.state.userID,facebookLogin:facebookLogin, googleLogin:googleLogin }
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
            <div>
                {fbContent}
            </div>
        );
    }
}

export default withRouter(Facebook);