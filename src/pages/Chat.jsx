import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import '.././Profile/Css/Home.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import '../Css/Chat.css';
import { Container } from "shards-react";
import ChatBox from '../Components/ChatBox';
import WelcomeCard from '../Components/WelcomeCard';
import profilePic from '../Img/Default-welcomer.png';
import ReactLoading from 'react-loading'
import {Button } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css'
import {myFirestore,myFirebase} from '../services/firebase'
//import images from '../Themes/Images'
//import './ChatBoard.css';
//import {AppString} from './../Const'
class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navbar: this.props.navbarOpenCheck,
            messages: [],
            Guide: this.props.Guide,
            currentPeerUser: null,
            displayedContactSwitchedNotification: [],
            discplayedContacts: [],
            isLoading: true,
            tourist:this.props.tourist,
            openToruist:false,
            local:this.props.local,
            OpenPhoneList:false,
            LanguagesListOrgenized:this.props.LanguagesListOrgenized,
            AllHobbies:this.props.AllHobbies,
            AllExpertises:this.props.AllExpertises,
            profileTourPic:"",
            classChatBoxPhone:"viewBoard",
            classListChat:"viewListUser phoneList"
        }
        this.currentUserIdchat = localStorage.getItem("idChat")
        this.currentUserDocumentId = localStorage.getItem('docId');
        // this.currentUserMessages = localStorage.getItem('Messages');
        this.onProfileClick = this.onProfileClick.bind(this);
        this.getListUser = this.getListUser.bind(this);
        this.renderListUser = this.renderListUser.bind(this);
        this.getClassnameforUserandNotification = this.getClassnameforUserandNotification.bind(this);
        this.notificationErase = this.notificationErase.bind(this);
        this.updaterenderList = this.updaterenderList.bind(this);
        this.notificationMessagesErase = [];
        this.searchUsers = [];
        this.currentUserMessages = [];
        let local = this.state.local;
        this.apiUrl = "http://localhost:49948/api/";
        if (!local) {
            this.apiUrl = "https://proj.ruppin.ac.il/bgroup10/PROD/api/";
        }
    }
    ConnectFirebase = async () => {
        await myFirebase.auth().signInWithEmailAndPassword(this.state.Guide.Email, this.state.Guide.PasswordGuide)
            .then(async result => {
                let user = result.user;
                if (user) {
                    await myFirestore.collection('users')
                        .where('id', "==", user.uid)
                        .get()
                        .then(function (querySnapshot) {
                            querySnapshot.forEach(function (doc) {
                                const currentdata = doc.data()
                                localStorage.setItem('docId', doc.id);
                                localStorage.setItem('idChat', currentdata.id);
                            })
                        })
                }
            })
    }
   
    componentDidMount() {
        let guideTemp = JSON.parse(localStorage.getItem('Guide'));
        this.setState({
            Guide: guideTemp
        })
        if (this.currentUserDocumentId !== null) {
            myFirebase.firestore().collection('users').doc(this.currentUserDocumentId).get()
                .then((doc) => {
                    doc.data().messages.map((item) => {
                        this.currentUserMessages.push({
                            notificationId: item.notificationId,
                            number: item.number
                        })
                    })
                    this.setState({
                        displayedContactSwitchedNotification: this.currentUserMessages
                    })

                })
            this.getListUser();
         
        }
        else {
            this.ConnectFirebase();
            if (this.currentUserDocumentId !== null) {
                myFirebase.firestore().collection('users').doc(this.currentUserDocumentId).get()
                    .then((doc) => {
                        doc.data().messages.map((item) => {
                            this.currentUserMessages.push({
                                notificationId: item.notificationId,
                                number: item.number
                            })
                        })
                        this.setState({
                            displayedContactSwitchedNotification: this.currentUserMessages
                        })
                    })
                this.getListUser();
            }
        }

    }
    getListUser = async () => {
        const result = await myFirebase.firestore().collection('users').get();
        if (result.docs.length > 0) {
            let listUsers = []
            listUsers = [...result.docs]
            listUsers.forEach((item, index) => {
                this.searchUsers.push({
                    key: index,
                    documentKey: item.id,
                    id: item.data().id,
                    email: item.data().email,
                    name: item.data().name,
                    messages: item.data().messages,
                    URL: item.data().URL,
                    type: item.data().type,
                    guideEmail: item.data().guideEmail

                })
            })
        }
        this.renderListUser();
    }

    getClassnameforUserandNotification = (itemId) => {
        let number = 0
        let className = ""
        let check = false;
        if (this.state.currentPeerUser && this.state.currentPeerUser.id === itemId) {
            className = 'viewWrapItemFocused'
        }
        else {
            this.state.displayedContactSwitchedNotification.forEach((item) => {
                if (item.notificationId.length > 0) {
                    if (item.notificationId === itemId) {
                        check = true
                        number = item.number
                    }
                }
            })
            if (check) {
                className = "viewWrapItemNotification"
            }
            else {
                className = "viewWrapItem"
            }
        }
        return className;
    }

    notificationErase = (itemId) => {
        this.state.displayedContactSwitchedNotification.forEach((el) => {
            if (el.notificationId.length > 0) {
                if (el.notificationId !== itemId) {
                    this.notificationMessagesErase.push({
                        notificationId: el.notificationId,
                        number: el.number
                    })
                }
            }
        })
        this.updaterenderList();
    }

    updaterenderList = () => {
        myFirebase.firestore().collection('users').doc(this.currentUserDocumentId).update(
            { messages: this.notificationMessagesErase }
        )
        this.setState({
            displayedContactSwitchedNotification: this.notificationMessagesErase
        })
    }
// && item.guideEmail === this.state.Guide.Email
    renderListUser = () => {
        if (this.searchUsers.length > 0) {
            let viewListUser = [];
            let classname = "";
            this.searchUsers.map((item) => {
                if (item.id !== this.currentUserIdchat && item.id !== undefined && item.type == "Tourist" && item.guideEmail === this.state.Guide.Email) {
                    this.GetAllTourists(item.email);
                    classname = this.getClassnameforUserandNotification(item.id);
                    viewListUser.push(
                        <button
                            id={item.key}
                            className={classname}
                            onClick={() => {
                                this.notificationErase(item.id)
                                this.setState({
                                    currentPeerUser: item,
                                    displayedContactSwitchedNotification: this.notificationMessagesErase,
                                    classChatBoxPhone:"viewBoard",
                                    classListChat:"viewListUser phoneList displayNone"
                                })
                                document.getElementById(item.key).style.backgroundColor = '#fff'
                                if (document.getElementById(item.key)) {
                                    document.getElementById(item.key).style.color = '#fff';
                                }
                            }}
                        >
                            <img
                                className="viewAvatarItem"
                                src={this.GetPic(item.URL)}
                                alt=""
                                placeholder=""
                            />
                            <div className="viewWrapContentItem">
                                <span className="textItem">
                                    Name: {item.name}
                                </span>
                            </div>
                            {classname === 'viewWrapItemNotification' ?
                                <div className="notificationpragraph">
                                    <p id={item.key} className="newmessages">New messages</p>
                                </div> : null}
                        </button>
                    )
                }
            })
            this.setState({
                discplayedContacts: viewListUser,
                isLoading: false
            })

            if (this.props.location.state !== undefined) {
                let arrayTemp = this.searchUsers;
              for (let i = 0; i < arrayTemp.length; i++) {
                  const element = arrayTemp[i];
                  if (element.email == this.props.location.state.userEmail) {
                      this.setState({currentPeerUser:element})
                  }
                  
              }
            }
            this.props.CheckMessagesNotifications()
        }
        else {
            console.log("No user is Present")
        }
    }

    GetPic = (item)=>{
        if (item == "" || item == null) {
            return profilePic
        }
        else{
            return item
        }
    // this.GetAllTourists(email);
    // console.log(this.state.tourist);
    // console.log(this.state.profileTourPic);
    // return this.state.profileTourPic

    }
    GetAllTourists = (email) => {
        fetch(this.apiUrl + "Tourist?email=" + email, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8"
            })
        })
            .then((res) => {
                return res.json();
            })
            .then(
                (result) => {
                    this.setState({
                        tourist: result
                    });
                    return result
                    //this.OrgenizeTouristDetails(result);
                },
                (error) => {
                    console.log("err post=", error);
                }
            );
    };
    OrgenizeTouristDetails = (tourist) => {
        tourist.HobbiesNames = [];
        tourist.ExpertisesNames = [];
        for (let i = 0; i < this.state.LanguagesListOrgenized.length; i++) {
            const element = this.state.LanguagesListOrgenized[i];
            if (element.id === tourist.LanguageCode) {
                let lang = element.label.split(" / ");
                tourist.Language = lang[0];
            }
        }
        for (let i = 0; i < tourist.Hobbies.length; i++) {
            const hobby = tourist.Hobbies[i];
            for (let j = 0; j < this.state.AllHobbies.length; j++) {
                const orgenizeHobby = this.state.AllHobbies[j];
                if (hobby === orgenizeHobby.id) {
                    tourist.HobbiesNames.push(orgenizeHobby);
                }
            }
        }
        for (let i = 0; i < tourist.Expertises.length; i++) {
            const expertise = tourist.Expertises[i];
            for (let j = 0; j < this.state.AllExpertises.length; j++) {
                const orgenizeExpertise = this.state.AllExpertises[j];
                if (expertise === orgenizeExpertise.id) {
                    tourist.ExpertisesNames.push(orgenizeExpertise);
                }
            }
        }
        this.setState({
            tourist: tourist
        });
        this.checkIfExistProfilePic(tourist);

    };
    checkIfExistProfilePic=(tourist)=>{
        let pictureTourist
        if (tourist.ProfilePic == null) {
            pictureTourist = profilePic
            
        }
        else{
            pictureTourist = tourist.ProfilePic
        }
        this.setState({
            profileTourPic:pictureTourist
        })
    }


    componentWillMount() {

    }


    onProfileClick = () => {
        this.setState({
            openToruist:!this.state.openToruist,
            OpenPhoneList:false
        })
        console.log(this.state.openToruist)
    }
    openNavbarPhone = ()=>{
this.setState({
    OpenPhoneList:!this.state.OpenPhoneList,
    classChatBoxPhone:"displayNone",
    classListChat:"viewListUser phoneList"
})
    }


    render() {
        return (
            <Container fluid id={this.props.navbarOpenCheck} className="HomePageContainer" >
                <div className="root">
                    <div className="body hidden-sm hidden-xs">
                        <div className="viewListUser">
                            <div className="profileviewleftside">
                                <img
                                    className="ProfilePicture"
                                    alt=""
                                    src={this.state.Guide.ProfilePic}
                                onClick={this.onProfileClick}
                                />
                            </div>
                            {this.state.discplayedContacts}
                        </div>
                        <div className="viewBoard">
                            {this.state.currentPeerUser ? (
                                <ChatBox AllExpertises={this.props.AllExpertises} AllHobbies={this.props.AllHobbies} LanguagesListOrgenized={this.props.LanguagesListOrgenized} local={this.props.local} currentPeerUser={this.state.currentPeerUser} showToast={this.props.showToast} Guide={this.state.Guide} navbarOpenCheck={this.state.navbar} />) : (<WelcomeCard currentUserName={this.state.Guide.FirstName}
                                    currentUserPhoto={this.state.Guide.ProfilePic}
                                />
                                )}
                        </div>
                    </div>
                  
                    <div className="body hidden-md hidden-lg hidden-xl phoneBody">
                    <Button className="primary col-xs-2 navprovilePhone" onClick={this.openNavbarPhone} className="menuPhone chatBtnList hidden-xl hidden-lg hidden-md">
            <i class="fas fa-bars"></i>
            </Button>
            {this.state.OpenPhoneList ?  <div className={this.state.classListChat}>
                            {this.state.discplayedContacts}
                        </div> : null}
            <div className={this.state.classChatBoxPhone}>
                            {this.state.currentPeerUser ? (
                                <ChatBox AllExpertises={this.props.AllExpertises} AllHobbies={this.props.AllHobbies} LanguagesListOrgenized={this.props.LanguagesListOrgenized} local={this.props.local} currentPeerUser={this.state.currentPeerUser} showToast={this.props.showToast} Guide={this.state.Guide} navbarOpenCheck={this.state.navbar} />) : (<WelcomeCard currentUserName={this.state.Guide.FirstName}
                                    currentUserPhoto={this.state.Guide.ProfilePic}
                                />
                                )}
                        </div>
                    </div>
                    {/* Loading */}
                    {this.state.isLoading ? (
                        <div className="viewLoading">
                            <ReactLoading
                                type={'spin'}
                                color={'#203152'}
                                height={'3%'}
                                width={'3%'}
                            />
                        </div>
                    ) : null}
                </div>
            </Container>
        )
    }
}

export default withRouter(Chat)