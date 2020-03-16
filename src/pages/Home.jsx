import React, { Component } from 'react'
import '../Css/signUpNavBar.css';
import { withRouter } from 'react-router-dom';
import ProfileDetails from "../Screens/ProfileDetails.jsx";
import Area from '../Screens/Area';
import ProfileCard from '../Components/ProfileCard.jsx';
import NavbarProfile from '../Components/NavbarProfile';
import Languages from '../Screens/Languages';
import '../Css/Home.css';

const FacebookUser = JSON.parse(localStorage.getItem('FacebookUser'));
const GoogleUser = JSON.parse(localStorage.getItem('GoogleUser'));
const SignUpUser = JSON.parse(localStorage.getItem('SignUpUser'));
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            namePage: 'Profile Details',
            navbar: this.props.navbarOpenCheck,
            allUsers: this.props.Allusers,
            Guide: ""
        };
        let local = true;
        this.apiUrl = 'http://localhost:49948/api/Guide';
        if (!local) {
            this.apiUrl = '';
        }

    }
    componentWillMount() {
        let tempArray = this.props.GetGuidesFromSQL();
        this.setState({
            allUsers:tempArray
        }) 

        this.GetGuideDetails();
    }

    GetGuideDetails = () => {
        let logginUser = "";
        if (FacebookUser !== null) {
            for (let i = 0; i < this.state.allUsers.length; i++) {
                const element = this.state.allUsers[i];
                if (element.Email === FacebookUser.Email) {
                    logginUser = element;
                }
            }
        }
        else if (GoogleUser !== null) {
            for (let i = 0; i < this.state.allUsers.length; i++) {
                const element = this.state.allUsers[i];
                if (element.Email === GoogleUser.Email) {
                    logginUser = element;
                }
            }
        }
        else if (SignUpUser !== null) {
            for (let i = 0; i < this.state.allUsers.length; i++) {
                const element = this.state.allUsers[i];
                if (element.Email === SignUpUser.Email) {
                    logginUser = element;
                }
            }

        }
        console.log(logginUser);
        localStorage.setItem('Guide', JSON.stringify(logginUser));
        // localStorage.removeItem('FacebookUser');
        // localStorage.removeItem('GoogleUser');
        // localStorage.removeItem('SignUpUser');

    }


    ClickPage2 = (e) => {
        let tempArray = this.props.GetGuidesFromSQL();
      this.setState({
          allUsers:tempArray
      }) 
        this.setState({
            namePage: e
        });
    }
    funcGoogleFacebook = () => {
        const Guide = JSON.parse(localStorage.getItem('Guide'));
        // if (FacebookUser !== null) {
        //     return <ProfileCard guideDetails={Guide} Allusers={this.state.allUsers} GetGuidesFromSQL={this.props.GetGuidesFromSQL} />
        // }
        // else if (GoogleUser !== null) {
        //     return <ProfileCard guideDetails={Guide} Allusers={this.state.allUsers} GetGuidesFromSQL={this.props.GetGuidesFromSQL} />
        // }
        // else if (SignUpUser !== null) {
        //     return <ProfileCard guideDetails={Guide} Allusers={this.state.allUsers} GetGuidesFromSQL={this.props.GetGuidesFromSQL} />
        // }
        // else if (FacebookUser === null & GoogleUser === null & SignUpUser === null) {
        //     return <ProfileCard guideDetails={Guide} Allusers={this.state.allUsers} GetGuidesFromSQL={this.props.GetGuidesFromSQL} />

        // }
        return <ProfileCard email={Guide.Email} Allusers={this.state.allUsers} GetGuidesFromSQL={this.props.GetGuidesFromSQL} />

    }

    func1 = () => {
        const namePage2 = this.state.namePage;
        const Guide = JSON.parse(localStorage.getItem('Guide'));
        if (namePage2 === "Profile Details") {
            // if (FacebookUser !== null) {
            //     return <ProfileDetails GetGuidesFromSQL={this.props.GetGuidesFromSQL} Allusers={this.state.allUsers} email={FacebookUser.email} />
            // }
            // else if (GoogleUser !== null) {
            //     return <ProfileDetails GetGuidesFromSQL={this.props.GetGuidesFromSQL} Allusers={this.state.allUsers} email={GoogleUser.userDetails.email} />
            // }
            // else if (SignUpUser !== null) {
            //     return <ProfileDetails GetGuidesFromSQL={this.props.GetGuidesFromSQL} Allusers={this.state.allUsers} email={SignUpUser.email} />
            // }
            // else if (FacebookUser === null & GoogleUser === null & SignUpUser === null) {
            //     return <ProfileDetails GetGuidesFromSQL={this.props.GetGuidesFromSQL} Allusers={this.state.allUsers} email={Guide.Email} />
            // }
            return <ProfileDetails GetGuidesFromSQL={this.props.GetGuidesFromSQL} Allusers={this.state.allUsers} email={Guide.Email} />

        }
        else if (namePage2 === "Area Knowledge") {
            return <Area />
        }
        else if (namePage2 === "Languages")
            return <Languages />
    }


    render() {
        return (
            <div id={this.props.navbarOpenCheck} className="container-fluid HomePageContainer">
                <NavbarProfile ClickPage2={this.ClickPage2} />
                <div className="row homePage">
                    <div className="col-lg-4">
                        {this.funcGoogleFacebook()}
                    </div>
                    {this.func1()}
                </div>
            </div>
        )
    }
}

export default withRouter(Home)