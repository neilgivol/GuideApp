import React, { Component } from 'react';
import '../Css/signUpNavBar.css';
import { Switch, Route, Link, withRouter } from 'react-router-dom';
class NavbarProfile extends Component {
    state = {
        name: this.props.userNamePage,
        classActiveArea: "noActive",
        classActiveDetails: "active",
        classActiveLang: "noActive",
        classActiveExpetise: "noActive",
        classActiveHobbies: "noActive"
    }
    ClickPage = (e) => {
        const newName = e;
        this.setState({
            name: e.target.text
        });
        this.props.ClickPage2(e.target.text);
        if (e.target.text === "Profile Details") {
            this.setState({
                classActiveDetails: "active",
                classActiveArea: "noActive",
                classActiveLang: "noActive",
                classActiveExpetise: "noActive",
                classActiveHobbies: "noActive"
            })
        }
        else if (e.target.text === "Area Knowledge") {
            this.setState({
                classActiveArea: "active",
                classActiveDetails: "noActive",
                classActiveLang: "noActive",
                classActiveExpetise: "noActive",
                classActiveHobbies: "noActive"
            })
        }
        else if (e.target.text === "Languages") {
            this.setState({
                classActiveLang: "active",
                classActiveArea: "noActive",
                classActiveDetails: "noActive",
                classActiveExpetise: "noActive",
                classActiveHobbies: "noActive"
            })
        }
        else if (e.target.text === "Hobbies") {
            this.setState({
                classActiveLang: "noActive",
                classActiveArea: "noActive",
                classActiveDetails: "noActive",
                classActiveExpetise: "noActive",
                classActiveHobbies: "active"
            })
        }
        else if (e.target.text === "Expertise") {
            this.setState({
                classActiveLang: "noActive",
                classActiveArea: "noActive",
                classActiveDetails: "noActive",
                classActiveExpetise: "active",
                classActiveHobbies: "noActive"
            })
        }
    }
    render() {
        return (
            <ul className="ulSign">
                <li className={this.state.classActiveDetails}><Link onClick={this.ClickPage} to="/home">Profile Details</Link></li>
                <li className={this.state.classActiveArea}><Link onClick={this.ClickPage} to="/home">Area Knowledge</Link></li>
                <li className={this.state.classActiveLang}><Link onClick={this.ClickPage} to="/home">Languages</Link></li>
                <li className={this.state.classActiveExpetise}><Link onClick={this.ClickPage} to="/home">Expertise</Link></li>
                <li className={this.state.classActiveHobbies}><Link onClick={this.ClickPage} to="/home">Hobbies</Link></li>
            </ul>
        );
    }
}

export default NavbarProfile;