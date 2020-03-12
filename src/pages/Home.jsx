import React, { Component } from 'react'
import '../Css/signUpNavBar.css';
import { Switch, Route, Link, withRouter } from 'react-router-dom';
import { Card, ListGroup, ListGroupItem, Form, Button, Dropdown } from 'react-bootstrap';
import ProfileDetails from "../Screens/ProfileDetails.jsx";
import Area from '../Screens/Area';
import ProfileCard from '../Components/ProfileCard.jsx';
import NavbarProfile from '../Components/NavbarProfile';
import Languages from '../Screens/Languages';
import '../Css/Home.css';
class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            namePage: '',
                detailsGoogle:this.props.location.state.profileObj,
            facebookLogin:this.props.location.state.facebookLogin,
            googleLogin:this.props.location.state.googleLogin,
            picture:this.props.location.state.picture,
            firstName:this.props.location.state.firstName,
            lastName:this.props.location.state.lastName,
            userID:this.props.location.state.userID,
            email:this.props.location.state.email,
            navbar:this.props.navbarOpenCheck
            };
    }

    ClickPage2 = (e) =>{
        this.setState({
            namePage: e
        });
    }
    funcGoogleFacebook=()=>{
        if (this.state.facebookLogin) {
            return <ProfileCard picture={this.state.picture} firstName={this.state.firstName} lastName={this.state.lastName} email={this.state.email} facebookLogin = {this.state.facebookLogin}/>
        }
        else{
            return <ProfileCard details={this.state.detailsGoogle} facebookLogin = {this.state.facebookLogin}/>
        }
    }
 func1 = () =>{
    const namePage2 = this.state.namePage;
    if (namePage2 == "Profile Details") {
      return <ProfileDetails/>
    }
    else if(namePage2 == "Area Knowledge"){
        return <Area/>
    }
    else if(namePage2 == "Languages")
    return <Languages/>
 }

   
    render() {
        console.log(this.state.namePage);
   console.log()
        return (
            <div id={this.props.navbarOpenCheck} className="container">
                <NavbarProfile  ClickPage2 = {this.ClickPage2} />
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