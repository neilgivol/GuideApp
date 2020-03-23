import React, { Component } from 'react';
import './App.css';
import SignIn from './Screens/SignIn';
import { Switch, Route, withRouter,Redirect  } from 'react-router-dom';
import SignUp from './Screens/SignUp';
import { Router } from '@reach/router'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
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
const w = window.innerWidth;
const h = window.innerHeight;

const navLinks = [
  {
    text: 'Profile',
    path: '/home',
    icon: 'ion-ios-home'
  },
  {
    text: 'Chat',
    path: '/chat',
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
  constructor(props) {
    super(props)
    this.state = {
      guides: [],
      navbarCheckOpen: "open",
      email: "",
      firstName: "",
      lastName: "",
      tempGuide:null
    }
    let local = true;
    this.apiUrl = 'http://localhost:49948/api/Guide';
    if (!local) {
      this.apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Guide';
    }
  }
  

  componentDidMount() {
    console.log("DidMount_App")
       this.GetGuidesFromSQL();
  }

  PostGuideToSQL = (guide) => {
      //pay attention case sensitive!!!! should be exactly as the prop in C#!
      let tar = null;
      fetch(this.apiUrl, {
        method: 'POST',
        body: JSON.stringify({
          Email: guide.Email,
          PasswordGuide: guide.PasswordGuide,
          FirstName: guide.FirstName,
          LastName: guide.LastName,
          ProfilePic: "",
          SignDate:guide.SignDate
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
            if (result !== null) {
              this.setState({
                guides:result
              });
            }
            console.log(result);
            console.log(this.state.guides);
            this.props.history.push({
              pathname: '/home/',
            });  
          },
          (error) => {
            console.log("err post=", error);
          });
  }


  PostGuideToSQLFromFacebook = (guideFacebook) => {
    let tempDate = new Date();
    let StartDate = tempDate.toLocaleDateString('en-US');
    let isExist = false;
    this.GetGuidesFromSQL();
    for (let i = 0; i < this.state.guides.length; i++) {
      const g = this.state.guides[i];
      if (g.Email === guideFacebook.email) {
        isExist = true;
      }
    }

    if (isExist) {

    }
    else {
      fetch(this.apiUrl, {
        method: 'POST',
        body: JSON.stringify({
          Email: guideFacebook.email,
          PasswordGuide: "NoPassword",
          FirstName: guideFacebook.firstName,
          LastName: guideFacebook.lastName,
          ProfilePic: guideFacebook.picture,
          SignDate:StartDate
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
            if (result !== null) {
              this.setState({
                guides:result
              });
            }
            console.log(result);
            console.log(this.state.guides);
            this.props.history.push({
              pathname: '/home/',
            });  
          },
          (error) => {
            console.log("err post=", error);
          });
    }
  }
  PostGuideToSQLFromGoogle = (guideGoogle) => {
    let isExist = false;
    this.GetGuidesFromSQL();
    for (let i = 0; i < this.state.guides.length; i++) {
      const g = this.state.guides[i];
      if (g.Email === guideGoogle.email) {
        isExist = true;
      }
    }

    if (isExist) {

    }
    else {
    let tempDate = new Date();
      let StartDate = tempDate.toLocaleDateString('en-US');
      fetch(this.apiUrl, {
        method: 'POST',
        body: JSON.stringify({
          Email: guideGoogle.email,
          PasswordGuide: "No Password",
          FirstName: guideGoogle.givenName,
          LastName: guideGoogle.familyName,
          ProfilePic: guideGoogle.imageUrl,
          SignDate:StartDate
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
            if (result !== null) {
              this.setState({
                guides:result
              });
            }
            console.log(result);
            console.log(this.state.guides);
            this.props.history.push({
              pathname: '/home/',
            });  
          },
          (error) => {
            console.log("err post=", error);
          });
    }
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
  render() {
    return (
      <div className="app">
        <Switch>
          <Route exact path="/" >
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
          <Route path="/signIn" >
            <SignIn Allusers={this.state.guides} PostGuideToSQLFromFacebook={this.PostGuideToSQLFromFacebook} PostGuideToSQLFromGoogle={this.PostGuideToSQLFromGoogle} />
          </Route>
          <Route path="/signUp">
            <SignUp Allusers={this.state.guides} PostGuideToSQL={this.PostGuideToSQL} CheckIfGuideExist={this.CheckIfGuideExist} />
          </Route>
          <Route path="/home">
            <ResponsiveNavigation
              navbarCheckFunc={this.navbarCheck}
              navLinks={navLinks}
              logo={logo}
              background="#0099cc"
              hoverBackground="#ddd"
              linkColor="#777"
            />
            <Home Allusers={this.state.guides} navbarOpenCheck={this.state.navbarCheckOpen} GetGuidesFromSQL={this.GetGuidesFromSQL} />
          </Route>
          <Route path="/chat">
            <ResponsiveNavigation
              navbarCheckFunc={this.navbarCheck}
              navLinks={navLinks}
              logo={logo}
              background="#0099cc"
              hoverBackground="#ddd"
              linkColor="#777"
            />
            <Contact />
          </Route>
          <Route path="/area">
            <ResponsiveNavigation
              navbarCheckFunc={this.navbarCheck}
              navLinks={navLinks}
              logo={logo}
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
              logo={logo}
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
              logo={logo}
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
              logo={logo}
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
              logo={logo}
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

