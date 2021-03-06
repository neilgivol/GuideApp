import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import './ProfileCard.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "../../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import { Card, CardBody, CardText, CardImg, CardTitle, CardLink } from 'shards-react';
import StarRatings from 'react-star-ratings';
import pic from '../../Img/Default-welcomer.png';
import FileUpload from '../Components/fileUpload';
import { Progress } from "shards-react";
import { withRouter } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { myFirebase } from '../../services/firebase'

class ProfileCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.GuideDetails,
            languages: this.props.languages,
            areas: this.props.areas,
            sum: 0,
            rating: this.props.GuideDetails.Rank,
            pictures: [],
            hobbies: this.props.guideListHobbies,
            expertise: this.props.GuideExpertises,
            links:this.props.GuideLinks,
            local: this.props.local,
            upload: false,
            showDivPicture: false,
            newProfilePicURL: ""
        }
        this.onDrop = this.onDrop.bind(this);
        let local = this.state.local;
        this.apiUrl = 'http://localhost:49948/api';
        if (!local) {
            this.apiUrl = 'https://proj.ruppin.ac.il/bgroup10/PROD/api';
        }
    }

    componentDidMount() {
        this.calculateProcces();
    }
  
    componentDidUpdate(PrevProps) {
        if (PrevProps.GuideExpertises !== this.props.GuideExpertises) {
            this.setState({
                expertise:this.props.GuideExpertises
            })
            this.calculateProcces();
        }
        if (PrevProps.guideListHobbies !== this.props.guideListHobbies) {
            this.setState({
                hobbies:this.props.guideListHobbies
            })
            this.calculateProcces();
        }
        if (PrevProps.languages !== this.props.languages) {
            this.setState({
                languages:this.props.languages
            })
            this.calculateProcces();
        }
        if (PrevProps.GuideLinks !== this.props.GuideLinks) {
            this.setState({
                links:this.props.GuideLinks
            })
            this.calculateProcces();
        }
    }

    onDrop(picture) {
        let newPic = "";
        for (let index = 0; index < picture.length; index++) {
            const element = picture[index];
            newPic = element;
        }
        this.UploadPicture(newPic);
        this.setState({
            pictures: newPic,
        });
    }
    UploadPicture = (pic) => {
        const data = new FormData();
        data.append("UploadedFile", pic);
        //pay attention case sensitive!!!! should be exactly as the prop in C#!
        fetch(this.apiUrl + '/Guide/PostPic', {
            method: 'POST',
            contentType: false,
            processData: false,
            body: data,
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
            })
        })
            .then(res => {
                return res.json()
            })
            .then(
                (result) => {
                    console.log(result);
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

    //חישוב אחוזי מילוי פרטים
    calculateProcces=()=>{
        const userLanguages = this.state.languages;
        const links = this.state.links;
        const hobbies = this.state.hobbies;
        const expertises = this.state.expertise;
        let all = {
            userLanguages:userLanguages,
            links:links,
            hobbies:hobbies,
            expertises:expertises
        }        
        let tempSum = 0;
        let userBirth = this.state.user.BirthDay;
        let userPhone = this.state.user.Phone;
        let userDescription = this.state.user.DescriptionGuide
        let userPicture = this.state.user.ProfilePic;
        if (userBirth !== "") {
            tempSum = parseInt(tempSum) + 5;
        }
        if (userPhone !== "") {
            tempSum = parseInt(tempSum) + 10;
        }
        if (userDescription !== "") {
            tempSum = parseInt(tempSum) + 10;
        }
        if (userPicture !== "") {
            tempSum = parseInt(tempSum) + 5;
        }
        if (links !== null) {
            if (links.length > 0) {
                tempSum = parseInt(tempSum) + 10;
            }
        }
        if (userLanguages !== null) {
            if (userLanguages.length > 0) {
                tempSum = parseInt(tempSum) + 20;
            }
        }

        if (hobbies !== null) {
            if (hobbies.length > 0) {
                tempSum = parseInt(tempSum) + 20;
            }
        }
        if (expertises !== null) {
            if (expertises.length > 0) {
                tempSum = parseInt(tempSum) + 20;
            }
        }


        this.setState({
            sum: tempSum
        })
    }

//לחיצה על החלפת תמונת פרופיל
    changeup = () => {
        if (this.state.upload) {
            this.setState({
                upload: false
            })
        }
        else {
            this.setState({
                upload: true
            });
        }

        this.upload();
    }
    upload = () => {
        if (this.state.upload) {
            return <div className="uploadDiv"><FileUpload changeURL={this.ChangeProfileImage} local={this.props.local} /></div>
        }
    }
    ChangeProfileImage = (newurl) => {
        this.setState({
            showDivPicture: true,
            newProfilePicURL: newurl
        })
        this.ShowProfileChangeQuestion();
    }
    ShowProfileChangeQuestion = () => {
        return <div>
            <Dialog
                open={true}
                onClose={false}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure you want to change your picture?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        by clicking yes your picture will be changed
          </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.CancelChangesProfilePic} color="primary">
                        No
          </Button>
                    <Button onClick={this.ChangeProfilePic} color="primary" autoFocus>
                        Yes
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    }
    //ביטול
    CancelChangesProfilePic = () => {
        this.setState({
            upload: false,
            showDivPicture: false
        })
    }
  //שינוי תמונה
    ChangeProfilePic = () => {
        let newurl = this.state.newProfilePicURL;
        let urlPicture = "http://proj.ruppin.ac.il/bgroup10/PROD/uploadedFiles/" + newurl;
        let ProfilePicture = {
            id: this.state.user.gCode,
            picPath: urlPicture
        }
        fetch(this.apiUrl + '/Guide/UpdateProfilePic', {
            method: 'POST',
            body: JSON.stringify(ProfilePicture),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
            })
        })
            .then(res => {
                return res.json()
            })
            .then(
                (result) => {
                    this.updateInFirebase(result.ProfilePic);
                    this.RenderProfilePic(result);
                },
                (error) => {
                    console.log("err post=", error);
                });

    }
    //עדכון בפיירבייס
    updateInFirebase = (result) => {
        let currentUserIdchat = localStorage.getItem("idChat")
        let currentUserDocumentId = localStorage.getItem('docId');
        myFirebase.firestore().collection("users").doc(currentUserDocumentId).update({
            URL: result
        })
    }
    //הצגת התמונה החדשה
    RenderProfilePic = (result) => {
        localStorage.setItem('Guide', JSON.stringify(result))
        this.props.history.push({
            pathname: '/',
            state: { GuideTemp: result }
        });
    }
    //אם קיימת תמונה למדריך
    picExsist = () => {
        if (this.state.user.ProfilePic !== "") {
            return <CardImg variant="top" src={this.state.user.ProfilePic} style={{ height: '50', width: '50' }} />
        }
        else {
            return <CardImg variant="top" src={pic} style={{ height: '50', width: '50' }} />
        }
    }
//הצגת כפתור שינוי התמונה והתמונה עצמה
    funcPic = () => {
        return <div className="imageClass">
            {this.picExsist()}
            <span className="uploadPicIcon">
                <i className="fas fa-camera" onClick={this.changeup}></i>
            </span>
        </div>
    }
//יציאה מהאפליקציה
    logOut = () => {
        localStorage.removeItem('docId');
        localStorage.removeItem('idChat');
        localStorage.removeItem('languages');
        localStorage.removeItem('Expertise');
        localStorage.removeItem('Hobby');
        localStorage.removeItem('Guide');
        localStorage.removeItem('ListTourists');
        localStorage.removeItem('links');
        localStorage.removeItem('linksFromSQL');
        localStorage.removeItem('TripTourists');
        myFirebase.auth().signOut();
        this.props.history.push({
                pathname: "/",
            });
    }
//שם המדריך
    funcName = () => {
        return <h3>{this.state.user.FirstName} {this.state.user.LastName}</h3>
    }
    
    render() {
        return (
            <Card className="CardBodyDiv">
                {this.funcPic()}

                <CardBody className="bodyProfileCard">
                    {this.upload()}
                    {this.state.showDivPicture ? this.ShowProfileChangeQuestion() : null}
                    <CardTitle className="titleProfileCard">{this.funcName()}</CardTitle>
                    <CardText>
                        <Progress theme="primary" value={this.state.sum} />
                    </CardText>
                    <span className="spanRating">your current rating :</span>
                    <StarRatings
                        rating={this.state.rating}
                        starRatedColor="blue"
                        changeRating={this.changeRating}
                        numberOfStars={5}
                        name='rating'
                        starDimension="16px"
                    />
                    <CardLink className="logoutProfileCard" onClick={() => { this.logOut() }}><span>Logout</span></CardLink>
                </CardBody>
            </Card>
        );
    }
}

export default withRouter(ProfileCard);