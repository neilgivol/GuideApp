import React, { Component } from 'react';
import '../Css/signUpNavBar.css';
import { Switch, Route, Link, withRouter } from 'react-router-dom';
class NavbarProfile extends Component {
    state={
        name:this.props.userNamePage
    }
    ClickPage = (e) =>{
        const newName = e;
        this.setState({
            name: e.target.text
        });
        this.props.ClickPage2(e.target.text);
    }
    render() {
        return (
            <ul className="ulSign">
                        <li><Link  onClick={this.ClickPage} to="/home">Profile Details</Link></li>
                        <li><Link onClick={this.ClickPage} to="/home">Area Knowledge</Link></li>
                        <li><Link onClick={this.ClickPage} to="/home">Languages</Link></li>
                        <li><Link onClick={this.ClickPage} to="/home">Expertise</Link></li>
                        <li><Link onClick={this.ClickPage} to="/home">Hobbies</Link></li>
                    </ul>
        );
    }
}

export default NavbarProfile;