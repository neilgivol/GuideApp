// import React, { Component } from 'react'
// import firebase from '../services/firebase';
// import { Container } from 'shards-react';
// import { withRouter } from 'react-router-dom';
// import '../Css/Home.css';
// import "bootstrap/dist/css/bootstrap.min.css";
// import "shards-ui/dist/css/shards.min.css";
// import "../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
// import Chatbox2 from '../Components/ChatBox2';
// class ChatRealTime extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             message: ''
//         }
//     }

//     handleChange = e => {
//         this.setState({ [e.target.name]: e.target.value });
//     }

//     handleSubmit = e => {
//         e.preventDefault();
//         if (this.state.message !== '') {
//             const chatRef = firebase.database().ref('general');
//             const chat = {
//                 message: this.state.message,
//                 user: this.props.user.displayName,
//                 timestamp: new Date().getTime()
//             }

//             chatRef.push(chat);
//             this.setState({ message: '' });
//         }
//     }

//     render() {

//         return (
//             <Container fluid id={this.props.navbarOpenCheck} className="HomePageContainer" >
//                 <div className="home--container">
//                     <h1>Welcome to the chat!</h1>
//                     {this.props.user &&
//                         <div className="allow-chat">
//                             <form className="send-chat" onSubmit={this.handleSubmit}>
//                                 <input type="text" name="message" id="message" value={this.state.message} onChange={this.handleChange} placeholder='Leave a message...' />
//                             </form>

//                             <Chatbox2 />
//                         </div>
//                     }
//                     {!this.props.user &&
//                         <div className="disallow-chat">
//                         </div>
//                     }
//                 </div>
//             </Container>

//         )
//     }
// }

// export default withRouter(ChatRealTime);
