import React, { Component } from 'react'
import './WelcomeCard.css';
export default class WelcomeCard extends Component {
    constructor(props) {
        super(props);
        
    }
    
    render() {
        return (
            <div className="viewWelcomeBoard">
                <img
                    className="avatarWelcome"
                    src={this.props.currentUserPhoto}
                    alt=""
                />
                <span className="textTitleWelcome">Welcome {this.props.currentUserName}</span>
            </div>
        )
    }
}
