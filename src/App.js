import React, { Component } from 'react';
import './App.css';
import SignIn from './Screens/SignIn';
import { Switch, Route, Link, withRouter } from 'react-router-dom';
import SignUp from './Screens/SignUp';
import { Router } from '@reach/router'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Portfolio from './pages/Portfolio.jsx'
import Blog from './pages/Blog.jsx'
import Home from './pages/Home.jsx'
import ResponsiveNavigation from './Components/ResponsiveNavigation.jsx'

import logo from './logo.svg';
import ProfileDetails from './Screens/ProfileDetails';
import Area from './Screens/Area';
import Check from './Screens/Check';
const navLinks = [
  {
    text: 'Profile',
    path: '/home',
    icon: 'ion-ios-home'
  },
  {
    text: 'Chat',
    path: '/contact',
    icon: 'ion-ios-megaphone'
  },
  {
    text: 'Trips',
    path: '/about',
    icon: 'ion-ios-business'
  },
  {
    text: 'Tourist Lists',
    path: '/blog',
    icon: 'ion-ios-bonfire'
  }
]

class App extends Component {
  constructor(props){
    super(props)
    this.state={
      guides:[],
      //activeNavBar:document.getElementById('activeNav'),
    }
    let local = true;
    this.apiUrl = 'http://localhost:49948/api/Guide';
    if (!local) {
      this.apiUrl = '';
    }
  }

  componentWillMount() {
    fetch(this.apiUrl, {
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
          this.setState({guides:result})
          console.log(this.state.guides)
        },
        (error) => {
          console.log("err post=", error);
        });


  }
 
  PostGuideToSQL = (guide) => {
  let isExist = false;
    for (let i = 0; i < this.state.guides.length; i++) {
      const g = this.state.guides[i];
      if (g.Email == guide.email) {
        isExist = true;
      }
    }

      if(isExist){
        alert("Already Exist");
      } 
      else{
            //pay attention case sensitive!!!! should be exactly as the prop in C#!
    fetch(this.apiUrl, {
      method: 'POST',
      body: JSON.stringify({
        Email:guide.email,
        PasswordGuide:guide.password,
        FirstName:guide.firstName,
        LastName:guide.lastName,
        ProfilePic:""
      }),
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
          console.log("fetch POST= ", result);
          console.log(result);
        },
        (error) => {
          console.log("err post=", error);
        });
      }
  
  }
  PostGuideToSQLFromFacebook=(guideFacebook)=>{
    let isExist = false;
    for (let i = 0; i < this.state.guides.length; i++) {
      const g = this.state.guides[i];
      if (g.Email == guideFacebook.email) {
        isExist = true;
      }
    }

      if(isExist){
       
      } 
      else{
    fetch(this.apiUrl, {
      method: 'POST',
      body: JSON.stringify({
        Email:guideFacebook.email,
        PasswordGuide:"No Password",
        FirstName:guideFacebook.firstName,
        LastName:guideFacebook.lastName,
        ProfilePic:guideFacebook.picture
      }),
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
          console.log("fetch POST= ", result);
          console.log(result);
        },
        (error) => {
          console.log("err post=", error);
        });
      }
  }
  PostGuideToSQLFromGoogle=(guideGoogle)=>{
    let isExist = false;
    for (let i = 0; i < this.state.guides.length; i++) {
      const g = this.state.guides[i];
      if (g.Email == guideGoogle.email) {
        isExist = true;
      }
    }

      if(isExist){
       
      } 
      else{
    fetch(this.apiUrl, {
      method: 'POST',
      body: JSON.stringify({
        Email:guideGoogle.email,
        PasswordGuide:"No Password",
        FirstName:guideGoogle.givenName,
        LastName:guideGoogle.familyName,
        ProfilePic:guideGoogle.imageUrl
      }),
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
          console.log("fetch POST= ", result);
          console.log(result);
        },
        (error) => {
          console.log("err post=", error);
        });
      }
  }
  CheckIfGuideExist=()=>{

  }

  GetUserValues = () =>{

  }
  render() {
    return (
      <div className="app">
      <Switch>
      <Route exact path="/" >
      <Check
       color="#999"
       type="spin"/>
      </Route>
      <Route  path="/signIn" >
      <SignIn Allusers={this.state.guides} PostGuideToSQLFromFacebook={this.PostGuideToSQLFromFacebook} PostGuideToSQLFromGoogle={this.PostGuideToSQLFromGoogle}/>
      </Route>
        <Route path="/signUp">
        <SignUp PostGuideToSQL={this.PostGuideToSQL} CheckIfGuideExist={this.CheckIfGuideExist}/>
        </Route>
        <Route path="/home">
        <ResponsiveNavigation
        tempOpen2 = {true}
				navLinks={ navLinks }
				logo={ logo }
				background="#0099cc"
				hoverBackground="#ddd"
				linkColor="#777"
			/>
        <Home />
        </Route>
        <Route path="/contact">
        <ResponsiveNavigation
        tempOpen2 = {true}
				navLinks={ navLinks }
				logo={ logo }
				background="#0099cc"
				hoverBackground="#ddd"
				linkColor="#777"
			/>
        <Contact />
        </Route>
        <Route path="/area">
        <ResponsiveNavigation
        tempOpen2 = {true}
				navLinks={ navLinks }
				logo={ logo }
				background="#0099cc"
				hoverBackground="#ddd"
				linkColor="#777"
			/>
        <Area />
        </Route>
        <Route path="/portfolio">
        <Portfolio />
        </Route>
        <Route path="/blog">
        <Blog />
        </Route>
        <Route path="/about">
        <About />
        </Route>
        <Route path="/details">
        <ResponsiveNavigation
                navOpen2 = "open"
				navLinks={ navLinks }
				logo={ logo }
				background="#0099cc"
				hoverBackground="#ddd"
				linkColor="#777"
			/>
        <ProfileDetails />
        </Route>
      </Switch>
    </div>
    );
  }
}

export default App;
