import React, { Component } from 'react'
import '../Css/signUpNavBar.css';
import { withRouter } from 'react-router-dom';
import ProfileDetails from "../Screens/ProfileDetails.jsx";
import Area from '../Screens/Area';
import ProfileCard from '../Components/ProfileCard.jsx';
import NavbarProfile from '../Components/NavbarProfile';
import Languages from '../Screens/Languages';
import '../Css/Home.css';
import Hobbies from '../Screens/Hobbies';

const Guide = JSON.parse(localStorage.getItem('Guide'));


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            namePage: 'Profile Details',
            navbar: this.props.navbarOpenCheck,
            allUsers: this.props.Allusers,
            Guide: [],
            GuideLanguages: [],
            GuideAreas:[],
            AllAreas:[]
        };
        let local = true;
        this.apiUrl = 'http://localhost:49948/api/Guide';
        if (!local) {
            this.apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Guide';
        }

    }
   componentDidUpdate(PrevProps,state){
    if (PrevProps.Allusers != this.props.Allusers) {

        this.setState({
            allUsers:this.props.Allusers
        })
        let tempArray = this.props.Allusers;
        let TempGuide;
        for (let i = 0; i < tempArray.length; i++) {
          const element = tempArray[i];
          if (element.Email === Guide.Email) {
              TempGuide = element;
          }
      }
      this.GetLanguagesGuideList(TempGuide);
    this.GetAreasGuideList(TempGuide);
      this.GetAllAreas();
    }
   }
    componentDidMount() {
        console.log(this.props.Allusers);
      //const Guide = JSON.parse(localStorage.getItem('Guide'));
      let TempGuide;
      let tempArray = this.props.Allusers;
      console.log(tempArray);
      for (let i = 0; i < tempArray.length; i++) {
          const element = tempArray[i];
          if (element.Email === Guide.Email) {
              TempGuide = element;
          }
      }
      this.setState({
          allUsers: tempArray
      });
    this.GetLanguagesGuideList(TempGuide);
    this.GetAreasGuideList(TempGuide);
      this.GetAllAreas();
    }

    GetGuides = ()=>{
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
                this.setState({ allUsers: result })
              },
              (error) => {
                console.log("err post=", error);
              });
              let tempArray = this.state.allUsers;
              return tempArray;
    }
    GetAllAreas =() =>{
        fetch("http://localhost:49948/api/Area", {
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
                     AllAreas:result
                 })
                },
                (error) => {
                  console.log("err post=", error);
                });

    }

    ClickPage2 = (e) => {
        let tempArray = this.props.GetGuidesFromSQL();
        this.setState({
            allUsers: tempArray
        })
        this.setState({
            namePage: e
        });
    }
    funcGoogleFacebook = () => {
        const Guide = JSON.parse(localStorage.getItem('Guide'));
        return <ProfileCard email={Guide.Email} Allusers={this.state.allUsers} GetGuidesFromSQL={this.props.GetGuidesFromSQL} />
    }

    func1 = () => {
        const namePage2 = this.state.namePage;
        const Guide = JSON.parse(localStorage.getItem('Guide'));
        if (namePage2 === "Profile Details") {
            return <ProfileDetails GetGuidesFromSQL={this.props.GetGuidesFromSQL} Allusers={this.state.allUsers} GuideDetails={Guide} />
        }
        else if (namePage2 === "Area Knowledge") {
            return <Area guideListAreas={this.state.GuideAreas} GuideDetails={Guide} AreasArray = {this.state.AllAreas}/>
        }
        else if (namePage2 === "Languages"){
            return <Languages guideListLanguages={this.state.GuideLanguages} GuideDetails={Guide} />
        }
        else if (namePage2 === "Hobbies"){
            return <Hobbies GuideDetails={Guide} />
        }
    }

    GetAreasGuideList=(TempGuide)=>{
        fetch("http://localhost:49948/api/Area/" + TempGuide.gCode, {
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
                    this.setState({ GuideAreas: result })
                },
                (error) => {
                  console.log("err post=", error);
                });
                console.log(this.state.GuideAreas)
    }


    GetLanguagesGuideList = (TempGuide) => {
        fetch("http://localhost:49948/api/Language/" + TempGuide.gCode, {
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
                            this.setState({ GuideLanguages: result })
                },
                (error) => {
                  console.log("err post=", error);
                });
                console.log(this.state.GuideLanguages)
    }

    render() {
        return (
            <div id={this.props.navbarOpenCheck} className="container-fluid HomePageContainer">
                <NavbarProfile ClickPage2={this.ClickPage2} />
                <div className="row homePage">
                    <div className="cardDiv col-lg-4 col-md-2 hidden-xs hidden-sm">
                        {this.funcGoogleFacebook()}
                    </div>
                    <div className="col-lg-8 col-md-10 col-sm-12 ">
                    {this.func1()}
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Home)