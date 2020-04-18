import React, { Component } from 'react';
import './App.css';
import SignIn from './Screens/SignIn';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
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
import menu from './Img/menu.png';
import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import MainFooter from './Components/MainFooter';
import FileUpload from './Components/fileUpload.jsx';
import $ from "jquery";

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
      local: true,
      navbarCheckOpen: "open",
      tempGuide: "",
      AllAreas: [],
      AllHobbies: [],
      AllExpertises: [],
      GuidesFromGovIL: [],
      LanguagesList:[]

    }
    let local = this.state.local;
    this.apiUrl = 'http://localhost:49948/api/';
    if (!local) {
      this.apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/';
    }
  }
  //מביא את כל האזורים, התחביבים וההתמחויות שנמצאות במסד נתונים
  componentDidMount() {
    console.log("DidMount_App");
    this.GetAllAreas();
    this.GetAllHobbies();
    this.GetAllExpertises();
    this.GetGuidesGOVFromSQL();
    this.GetAllLanguages();
    // this.GetGuidesFromSQL();
  }

  //סוגר ופותח את התפריט שנמצא בשלב שאחרי ההתחברות. 
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


  //?????
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
            guides: result
          })
        },
        (error) => {
          console.log("err post=", error);
        });
    let tempArray = this.state.guides;
    return tempArray;

  }

  //מביא את כל המדריכים שבאתר משרד התיירות
  GetGuidesGOVFromSQL = () => {
    var data = {
      resource_id: '5f5afc43-639a-4216-8286-d146a8e048fe', // the resource id
    };
    let listGov = [];
    $.ajax({
      url: 'https://data.gov.il/api/action/datastore_search',
      data: data,
      dataType: 'json',
      success: this.AddGovList
    });
  }
  //מוסיף את רשימת המדריכים מאתר משרד התיירות
  AddGovList = (data) => {
    console.log(data);
    this.setState({
      GuidesFromGovIL: data.result.records
    })
  }

  //בודק אם מדריך שהכניס מספר אישי קיים באתר משרד התירות
  checkIfGuideExistInGovilList = (licenseNum) => {
    let ifExist = false;
    console.log(licenseNum);
    for (let i = 0; i < this.state.GuidesFromGovIL.length; i++) {
      const element = this.state.GuidesFromGovIL[i];
      let num = element.License_Number;
      if (num == licenseNum) {
        ifExist = true;
      }
    }
    if (ifExist) {
      this.AddGuideFromGovIL(licenseNum);
    }
    else {
      alert("Error, You Not In Gov IL");
    }
  }

  //מוסיף מדריך מאתר משרד התיירות
  AddGuideFromGovIL = (licenseNum) => {
    let FirstName;
    let LastName = "";
    for (let i = 0; i < this.state.GuidesFromGovIL.length; i++) {
      const element = this.state.GuidesFromGovIL[i];
      let num = element.License_Number;
      if (num == licenseNum) {
        let License = element.License_Number;
        let fullname = JSON.stringify(element.Name);
        if (fullname !== "") {
          fullname = fullname.split('"');
          fullname = fullname[1];
          fullname = fullname.split(" ");
          if (fullname.length>2) {
            for (let i = 0; i < fullname.length; i++) {
              const element = fullname[i];
              if (i == fullname.length-1) {
                FirstName = element;
              }
              else if(i == fullname.length-2){
                LastName += element; 
              }
              else{
                LastName += element + " "; 

              }
              
            }
          }
          else if(fullname.length == 2){
           FirstName = fullname[1];
           LastName = fullname[0];
          }
          else{
            LastName = "Guide";
            FirstName = fullname[0];
          }
          
          console.log(FirstName);
          console.log(LastName);
          console.log(fullname);
        }
       let Email;
        if (element.Email !== "") {
           Email = JSON.stringify(element.Email);
          Email = Email.split(">");
          Email = Email[1].split("<");
          Email = Email[0];
        }
        else{
          Email = "";
        }
       
        let Phone = JSON.stringify(element.Phone);
        if (Phone !== "") {
          Phone = Phone.split(">");
          Phone = Phone[1].split("<");
          Phone = Phone[0].split("-");
          let PhoneTemp = "";
          for (let i = 0; i < Phone.length; i++) {
            const element = Phone[i];
            PhoneTemp += element;
          }
          Phone = PhoneTemp;
          let Phone1 = Phone.slice(0,4);
          let Phone2 = Phone.slice(4,7);
          let Phone3 = Phone.slice(7,10);
          let Phone4 = Phone.slice(10,13);
          Phone = Phone1 + " " + Phone2 + " " + Phone3 + " " + Phone4;
        }
      
        let gLanguages = JSON.stringify(element.Language);
        gLanguages = gLanguages.split(";");
        let Languages = [];
        for (let i = 0; i < gLanguages.length; i++) {
          let element = gLanguages[i];
          if (i == gLanguages.length - 1) {
            element = element.split('"');
            Languages.push(element[0]);
          }
          else if(i == 0){
            element = element.split('"');
            Languages.push(element[1]);
          }
          else {
            Languages.push(element);
          }
        }
        let SignDate = new Date();
        let signDateCorrect = SignDate.toLocaleDateString('en-US');

        let Guide = {
          Email: Email,
          FirstName: FirstName,
          LastName: LastName,
          Phone: Phone,
          License: licenseNum,
          SignDate: signDateCorrect
        }
        this.PostGuideToSQLFromGovIL(Guide, Languages);
      }
    }
  }

//מכניס מדריך מאתר משרד התיירות
  PostGuideToSQLFromGovIL = (Guide, Languages) => {
    //pay attention case sensitive!!!! should be exactly as the prop in C#!
    fetch(this.apiUrl + 'Guide/PostGuideFromGovIL', {
      method: 'POST',
      body: JSON.stringify(Guide),
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
            tempGuide: result
          })
          this.AddLanguages(this.state.tempGuide, Languages);
        },
        (error) => {
          console.log("err post=", error);
        });
    console.log(this.state.tempGuide);
  }

//מוסיף שפות מאתר התיירות למדריך
  AddLanguages = (guide, languages) => {
    console.log(languages);
    console.log(guide);
let listGuideLang = [];
    for (let i = 0; i < languages.length; i++) {
      const element = languages[i];
      for (let j = 0; j < this.state.LanguagesList.length; j++) {
        const elementFromState = this.state.LanguagesList[j];
        if (elementFromState.LNameEnglish === element) {
          let Guide_Language = {
            Guide_Code:guide.gCode,
            Language_Code:elementFromState.LCode
          }
          listGuideLang.push(Guide_Language);
        }
      }
    }
    console.log(listGuideLang);
this.PostLanguagesGuide(listGuideLang);
  }
  PostLanguagesGuide=(guideLanguages)=>{
    fetch(this.apiUrl + '/Guide/PostGuideLanguage', {
      method: 'POST',
      body: JSON.stringify(guideLanguages),
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
              this.MoveToHomePage(this.state.tempGuide);
          },
          (error) => {
              console.log("err post=", error);
          });
  }
  GetAllLanguages=()=>{
    fetch(this.apiUrl + "Language", {
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
            LanguagesList: result
          })
          console.log(result);
        },
        (error) => {
          console.log("err post=", error);
        });
  }

  //לוקח את הפרטים מעמוד ההרשמה ובודק האם האימייל נמצא במסד נתונים- אם לא נמצא יוסיף אותו למסד נתונים
  PostGuideToCheckSignUp = (userDetails) => {
    console.log("enter")
    //pay attention case sensitive!!!! should be exactly as the prop in C#!
    fetch(this.apiUrl + 'Guide/PostToCheck', {
      method: 'POST',
      body: JSON.stringify({
        Email: userDetails.Email,
        PasswordGuide: userDetails.Password,
        ProfilePic: userDetails.picture,
        FirstName: userDetails.FirstName,
        LastName: userDetails.LastName,
        SignDate: userDetails.SignDate,
        Gender: userDetails.Gender,
        BirthDay: userDetails.Birthday
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
            tempGuide: result,


          })
          this.MoveToHomePage(this.state.tempGuide);
        },
        (error) => {
          console.log("err post=", error);
        });
  }

  //לוקח את פרטי המשתמש מהעמוד ההתחברות(אימייל וסיסמא) ובודק האם נמצא במסד נתונים
  PostGuideToCheckSignIn = (signInUser) => {
    //pay attention case sensitive!!!! should be exactly as the prop in C#!
    fetch(this.apiUrl + 'Guide/PostToCheck', {
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
            tempGuide: result
          })
          this.MoveToHomePage(this.state.tempGuide);
        },
        (error) => {
          console.log("err post=", error);
        });
    console.log(this.state.tempGuide);
  }

  //  במידה וההתחברות הצליחה, המשתמש יועבר לעמוד הבית.
  MoveToHomePage = (e) => {
    console.log(e)
    if (e !== null) {
      localStorage.setItem('Guide', JSON.stringify(e))
      this.props.history.push({
        pathname: '/home/',
        state: { GuideTemp: e }
      });
    }
    else {
      alert("incorrect login information");
    }
  }

  //מביא את כל התחביבים שקיימים במסד הנתונים
  GetAllHobbies = () => {
    fetch(this.apiUrl + "Hobby", {
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
          this.OrgenizeHobbies(result);
        },
        (error) => {
          console.log("err post=", error);
        });
  }

  //מסדר את התחביבים בגייסון הכולל מספר זיהוי,שם ותמונה
  OrgenizeHobbies = (result) => {
    let temp = [];
    console.log(result);
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      let hobby = {
        id: element.HCode,
        name: element.HName,
        image: element.Picture
      }
      temp.push(hobby);
    }
    this.setState({
      AllHobbies: temp
    })
  }

  //מביא את כל ההתמחויות הקיימות במסד נתונים
  GetAllExpertises = () => {
    fetch(this.apiUrl + "Expertise", {
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
          this.OrgenizeExpertises(result);
        },
        (error) => {
          console.log("err post=", error);
        });
  }

  //מסדר את כל ההתמחויות בקובץ גייסון הכולל מספר זיהוי, שם ותמונה
  OrgenizeExpertises = (result) => {
    let temp = [];
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      let expertise = {
        id: element.Code,
        name: element.NameE,
        image: element.Picture
      }
      temp.push(expertise);
    }
    this.setState({
      AllExpertises: temp
    })
  }

  //מביא את כל האזורים הקיימים במסד נתונים
  GetAllAreas = () => {
    fetch(this.apiUrl + "Area", {
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
            AllAreas: result
          })
        },
        (error) => {
          console.log("err post=", error);
        });
  }

  render() {
    return (
      <div className="app">
        <Switch>
          <Route path="/upload" >
            <FileUpload local={this.state.local} />
          </Route>
          <Route path="/check" >
            <Check
              color="#008ae6"
              type="spin" />
          </Route>
          <Route exact path="/reset" >
            <ResetPassword local={this.state.local} />
          </Route>
          <Route exact path="/" >
            <SignIn GovList={this.checkIfGuideExistInGovilList} checkSignIn={this.PostGuideToCheckSignIn} checkIfexistUsers={this.PostGuideToCheckSignUp} local={this.state.local} />
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
              hoverBackground="#A2D4FF"
              linkColor="#1988ff"
            />
            <Home local={this.state.local} ReloadHobbies={this.GetAllHobbies} Allusers={this.state.guides} AllExpertises={this.state.AllExpertises} AllHobbies={this.state.AllHobbies} AllAreas={this.state.AllAreas} navbarOpenCheck={this.state.navbarCheckOpen} GetGuidesFromSQL={this.GetGuidesFromSQL} />
            <MainFooter className="hidden-xs" />
          </Route>
          <Route path="/chat">
            <ResponsiveNavigation
              navbarCheckFunc={this.navbarCheck}
              navLinks={navLinks}
              logo={menu}
              background="#fff"
              hoverBackground="#A2D4FF"
              linkColor="#1988ff"
            />
            <Chat navbarOpenCheck={this.state.navbarCheckOpen} />
            <MainFooter className="hidden-xs" />
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

