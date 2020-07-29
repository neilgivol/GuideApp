import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import ProfileDetails from "../Profile/ProfileDetails.jsx";
import ProfileCard from '../Profile/ProfileDetails/ProfileCard.jsx';
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
import TouristProfile from '../Components/TouristProfile';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
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
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const customStyles = {
    content: {
        top: '50%',
        left: '60%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        marginTop: '40px',
        marginBottom: '40px',
        transform: 'translate(-50%, -50%)',
        height: '80%',
        width: '80%',
    }
};

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(-1.5),
    top: theme.spacing(-1.5),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            namePage: 'Profile Details',
            docId: "",
            idChat: "",
            local: this.props.local,
            navbar: this.props.navbarOpenCheck,
            Guide: '',
            GuideLanguages: [],
            //GuideAreas: [],
            GuideHobbies: [],
            GuideExpertises: [],
           // AllAreas: this.props.AllAreas,
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
            notificationsMessages: [],
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
                // {
                //     id: 5,
                //     name: 'Website',
                //     value: 'Website',
                //     label: <div><img alt="" className="imageicons" src={website} /><span>Website</span></div>
                // },
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
            this.setState({
                AllExpertises: this.props.AllExpertises
            })
        }
        if (PrevProps.AllHobbies !== this.props.AllHobbies) {
            this.setState({
                AllHobbies: this.props.AllHobbies
            })
        }
        if (PrevProps.openTutorial !== this.props.openTutorial) {
            this.setState({
                tutorialStart: this.props.openTutorial,

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
                idChat: idChat,
                docId: docId
            })
            //this.ConnectFirebase(Guidetemp);
        }
        else {
            this.setState({
                Guide: this.props.location.state.GuideTemp,
                idChat: this.props.location.state.idChat,
                docId: this.props.location.state.docId
            })
            //this.ConnectFirebase(this.props.location.state.GuideTemp);
        }
    }
    componentDidMount() {
        this.setState({
            tutorialStart:false
        })
        this.props.QuestionFunc(false);  //איפוס tutorial
        this.GetAllTouristsGuide();     //מביא את כל התיירים של המדריך
        this.CheckRequests();          //בודק אם יש בקשות חברות חדשות
        this.GetHobbiesGuideList(this.state.Guide);    //מביא את רשימת התחביבים של המדריך
        this.GetLanguagesGuideList(this.state.Guide); //מביא את כל השפות של המדריך
        this.GetExpertisesGuides(this.state.Guide);  //מביא את רשימת ההתמחויות של המדריך
        this.getLinksFromSQL(this.state.Guide);     //מביא את הלינקים של המדריך הספציפי
        this.props.CheckMessagesNotifications()    //בודק התראות למדריך
        this.setState({
            isLoading: false,
        })
    }

     //*********************************************מביא את כל התיירים של המדריך*************************************************
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
    //**********************************************************************************************************************/

     //******************************************בודק אם יש בקשות חברות חדשות********************************************
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
            }
        }
        else {
            this.setState({
                showRequest: false
            })
        }
    }

     //מציג את בקשות החברות החדשות
     ShowRequestsAlert = () => {
        for (let i = 0; i < this.state.requestTouristEmails.length; i++) {
            const element = this.state.requestTouristEmails[i];
            return <div>
                <Dialog
                    open={true}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title"  onClose={this.handleClose}>{"You Have Request Alert From " + element}</DialogTitle>
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
    
    //סגירת מודל בקשות
    handleClose = () => {
        this.setState({ showRequest: false })
  };
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
     //יציאה מפרופיל תייר
     ExitProfile = (res) => {
        if (res == 'close') {
            this.setState({
                isOpenTouristProfile: false
            })
            this.CheckRequests();
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
                    this.SendNotificationStartChat(element);
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
                    this.SendNotificationDeclineChat(element);
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
            body: this.state.Guide.FirstName + " " + this.state.Guide.LastName + ' Accept your request',
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
            body: this.state.Guide.FirstName + " " + this.state.Guide.LastName + ' Decline your request',
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
     //***************************************************End Requests************************************************************/

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
                         this.orgenzie(result)
                    //שולח את הרשימה לפונקציה שמסדרת את כל הלינקים
                   
                },
                (error) => {
                    console.log("err post=", error);
                });
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

    //*********************************************************Start Tutorial**********************************************/
    //מציג הקדמה לאפליקציה
    FirstEnter = () => {
        return (
            <div className="modaliPad">
                <Modal
                    isOpen={true}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <div className="divImageTutorial">
                        <img className="imageDiv" src={first} />
                    </div>
                    <div className="buttonsTutorial">
                        <Button onClick={() => { this.setState({ tutorialStart: false }); this.props.QuestionFunc(false) }} variant="danger" autoFocus> Skip</Button>
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
                style={customStyles}
                contentLabel="Example Modal"
            >
                    <div className="divImageTutorial">
                    <img className="imageDiv" src={second} />
                </div>
                <div className="buttonsTutorial">
                    <Button onClick={() => { this.setState({ tutorialExpertises: false}); this.props.QuestionFunc(false) }} variant="danger" autoFocus> Skip</Button>
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
                    <Button onClick={() => { this.setState({ tutorialTrip: false }); this.props.QuestionFunc(false) }} variant="primary" autoFocus>Finish</Button>
                </div>
            </Modal>
        </div>
    }
    //*********************************************************End Tutorial**********************************************/


   //עדכונים של פרטי המדריך
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

    //שינוי עמוד בדף הבית
    ClickPage2 = (e) => {
        this.setState({
            namePage: e
        });
    }
    //הצגת כרטיס תמונת המדריך
    funcGoogleFacebook = () => {
        return <ProfileCard local={this.state.local} GuideDetails={this.state.Guide} GuideExpertises={this.state.GuideExpertises} guideListHobbies={this.state.GuideHobbies} languages={this.state.GuideLanguages} areas={this.state.GuideAreas} GuideLinks={this.state.linksfromSQL} />
    }
    //רינדור החלק המרכזי במסך לפי ה name page
    renderMainPage = () => {
        const namePage2 = this.state.namePage;
        if (namePage2 === "Profile Details") {
            return <ProfileDetails CheckMessagesNotifications={this.props.CheckMessagesNotifications}
            updateLinksSQL={this.updateLinks} orgenizeLinks={this.orgenzie} updateGuide={this.updateGuide} local={this.state.local} GuideDetails={this.state.Guide} linksfromSQL={this.state.linksfromSQL} fullLinks={this.state.fullLinks} />
        }
        else if (namePage2 === "Languages") {
            return <Languages CheckMessagesNotifications={this.props.CheckMessagesNotifications} LanguagesList={this.props.AllLanguages} local={this.state.local} updateLanguage={this.updateLanguageGuides} guideListLanguages={this.state.GuideLanguages} GuideDetails={this.state.Guide} />
        }
        else if (namePage2 === "Hobbies") {
            return <Hobbies CheckMessagesNotifications={this.props.CheckMessagesNotifications} local={this.state.local} GuideDetails={this.state.Guide} AllHobbies={this.state.AllHobbies} guideListHobbies={this.state.GuideHobbies} updateHobbies={this.updateHobbiesGuides} />
        }
        else if (namePage2 === "Expertise") {
            return <Expertise CheckMessagesNotifications={this.props.CheckMessagesNotifications} local={this.state.local} GuideDetails={this.state.Guide} AllExpertises={this.state.AllExpertises} GuideExpertises={this.state.GuideExpertises} updateExpertises={this.updateExpertisesGuides} />
        }
    }

    //מביא מדריך מהשרת
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
                <Container fluid id={this.props.navbarOpenCheck} className="HomePageContainer hidden-xs">
                    <NavbarProfile ClickPage2={this.ClickPage2} />
                    {this.state.tutorialStart ? this.FirstEnter() : null}
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
                <div id="close" className="HomePageContainer hidden-sm hidden-md hidden-lg hidden-xl">
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