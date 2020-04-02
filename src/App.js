import React, { Component } from 'react';
import './App.css';
import SignIn from './Screens/SignIn';
import { Switch, Route, withRouter,Redirect  } from 'react-router-dom';
import SignUp from './Screens/SignUp';
import { Router } from '@reach/router'
import About from './pages/About.jsx'
import Chat from './pages/Chat.jsx'
import Portfolio from './pages/Portfolio.jsx'
import Blog from './pages/Blog.jsx'
import Home from './pages/Home.jsx'
import ResponsiveNavigation from './Components/ResponsiveNavigation.jsx'
import ResetPassword from './Screens/ResetPassword'
import logo from './logo.svg';
import ProfileDetails from './Screens/ProfileDetails';
import Area from './Screens/Area';
import Check from './Screens/Check';
import SignInTemp from './Screens/SignInTemp';
import menu from './Img/menu.png';
import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import MainFooter from './Components/MainFooter';

const navLinks = [
  {
    text: 'Profile',
    path: '/home',
    icon: 'ion-ios-home'
  },
  {
    text: 'Chat',
    path: '/chat',
    icon: 'ion-ios-chatbubbles'
  },
  {
    text: 'Trips',
    path: '/about',
    icon: 'ion-ios-map'
  },
  {
    text: 'Tourist Lists',
    path: '/blog',
    icon: 'ion-ios-people'
  }
]
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      guides: [],
      navbarCheckOpen: "open",
      tempGuide:"",
    
    }
    let local = true;
    this.apiUrl = 'http://localhost:49948/api/Guide';
    if (!local) {
      this.apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Guide';
    }
  }
  componentDidMount() {
    console.log("DidMount_App")
      // this.GetGuidesFromSQL();
  }

  navbarCheck = (nav) => {
    if (nav) {
      this.setState({
        navbarCheckOpen: "close"
      })
    }
    else {
      this.setState({
        navbarCheckOpen: "open"
      })
    }

  }

  GetGuidesFromSQL = () => {
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
         this.setState({
           guides:result
         })
        },
        (error) => {
          console.log("err post=", error);
        });
        let tempArray = this.state.guides;
        return tempArray;

  }


  PostGuideToCheckSignUp=(userDetails)=>{
    console.log("enter")
    //pay attention case sensitive!!!! should be exactly as the prop in C#!
    fetch(this.apiUrl + '/PostToCheck', {
      method: 'POST',
      body: JSON.stringify({
        Email: userDetails.Email,
        PasswordGuide: userDetails.Password,
        ProfilePic:userDetails.picture,
        FirstName:userDetails.FirstName,
        LastName:userDetails.LastName,
        SignDate:userDetails.SignDate,
        Gender:userDetails.Gender,
        BirthDay:userDetails.Birthday
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
            this.setState({
              tempGuide:result,
              
              
            })
          this.MoveToHomePage(this.state.tempGuide);
        },
        (error) => {
          console.log("err post=", error);
        });
}

PostGuideToCheckSignIn=(signInUser)=>{
  //pay attention case sensitive!!!! should be exactly as the prop in C#!
  fetch(this.apiUrl + '/PostToCheck', {
    method: 'POST',
    body: JSON.stringify({
      Email: signInUser.Email,
      PasswordGuide: signInUser.Password
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
        this.setState({
            tempGuide:result
        })
        this.MoveToHomePage(this.state.tempGuide);
      },
      (error) => {
        console.log("err post=", error);
      });
      console.log(this.state.tempGuide);
}

MoveToHomePage=(e)=>{
console.log(e)
if (e!== null) {
    console.log("enter3")
    localStorage.setItem('Guide', JSON.stringify(e))
    this.props.history.push({
        pathname: '/home/',
        state: {GuideTemp : e }
        });
}
else{
  alert("incorrect login information");
}
}

  render() {
    return (
      <div className="app">
        <Switch>
          <Route  path="/check" >
            <Check
              color="#008ae6"
              type="spin" />
          </Route>
          <Route exact path="/reset" >
            <ResetPassword />
          </Route>
          <Route exact path="/temp" >
            <SignInTemp />
          </Route>
          <Route exact path="/" >
            <SignIn checkSignIn={this.PostGuideToCheckSignIn} checkIfexistUsers={this.PostGuideToCheckSignUp}  />
          </Route>
          <Route path="/signUp">
            <SignUp checkIfExistAndSignUP={this.PostGuideToCheckSignUp} CheckIfGuideExist={this.CheckIfGuideExist} />
          </Route>
          <Route path="/home">
            <ResponsiveNavigation
              navbarCheckFunc={this.navbarCheck}
              navLinks={navLinks}
              logo={menu}
              background="#fff"
              hoverBackground="#ddd"
              linkColor="#777"
            />
            <Home Allusers={this.state.guides} navbarOpenCheck={this.state.navbarCheckOpen} GetGuidesFromSQL={this.GetGuidesFromSQL} />
            <MainFooter/>
          </Route>
          <Route path="/chat">
            <ResponsiveNavigation
              navbarCheckFunc={this.navbarCheck}
              navLinks={navLinks}
              logo={menu}
              background="#0099cc"
              hoverBackground="#ddd"
              linkColor="#777"
            />
            <Chat />
          </Route>
          <Route path="/area">
            <ResponsiveNavigation
              navbarCheckFunc={this.navbarCheck}
              navLinks={navLinks}
              logo={menu}
              background="#0099cc"
              hoverBackground="#ddd"
              linkColor="#777"
            />
            <Area />
          </Route>
          <Route path="/portfolio">
            <ResponsiveNavigation
              navbarCheckFunc={this.navbarCheck}
              navLinks={navLinks}
              logo={menu}
              background="#0099cc"
              hoverBackground="#ddd"
              linkColor="#777"
            />
            <Portfolio />
          </Route>
          <Route path="/blog">
            <ResponsiveNavigation
              navbarCheckFunc={this.navbarCheck}
              navLinks={navLinks}
              logo={menu}
              background="#0099cc"
              hoverBackground="#ddd"
              linkColor="#777"
            />
            <Blog />
          </Route>
          <Route path="/about">
            <ResponsiveNavigation
              navbarCheckFunc={this.navbarCheck}
              navLinks={navLinks}
              logo={menu}
              background="#0099cc"
              hoverBackground="#ddd"
              linkColor="#777"
            />
            <About />
          </Route>
          <Route path="/details">
            <ResponsiveNavigation
              navbarCheckFunc={this.navbarCheck}
              navLinks={navLinks}
              logo={menu}
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

export default withRouter(App);

