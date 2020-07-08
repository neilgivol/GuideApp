import React, { Component,useState } from 'react'
import { withRouter } from 'react-router-dom';
import ProfileDetails from "../Profile/ProfileDetails.jsx";
import ProfileCard from '../Profile/Components/ProfileCard.jsx';
import NavbarProfile from '../Profile/Components/NavbarProfile';
import Languages from '../Profile/Languages';
import Hobbies from '../Profile/Hobbies';
import Expertise from '../Profile/Expertise';
import facebook from '../Img/facebook.png';
import twitter from '../Img/twitter.png';
import website from '../Img/website.png';
import linkdin from '../Img/linkedin.png';
import instegram from '../Img/The_Instagram_Logo.jpg';
import ReactLoading from 'react-loading';
import { Container, Row, Col } from "shards-react";
import {myFirestore } from '../services/firebase'
import TouristProfile from '../Components/TouristProfile';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Modal from 'react-modal';
import { Button } from 'react-bootstrap';
import '../Profile/Css/signUpNavBar.css';
import '../Profile/Css/Home.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import first from '../Img/profileDetails.jpeg';
import second from '../Img/language.jpeg';
import three from '../Img/expertise.jpeg';

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      marginTop           : '40px',
      marginBottom           : '40px',
      transform             : 'translate(-50%, -50%)',
      height: '570px',
        width:'1000px'
    }
  };
  
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            namePage: 'Profile Details',
            docId:"",
            idChat:"",
            local: this.props.local,
            navbar: this.props.navbarOpenCheck,
            Guide: '',
            GuideLanguages: [],
            GuideAreas: [],
            GuideHobbies: [],
            GuideExpertises: [],
            AllAreas: this.props.AllAreas,
            AllHobbies: this.props.AllHobbies,
            AllExpertises: this.props.AllExpertises,
            AllLanguages: this.props.LanguagesListOrgenized,
            linksfromSQL: [],
            isOpenTouristProfile: false,
            tourist: "",
            tutorialExpertises: false,
            tutorialStart: this.props.openTutorial,
            tutorialHobbies: false,
            tutorialTrip: false,
            fullLinks: [],
            isLoading: true,
            showRequest: false,
            listOfTouristsGuide: [],
            requestTouristEmails: [],
            notificationsMessages:[],
            options: [
                {
                    id: 0,
                    name: 'Select…',
                    value: null,
                    label: null
                },
                {
                    id: 1,
                    name: 'Instagram',
                    value: 'Instagram',
                    label: <div><img alt="" className="imageicons" src={instegram} /><span>Instagram</span></div>
                },
                {
                    id: 2,
                    name: 'Facebook',
                    value: 'Facebook',
                    label: <div><img alt="" className="imageicons" src={facebook} /><span>Facebook</span></div>
                },
                {
                    id: 3,
                    name: 'Twitter',
                    value: 'Twitter',
                    label: <div><img alt="" className="imageicons" src={twitter} /><span>Twitter</span></div>
                },
                {
                    id: 4,
                    name: 'Linkdin',
                    value: 'Linkdin',
                    label: <div><img alt="" className="imageicons" src={linkdin} /><span>Linkdin</span></div>
                },
                {
                    id: 5,
                    name: 'Website',
                    value: 'Website',
                    label: <div><img alt="" className="imageicons" src={website} /><span>Website</span></div>
                },
            ],
        };
        let local = this.state.local;
        this.apiUrl = 'http://localhost:49948/api/';
        if (!local) {
            this.apiUrl = 'https://proj.ruppin.ac.il/bgroup10/PROD/api/';
        }
        this.currentUserMessages = [];
    }
    componentDidUpdate(PrevProps) {
        if (PrevProps.AllExpertises !== this.props.AllExpertises) {
            this.props.ReloadHobbies();
            this.setState({
                AllExpertises: this.props.AllExpertises
            })
        }
        if (PrevProps.AllHobbies !== this.props.AllHobbies) {
            this.setState({
                AllHobbies: this.props.AllHobbies
            })
        }
        if (PrevProps.AllAreas !== this.props.AllAreas) {
            this.setState({
                AllAreas: this.props.AllAreas
            })
        }
    }
    componentWillMount() {
        const Guidetemp = JSON.parse(localStorage.getItem('Guide'));
        if (this.props.location.state === undefined) {
            let idChat = localStorage.getItem('idChat');
            let docId = localStorage.getItem('docId');
            this.setState({
                Guide: Guidetemp,
                idChat:idChat,
                docId:docId
            })
            //this.ConnectFirebase(Guidetemp);
        }
        else {
            this.setState({
                Guide: this.props.location.state.GuideTemp,
                idChat:this.props.location.state.idChat,
                docId:this.props.location.state.docId
            })
            //this.ConnectFirebase(this.props.location.state.GuideTemp);
        }
    }
    componentDidMount() {
        this.setState({
            isLoading: true
        })
        this.CheckMessagesNotifications();
        this.GetAllTouristsGuide();
        this.CheckRequests();
        //this.ConnectFirebase();
        this.GetHobbiesGuideList(this.state.Guide);
        this.GetLanguagesGuideList(this.state.Guide);
        //this.GetAreasGuideList(this.state.Guide);
        this.GetExpertisesGuides(this.state.Guide);
        this.getLinksFromSQL(this.state.Guide);
        this.setState({
            isLoading: false,
           // tutorialStart: true
        })

        console.log(new Date().toLocaleDateString())
    }

  

    //מציג הקדמה לאפליקציה
    FirstEnter = () => {
        return (
            <div>
            <Modal
             isOpen={true}
          //onAfterOpen={afterOpenModal}
          //onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
            >
                <div>
                    <img className="imageDiv" src={first} />
                </div>
                <div className="buttonsTutorial">
                    <Button onClick={() => { this.setState({ tutorialStart: false });this.props.QuestionFunc(false) }} variant="danger" autoFocus> Skip</Button>
                    <Button onClick={() => { this.setState({ tutorialStart: false, tutorialExpertises: true }) }} variant="primary" autoFocus>Next</Button>
                          </div>
            </Modal>
            </div>
            )
    }

    //הקדמה התמחויות ותחביבים
    nextToExper = () => {
        return <div>
           <Modal
             isOpen={true}
          //onAfterOpen={afterOpenModal}
          //onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
            >
                <div>
                <img className="imageDiv" src={second} />
                </div>
                <div className="buttonsTutorial">
                    <Button onClick={() => { this.setState({ tutorialExpertises: false }) }} variant="danger" autoFocus> Skip</Button>
                    <Button onClick={() => { this.setState({ tutorialExpertises: false, tutorialTrip: true }) }} variant="primary" autoFocus>Next</Button>
                </div>
            </Modal>
        </div>
    }

    //הקדמה התמחויות ותחביבים
    nextToBuildTrip = () => {
        return <div>
            <Modal
             isOpen={true}
          //onAfterOpen={afterOpenModal}
          //onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
            >
                    <div>
                    <img className="imageDiv" src={three} />
                </div>
                <div className="buttonsTutorial">
                    {/* <Button onClick={() => {this.setState({tutorialTrip:false})}} variant="danger" autoFocus> Skip</Button> */}
                    <Button onClick={() => { this.setState({ tutorialTrip: false });this.props.QuestionFunc(false) }} variant="primary" autoFocus>Finish</Button>
                </div>
            </Modal>
        </div>
    }

    CheckMessagesNotifications=()=>{
        let DocumentIdUser = this.state.docId;
        let messagesNotificationUser = [];
        if (localStorage.getItem('docId')) {
            DocumentIdUser = localStorage.getItem('docId');
            myFirestore.collection('users').doc(DocumentIdUser).get()
            .then((docRef) => {
                messagesNotificationUser = docRef.data().messages;
               this.orgenizeNotifications(messagesNotificationUser);
            })
        }
    }

    orgenizeNotifications=(notifications)=>{
        console.log(notifications);
        let arr =[];
        let users = [];
        if (notifications.length>0) {
            notifications.map(item=>arr.push(item.notificationId));
            for (let i = 0; i < arr.length; i++) {
                const documentId = arr[i];
                  myFirestore.collection('users')
                     .where('id', "==", documentId)
                     .get()
                     .then(function (querySnapshot) {
                         querySnapshot.forEach(function (doc) {
                           users.push(doc.data());
                         })
                         console.log(users)
                     })
                     .then((data)=>{
                         this.setState({
                             notificationsMessages:users
                         })
                         this.props.numOfNotifications(users);
                     })
            }
        }
        else{
            this.props.numOfNotifications(0);

        }
      
    }
   
    //בודק אם יש בקשות חברות חדשות
    CheckRequests = () => {
        fetch(this.apiUrl + "BuildTrip/GetRequests?email=" + this.state.Guide.Email, {
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
                    this.ChandeRequest(result);
                },
                (error) => {
                    console.log("err post=", error);
                }
            );
    }

    //מציג את בקשות החברות החדשות
    ShowRequestsAlert = () => {
        for (let i = 0; i < this.state.requestTouristEmails.length; i++) {
            const element = this.state.requestTouristEmails[i];
            return <div>
                <Dialog
                    open={true}
                    onClose={false}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"You Have Request Alert From " + element}</DialogTitle>
                    <DialogContent>
                        {/* <DialogContentText id="alert-dialog-description">
                        by clicking yes your picture will be changed
          </DialogContentText> */}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { this.showProfileTour(element) }} variant="info">
                            Show Profile
          </Button>
                        <Button onClick={() => { this.DeclineChat(element) }} variant="danger" autoFocus>
                            Decline
          </Button>
                        <Button onClick={() => { this.AcceptChat(element) }} variant="primary" autoFocus>
                            Accept
          </Button>
                    </DialogActions>
                </Dialog>
            </div>
        }

    }

    ///מציג פרופיל תייר
    showProfileTour = (email) => {
        for (let i = 0; i < this.state.listOfTouristsGuide.length; i++) {
            const element = this.state.listOfTouristsGuide[i];
            if (element.Email == email) {
                this.setState({
                    tourist: element,
                    showRequest: false,
                    isOpenTouristProfile: true
                })
            }
        }
    }

    //מציג בקשות חדשות
    ChandeRequest = (res) => {
        let touristDetails = '';
        let ArrayTouristRequest = [];
        this.setState({
            showRequest: false
        })
        if (res !== null) {
            for (let i = 0; i < res.length; i++) {
                const element = res[i];
                if (element.Status == 'send request') {
                    ArrayTouristRequest.push(element.TouristEmail)
                    for (let j = 0; j < this.state.listOfTouristsGuide.length; j++) {
                        const tourist = this.state.listOfTouristsGuide[j];
                        if (tourist.Email == element.TouristEmail) {
                            touristDetails = tourist;
                        }
                    }
                    this.setState({
                        requestTouristEmails: ArrayTouristRequest,
                        showRequest: true
                    })
                }
                else if (element.Status == 'Start Chat' || element.Status == 'Decline Chat') {
                    // this.setState({
                    //     showRequest:false
                    // })

                }
            }
        }
        else {
            this.setState({
                showRequest: false
            })
        }
    }

    //מאשר בקשת חברות
    AcceptChat = (element) => {
        fetch(this.apiUrl + 'BuildTrip', {
            method: 'PUT',
            body: JSON.stringify({
                TouristEmail: element,
                GuideEmail: this.state.Guide.Email,
                Status: 'Accept Request'
            }),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
            })
        })
            .then(res => {
                return res.json()
            })
            .then(
                (result) => {
                   // this.SendNotificationStartChat(element);
                    this.ChandeRequest(result);
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

    //לא מאשר בקשת חברות
    DeclineChat = (element) => {
        fetch(this.apiUrl + 'BuildTrip', {
            method: 'PUT',
            body: JSON.stringify({
                TouristEmail: element,
                GuideEmail: this.state.Guide.Email,
                Status: 'Decline Chat'
            }),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
            })
        })
            .then(res => {
                return res.json()
            })
            .then(
                (result) => {
                   // this.SendNotificationDeclineChat(element);
                    this.ChandeRequest(result);
                },
                (error) => {
                    console.log("err post=", error);
                });
        this.setState({ showRequest: false })
    }

    //שולח פוש לתייר לאישור בקשה
    SendNotificationStartChat = (touristEmail) => {
        let GuideChatId = localStorage.getItem('idChat');
        let guide = {
            chatId: GuideChatId,
            Email: this.state.Guide.Email,
            TouristEmail: touristEmail
        }
        let token = "";
        for (let i = 0; i < this.state.listOfTouristsGuide.length; i++) {
            const element = this.state.listOfTouristsGuide[i];
            if (element.Email == touristEmail) {
                token = element.Token;
            }
        }
        if (token !== null) {
        }
        let message = {
            to: token,
            title: 'Accept Request',
            body: this.state.Guide.Email + ' Accept your request',
            data: { path: "myProfile", info: JSON.stringify(guide) }
        }

        fetch(this.apiUrl + 'Tourist/Push', {
            method: 'POST',
            body: JSON.stringify(message),
            headers: new Headers({
                "Content-type": "application/json; charset=UTF-8", 'Accept-encoding': 'gzip, deflate' //very important to add the 'charset=UTF-8'!!!!
            })
        })
            .then((res) => {
                return res.json();
            })
            .then(
                (result) => {
                    console.log(result);
                },
                (error) => {
                    console.log("err post=", error);
                }
            );
    }

    //שולח פוש לתייר לביטול בקשה
    SendNotificationDeclineChat = (touristEmail) => {
        let GuideChatId = localStorage.getItem('idChat');
        let guide = {
            chatId: GuideChatId,
            Email: this.state.Guide.Email
        }
        let token = "";
        for (let i = 0; i < this.state.listOfTouristsGuide.length; i++) {
            const element = this.state.listOfTouristsGuide[i];
            if (element.Email == touristEmail) {
                token = element.Token;
            }
        }
        if (token !== null) {
        }
        let message = {
            to: token,
            title: 'Decline Request',
            body: this.state.Guide.Email + ' Decline your request',
            data: { path: "Decline", info: JSON.stringify(guide) }
        }

        fetch(this.apiUrl + 'Tourist/Push', {
            method: 'POST',
            body: JSON.stringify(message),
            headers: new Headers({
                "Content-type": "application/json; charset=UTF-8", 'Accept-encoding': 'gzip, deflate' //very important to add the 'charset=UTF-8'!!!!
            })
        })
            .then((res) => {
                return res.json();
            })
            .then(
                (result) => {
                    console.log(result);
                },
                (error) => {
                    console.log("err post=", error);
                }
            );
    }

    ConnectFirebase = async (Guide) => {
        // const output = await myFirebase.auth().signInWithEmailAndPassword(Guide.Email, Guide.PasswordGuide)
        //     .then(async result => {
        //         let user = result.user;
        //         localStorage.setItem('idChat', user.uid);
        //         if (user) {
        //             await myFirestore.collection('users')
        //                 .where('id', "==", user.uid)
        //                 .get()
        //                 .then(function (querySnapshot) {
        //                     querySnapshot.forEach(function (doc) {
        //                         const currentdata = doc.data()
        //                         localStorage.setItem('docId', doc.id);
        //                         localStorage.setItem('idChat', currentdata.id);
        //                     })
        //                 })
        //         }
        //     })
    }


    //מביא את כל התיירים של המדריך
    GetAllTouristsGuide = () => {
        fetch(this.apiUrl + 'Guide_Tourist?email=' + this.state.Guide.Email, {
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
                        listOfTouristsGuide: result
                    });
                    this.orgenizeTouristsGuide(result)
                },
                (error) => {
                    console.log("err post=", error);
                }
            );
    }

    //מסדר תיירים
    orgenizeTouristsGuide = (res) => {
        for (let i = 0; i < res.length; i++) {
            const tourist = res[i];
            let HobbiesNames = [];
            let ExpertisesNames = [];
            for (let j = 0; j < tourist.Hobbies.length; j++) {
                const touristHobby = tourist.Hobbies[j];
                for (let h = 0; h < this.state.AllHobbies.length; h++) {
                    const hobby = this.state.AllHobbies[h];
                    if (hobby.id == touristHobby) {
                        HobbiesNames.push(hobby)
                    }
                }
            }
            for (let j = 0; j < tourist.Expertises.length; j++) {
                const touristExpertise = tourist.Expertises[j];
                for (let h = 0; h < this.state.AllExpertises.length; h++) {
                    const expertise = this.state.AllExpertises[h];
                    if (expertise.id == touristExpertise) {
                        ExpertisesNames.push(expertise)
                    }
                }
            }
            tourist.HobbiesNames = HobbiesNames;
            tourist.ExpertisesNames = ExpertisesNames;
        }
        this.setState({
            listOfTouristsGuide: res
        })
        localStorage.setItem('ListTourists', JSON.stringify(res));

    }

    //יציאה מפרופיל תייר
    ExitProfile = (res) => {
        if (res == 'close') {
            this.setState({
                isOpenTouristProfile: false
            })
            this.CheckRequests();
        }
    }

    //מביא את הלינקים של המדריך הספציפי
    getLinksFromSQL = (TempGuide) => {
        fetch(this.apiUrl + "Link/" + TempGuide.gCode, {
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
                        linksfromSQL: result
                    })
                    //שולח את הרשימה לפונקציה שמסדרת את כל הלינקים
                    this.orgenzie(result);
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

    checkIfExistNewMessages = () => {
        this.props.showToast(1, "You have new message")
    }

    //יוצר מערך חדש הכולל את שם הלינק(אינסטגרם למשל) ואת הכתובת של הלינק
    orgenzie = (links) => {
        localStorage.setItem('linksFromSQL', JSON.stringify(links));
        let templink = "";
        let temparraylinks = [];
        for (let j = 0; j < links.length; j++) {
            const link = links[j].LinksCategoryLCode;
            for (let i = 0; i < this.state.options.length; i++) {
                const element = this.state.options[i];
                if (element.id == link) {
                    temparraylinks.push(element.value + " - " + links[j].linkPath)
                }
            }
        }
        this.setState({
            fullLinks: temparraylinks
        })
        localStorage.setItem('links', JSON.stringify(temparraylinks));
    }

    updateAreasGuides = (areas) => {
        //מביא את רשימת האזורים של המדריך 
        this.GetAreasGuideList(this.state.Guide);
    }
    updateLanguageGuides = () => {
        //מביא את רשימת השפות של המדריך 
        this.GetLanguagesGuideList(this.state.Guide);
    }
    updateHobbiesGuides = () => {
        //מביא את רשימת התחביבים של המדריך 
        this.GetHobbiesGuideList(this.state.Guide);
    }
    updateExpertisesGuides = () => {
        //מביא את רשימת ההתמחויות של המדריך 
        this.GetExpertisesGuides(this.state.Guide);
    }
    updateGuide = () => {
        this.GetGuideFromSQL(this.state.Guide);
        this.getLinksFromSQL(this.state.Guide);
    }
    //שינוי עמוד
    ClickPage2 = (e) => {
        this.setState({
            namePage: e
        });
    }
    funcGoogleFacebook = () => {
        return <ProfileCard local={this.state.local} GuideDetails={this.state.Guide} GuideExpertises={this.state.GuideExpertises} guideListHobbies={this.state.GuideHobbies} languages={this.state.GuideLanguages} areas={this.state.GuideAreas} GuideLinks={this.state.fulllink} />
    }

    //רינדור החלק המרכזי במסך לפי ה name page
    renderMainPage = () => {
        const namePage2 = this.state.namePage;
        if (namePage2 === "Profile Details") {
            return <ProfileDetails updateLinksSQL={this.updateLinks} orgenizeLinks={this.orgenzie} updateGuide={this.updateGuide} local={this.state.local} GuideDetails={this.state.Guide} linksfromSQL={this.state.linksfromSQL} fullLinks={this.state.fullLinks} />
        }
        // else if (namePage2 === "Area Knowledge") {
        //     return <Area updateArea={this.updateAreasGuides} guideListAreas={this.state.GuideAreas} GuideDetails={this.state.Guide} AreasArray={this.state.AllAreas} />
        // }
        else if (namePage2 === "Languages") {
            return <Languages LanguagesList={this.props.AllLanguages} local={this.state.local} updateLanguage={this.updateLanguageGuides} guideListLanguages={this.state.GuideLanguages} GuideDetails={this.state.Guide} />
        }
        else if (namePage2 === "Hobbies") {
            return <Hobbies local={this.state.local} GuideDetails={this.state.Guide} AllHobbies={this.state.AllHobbies} guideListHobbies={this.state.GuideHobbies} updateHobbies={this.updateHobbiesGuides} />
        }
        else if (namePage2 === "Expertise") {
            return <Expertise local={this.state.local} GuideDetails={this.state.Guide} AllExpertises={this.state.AllExpertises} GuideExpertises={this.state.GuideExpertises} updateExpertises={this.updateExpertisesGuides} />
        }
    }

    //מביא את רשימת האזורים של המדריך 
    GetAreasGuideList = (TempGuide) => {
        fetch(this.apiUrl + "Area/" + TempGuide.gCode, {
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
                    localStorage.setItem('areas', JSON.stringify(result));
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

    //מביא את רשימת התחביבים של המדריך
    GetHobbiesGuideList = (TempGuide) => {
        fetch(this.apiUrl + "Hobby/" + TempGuide.gCode, {
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
                    this.setState({ GuideHobbies: result })
                    localStorage.setItem('Hobby', JSON.stringify(result));
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

    //מביא את רשימת ההתמחויות של המדריך
    GetExpertisesGuides = (TempGuide) => {
        fetch(this.apiUrl + "Expertise/" + TempGuide.gCode, {
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
                    this.setState({ GuideExpertises: result })
                    localStorage.setItem('Expertise', JSON.stringify(result));
                },
                (error) => {
                    console.log("err post=", error);
                });
    }


    //מביא את כל השפות של המדריך
    GetLanguagesGuideList = (TempGuide) => {
        fetch(this.apiUrl + "Language/" + TempGuide.gCode, {
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
                    localStorage.setItem('languages', JSON.stringify(result));
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

    GetGuideFromSQL = (TempGuide) => {
        fetch(this.apiUrl + "Guide?email=" + TempGuide.Email, {
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
                    this.setState({ Guide: result })
                    localStorage.setItem('Guide', JSON.stringify(result));
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

    //אם העמוד הנוכחי הוא עדכון פרופיל אז יופיע כרטיס הפרופיל של המדריך, אם לא אז לא
    showProfileCard = () => {
        if (this.state.namePage === "Profile Details") {
            return <Row className="homePage">
                <Col lg='3' sm='12' className="ProfilecardDiv">
                    {this.funcGoogleFacebook()}
                </Col>
                <Col lg='9' md='12' sm='12' className="main-content p-0 centerDiv">

                    {this.renderMainPage()}
                </Col>
            </Row>
        }
        else {
            return <Row className="homePage" id="phoneHome">
                <Col className="cardDiv col-12">
                    {this.renderMainPage()}
                </Col>
            </Row>
        }
    }

    render() {
        return (
            <div>
                <Container fluid id={this.props.navbarOpenCheck} className="HomePageContainer hidden-sm hidden-xs">
                    <NavbarProfile ClickPage2={this.ClickPage2} />
                    {this.props.openTutorial ? this.FirstEnter() : null}
                    {this.state.tutorialExpertises ? this.nextToExper() : null}
                    {this.state.tutorialTrip ? this.nextToBuildTrip() : null}
                    {this.state.showRequest ? this.ShowRequestsAlert() : null}
                    {this.state.isOpenTouristProfile ? <TouristProfile navbarOpenCheck={this.state.navbar}
                        ExitProfile={this.ExitProfile} tourist={this.state.tourist} /> : null}
                    {this.showProfileCard()}
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
                </Container>
                <div id={this.props.navbarOpenCheck} className="HomePageContainer hidden-md hidden-lg hidden-xl">
                    <NavbarProfile ClickPage2={this.ClickPage2} />
                    {this.state.showRequest ? this.ShowRequestsAlert() : null}
                    {this.state.isOpenTouristProfile ? <TouristProfile navbarOpenCheck={this.state.navbar}
                        ExitProfile={this.ExitProfile} tourist={this.state.tourist} /> : null}
                    {this.showProfileCard()}
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
            </div>
        )
    }
}

export default withRouter(Home)