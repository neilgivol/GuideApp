import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import '../Css/ProfileCard.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import { Card, CardBody, CardText, CardImg, CardTitle, CardLink } from 'shards-react';
import StarRatings from 'react-star-ratings';
import pic from '../Img/Default-welcomer.png';
//import ImageUploader from 'react-images-upload';
import FileUpload from '../Components/fileUpload';
import { Progress } from "shards-react";
import { Link, withRouter } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle'



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
            local: this.props.local,
            upload: false,
            showDivPicture: false,
            newProfilePicURL: ""
        }
        this.onDrop = this.onDrop.bind(this);
        let local = this.state.local;
        this.apiUrl = 'http://localhost:49948/api';
        if (!local) {
            this.apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api';
        }
    }
    componentWillMount() {
        console.log(this.state.local);
        console.log("ddd");
    }
    onDrop(picture) {
        let newPic = "";
        for (let index = 0; index < picture.length; index++) {
            const element = picture[index];
            newPic = element;
        }
        console.log(newPic);
        this.UploadPicture(newPic);
        this.setState({
            pictures: newPic,
        });
        console.log(this.state.pictures)
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
                console.log('res=', res);
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

    componentDidMount() {
        const areas = JSON.parse(localStorage.getItem('areas'));
        const languages = JSON.parse(localStorage.getItem('languages'));
        const links = JSON.parse(localStorage.getItem('links'));
        const hobbies = JSON.parse(localStorage.getItem('Hobby'));
        const expertises = JSON.parse(localStorage.getItem('Expertise'));

        if (this.state.areas.length === 0) {
            this.setState({
                areas: areas
            })
        }
        if (this.state.languages.length === 0) {
            this.setState({
                languages: languages
            })
        }
        let tempSum = 20;
        let userBirth = this.state.user.BirthDay;
        let userPhone = this.state.user.Phone;
        let userDescription = this.state.user.DescriptionGuide
        let userPicture = this.state.user.ProfilePic;
        let userAreas = this.state.areas;
        let userLanguages = this.state.languages;
        if (userBirth !== "") {
            tempSum = parseInt(tempSum) + 10;
        }
        if (userPhone !== "") {
            tempSum = parseInt(tempSum) + 10;
        }
        if (userDescription !== "") {
            tempSum = parseInt(tempSum) + 10;
        }
        if (userPicture !== "") {
            tempSum = parseInt(tempSum) + 10;
        }
        if (hobbies !== null) {
            tempSum = parseInt(tempSum) + 20;
        }
        if (expertises !== null) {
            tempSum = parseInt(tempSum) + 20;
        }

        console.log(this.state.expertise)
        console.log(this.state.hobbies)

        this.setState({
            sum: tempSum
        })
    }
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
        //this.ChangeProfileImage();
    }

    CancelChangesProfilePic = () => {
        this.setState({
            upload: false,
            showDivPicture: false
        })
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



        // return <div>
        //     <h3>Do You Want To Change Your Profile Picture?</h3>
        //     <Button onClick={this.ChangeProfilePic} className="yesBtn col-4">YES</Button>
        //     <Button onClick={this.CancelChangesProfilePic} className="noBtn col-4">NO</Button>
        // </div>
    }
    ChangeProfilePic = () => {
        console.log(this.state.newProfilePicURL);
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
                console.log('res=', res);
                return res.json()
            })
            .then(
                (result) => {
                    console.log(result);
                    this.RenderProfilePic(result);
                },
                (error) => {
                    console.log("err post=", error);
                });


    }
    ChangeProfileImage = (newurl) => {
        this.setState({
            showDivPicture: true,
            newProfilePicURL: newurl
        })
        this.ShowProfileChangeQuestion();
        console.log(newurl);
    }

    RenderProfilePic = (result) => {
        console.log(result);
        localStorage.setItem('Guide', JSON.stringify(result))
        this.props.history.push({
            pathname: '/',
            state: { GuideTemp: result }
        });
    }
    picExsist = () => {
        if (this.state.user.ProfilePic !== "") {
            return <CardImg variant="top" src={this.state.user.ProfilePic} style={{ height: '50', width: '50' }} />
        }
        else {
            return <CardImg variant="top" src={pic} style={{ height: '50', width: '50' }} />
        }
    }


    funcPic = () => {
        return <div className="imageClass">
            {this.picExsist()}
            <span className="uploadPicIcon">
                <i class="far fa-image" onClick={this.changeup}></i>
            </span>
        </div>
    }

    funcName = () => {
        return <h2>{this.state.user.FirstName} {this.state.user.LastName}</h2>
    }
    render() {
        return (
            <Card className="CardBodyDiv">
                {this.funcPic()}

                <CardBody>
                    {/* <ImageUploader
                    //     withIcon={true}
                    //     buttonText='Choose images'
                    //     onChange={this.onDrop}
                    //     imgExtension={['.jpg', '.gif', '.png', '.gif', 'jpeg']}
                    //     maxFileSize={5242880}
                    // /> */}
                    {this.upload()}
                    {this.state.showDivPicture ? this.ShowProfileChangeQuestion() : null}
                    <CardTitle>{this.funcName()}</CardTitle>
                    <CardText>
                        <Progress theme="primary" value={this.state.sum} />
                    </CardText>
                    <p>your current rating :</p>
                    <StarRatings
                        rating={this.state.rating}
                        starRatedColor="blue"
                        changeRating={this.changeRating}
                        numberOfStars={5}
                        name='rating'
                        starDimension="20px"
                    />
                </CardBody>

                <CardBody>
                    <CardLink><Link to="/"> Logout</Link></CardLink>
                </CardBody>
            </Card>
        );
    }
}

export default withRouter(ProfileCard);