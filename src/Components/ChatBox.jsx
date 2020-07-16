import React, { Component } from 'react'
import moment from 'moment'
import ReactLoading from 'react-loading'
import 'react-toastify/dist/ReactToastify.css'
//import {Card} from 'react-bootstrap';
//import firebase from '../services/firebase';
import '../Css/ChatBox.css';
import { myFirestore, myFirebase } from '../services/firebase'
import images from '../Themes/Images'
import { AppString } from './Const'
import TouristProfile from '../Components/TouristProfile';
const picprof = require('../Img/Default-welcomer.png');
export default class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Guide: this.props.Guide,
            isShowStriker: false,
            inputValue: "",
            isLoading: false,
            tourist: "",
            showTourist: false,
            navbar: this.props.navbarOpenCheck,
            local: this.props.local,
            LanguagesListOrgenized: this.props.LanguagesListOrgenized,
            AllHobbies: this.props.AllHobbies,
            AllExpertises: this.props.AllExpertises,
            profileTourPic: "",
            oldMessages: []

        }
        this.pic = 'http://proj.ruppin.ac.il/bgroup10/PROD/Images/Default-welcomer.png';
        let local = this.state.local;
        this.apiUrl = "http://localhost:49948/api/";
        if (!local) {
            this.apiUrl = "https://proj.ruppin.ac.il/bgroup10/PROD/api/";
        }
        this.currentUserId = localStorage.getItem("idChat")
        this.currentUserDocumentId = localStorage.getItem('docId');
        this.stateChanged = localStorage.getItem('stateChange');
        this.currentPeerUser = this.props.currentPeerUser;
        this.listMessage = [];
        this.groupChatId = null;
        this.removeListener = null;
        this.currentPhotoFile = null;
        this.currentPeerUserMessages = [];
        this.currentUserMessages = [];

        myFirestore.collection('users').doc(this.currentPeerUser.documentKey).get()
            .then((docRef) => {
                this.currentPeerUserMessages = docRef.data().messages;
            }).then(()=>{
            })

            myFirestore.collection('users').doc(this.currentUserDocumentId).get()
            .then((docRef) => {
                this.currentUserMessages = docRef.data().messages;
            }).then(()=>{
            })

    }
    componentWillReceiveProps(newProps) {
        if (newProps.currentPeerUser) {
            this.setState({ showTourist: false })
            this.currentPeerUser = newProps.currentPeerUser
            this.GetAllTourists(this.currentPeerUser.email);
            this.getListHistory()
        }

    }

    componentDidUpdate() {
        this.scrollToBottom()
    }
    componentDidMount() {
        this.GetAllTourists(this.props.currentPeerUser.email);
        this.getListHistory();
    }
    componentWillUnmount() {
        if (this.removeListener) {
            this.removeListener()
        }
    }
    renderStricker = () => {

    }

    checkIfExistProfilePic = (tourist) => {
        let pictureTourist
        if (tourist.ProfilePic == null || tourist.ProfilePic == "") {
            pictureTourist = this.pic
        }
        else {
            pictureTourist = tourist.ProfilePic
        }

        this.setState({
            profileTourPic: pictureTourist
        })
    }


    getListHistory = () => {
        if (this.removeListener) {
            this.removeListener()
        }
        this.listMessage.length = 0
        this.setState({ isLoading: true })
        if (
            this.hashString(this.currentUserId) <=
            this.hashString(this.currentPeerUser.id)
        ) {
            this.groupChatId = `${this.currentUserId}-${this.currentPeerUser.id}`
        } else {
            this.groupChatId = `${this.currentPeerUser.id}-${this.currentUserId}`
        }

        // Get history and listen new data added
        this.removeListener = myFirebase.firestore()
            .collection(AppString.NODE_MESSAGES)
            .doc(this.groupChatId)
            .collection(this.groupChatId)
            .onSnapshot(
                snapshot => {
                    snapshot.docChanges().forEach(change => {
                        if (change.type === AppString.DOC_ADDED) {
                            this.listMessage.push(change.doc.data())
                        }
                    })

                    localStorage.setItem('listOldMessages', JSON.stringify(this.listMessage));
                    let notificationMessages = [];
                    if (this.currentUserMessages.length > 0) {
                        this.currentUserMessages.map((item) => {
                            if (item.notificationId != this.currentPeerUser.id) {
                                    notificationMessages.push(
                                        {
                                            notificationId: item.notificationId,
                                            number: item.number
                                        }
                                    )
                                }
                        })
                        myFirebase.firestore()
                        .collection('users')
                        .doc(this.currentUserDocumentId)
                        .update(
                            {
                                messages: notificationMessages
                            }
                        )
                        .then((data) => { })
                        .catch(err => {
                            this.props.showToast(0, err.toString())
                        })
                    }
                   
                    this.setState({ isLoading: false })
                },
                err => {
                    this.props.showToast(0, err.toString())
                }
            )


    }

    openListSticker = () => {
        this.setState({ isShowSticker: !this.state.isShowSticker })
    }

    onSendMessage = (content, type) => {
        let notificationMessages = [];
        // if (this.state.isShowSticker && type === 2) {
        //     this.setState({isShowSticker: false})
        // }

        if (content.trim() === '') {
            return
        }

        const timestamp = moment()
            .valueOf()
            .toString()

        const itemMessage = {
            idFrom: this.currentUserId,
            idTo: this.currentPeerUser.id,
            timestamp: timestamp,
            content: content.trim(),
            type: type
        }

        myFirebase.firestore()
            .collection(AppString.NODE_MESSAGES)
            .doc(this.groupChatId)
            .collection(this.groupChatId)
            .doc(timestamp)
            .set(itemMessage)
            .then(() => {
                this.setState({ inputValue: '' })
            })


            if (this.currentPeerUserMessages.length > 0) {
                this.currentPeerUserMessages.map((item) => {
                    if (item.notificationId != this.currentPeerUser.id) {
                        notificationMessages.push(
                            {
                                notificationId: item.notificationId,
                                number: item.number
                            }
                        )
                    }

                })
            }

                notificationMessages.push({
                    notificationId: this.currentUserId,
                        number: 1
                })
      

        myFirebase.firestore()
            .collection('users')
            .doc(this.currentPeerUser.documentKey)
            .update(
                {
                    messages: notificationMessages
                }
            )
            .then((data) => { })
            .catch(err => {
                this.props.showToast(0, err.toString())
            })

        this.SendNotification(this.state.tourist.Token, content.trim())
    }

    onChoosePhoto = event => {
        if (event.target.files && event.target.files[0]) {
            this.setState({ isLoading: true })
            this.currentPhotoFile = event.target.files[0]
            // Check this file is an image?
            const prefixFiletype = event.target.files[0].type.toString()
            if (prefixFiletype.indexOf(AppString.PREFIX_IMAGE) === 0) {
                this.uploadPhoto()
            } else {
                this.setState({ isLoading: false })
                this.props.showToast(0, 'This file is not an image')
            }
        } else {
            this.setState({ isLoading: false })
        }
    }
    uploadPhoto = () => {
        if (this.currentPhotoFile) {
            const timestamp = moment()
                .valueOf()
                .toString()

            const uploadTask = firebase.storage()
                .ref()
                .child(timestamp)
                .put(this.currentPhotoFile)

            uploadTask.on(
                AppString.UPLOAD_CHANGED,
                null,
                err => {
                    this.setState({ isLoading: false })
                    this.props.showToast(0, err.message)
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                        this.setState({ isLoading: false })
                        this.onSendMessage(downloadURL, 1)
                    })
                }
            )
        } else {
            this.setState({ isLoading: false })
            this.props.showToast(0, 'File is null')
        }
    }

    onKeyboardPress = event => {
        if (event.key === 'Enter') {
            this.onSendMessage(this.state.inputValue, 0)
        }
    }

    scrollToBottom = () => {
        if (this.messagesEnd) {
            this.messagesEnd.scrollIntoView({})
        }
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
                    this.OrgenizeTouristDetails(result);
                },
                (error) => {
                    console.log("err post=", error);
                }
            );
    };
    ExitProfile = (res) => {
        if (res == 'close') {
            this.setState({
                showTourist: false
            })
        }
    }
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
    showProfileTourist = () => {
        this.setState({
            showTourist: !this.state.showTourist
        })
    }

    SendNotification = (token, text) => {

        if (token !== null) {
        }
        let message = {
            to: token,
            title: this.state.Guide.FirstName + " " + this.state.Guide.LastName,
            body: text,
            data: { path: 'Chat' }
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

    render() {
        return (
            <div className="viewChatBoard">
                {/* Header */}
                <div className="headerChatBoard" onClick={() => { this.showProfileTourist() }}
                >
                    <img
                        className="viewAvatarItem"
                        src={this.currentPeerUser.URL}
                        alt="icon avatar"
                    />
                    <span className="textHeaderChatBoard">
                        {this.currentPeerUser.name}
                    </span>
                </div>

                {/* List message */}
                <div className="viewListContentChat">
                    {this.renderListMessage()}
                    <div
                        style={{ float: 'left', clear: 'both' }}
                        ref={el => {
                            this.messagesEnd = el
                        }}
                    />
                </div>

                {/* Stickers */}
                {this.state.isShowSticker ? this.renderStickers() : null}

                {/* View bottom */}
                <div className="viewBottom">
                    <img
                        className="icOpenGallery"
                        src={images.ic_photo}
                        alt="icon open gallery"
                        onClick={() => this.refInput.click()}
                    />
                    <input
                        ref={el => {
                            this.refInput = el
                        }}
                        accept="image/*"
                        className="viewInputGallery"
                        type="file"
                        onChange={this.onChoosePhoto}
                    />

                    <img
                        className="icOpenSticker"
                        src={images.ic_sticker}
                        alt="icon open sticker"
                        onClick={this.openListSticker}
                    />

                    <input
                        className="viewInput"
                        placeholder="Type your message..."
                        value={this.state.inputValue}
                        onChange={event => {
                            this.setState({ inputValue: event.target.value })
                        }}
                        onKeyPress={this.onKeyboardPress}
                    />
                    <img
                        className="icSend"
                        src={images.ic_send}
                        alt="icon send"
                        onClick={() => this.onSendMessage(this.state.inputValue, 0)}
                    />
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
                {this.state.showTourist ? (
                    <div>
                        <TouristProfile
                            ExitProfile={this.ExitProfile}
                            navbarOpenCheck={this.state.navbar}
                            tourist={this.state.tourist}
                        />
                    </div>
                ) : null}
            </div>
        )
    }



    renderListMessage = () => {
        if (this.listMessage.length > 0) {
            let viewListMessage = []
            this.listMessage.forEach((item, index) => {
                if (item.idFrom === this.currentUserId) {
                    // Item right (my message)
                    if (item.type === 0) {
                        viewListMessage.push(
                            <div className="viewWrapItemRight" key={item.timestamp}>
                                <div className="viewItemRight" key={item.timestamp}>
                                    <span className="textContentItem">{item.content}</span>
                                </div>
                                <span className="textTimeRight">
                                    {moment(Number(item.timestamp)).format('LLL')}
                                </span>
                            </div>

                        )
                    } else if (item.type === 1) {
                        viewListMessage.push(
                            <div className="viewItemRight2" key={item.timestamp}>
                                <img
                                    className="imgItemRight"
                                    src={item.content}
                                    alt="content message"
                                />
                            </div>
                        )
                    } else {
                        viewListMessage.push(
                            <div className="viewItemRight3" key={item.timestamp}>
                                <img
                                    className="imgItemRight"
                                    src={this.getGifImage(item.content)}
                                    alt="content message"
                                />
                            </div>
                        )
                    }
                } else {
                    // Item left (peer message)
                    if (item.type === 0) {
                        viewListMessage.push(
                            <div className="viewWrapItemLeft" key={item.timestamp}>
                                <div className="viewWrapItemLeft3">
                                    {this.isLastMessageLeft(index) ? (
                                        <img
                                            src={this.currentPeerUser.URL}
                                            alt="avatar"
                                            className="peerAvatarLeft"
                                        />
                                    ) : (
                                            <div className="viewPaddingLeft" />
                                        )}
                                    <div className="viewItemLeft">
                                        <span className="textContentItem">{item.content}</span>
                                    </div>
                                </div>
                                {this.isLastMessageLeft(index) ? (
                                    <span className="textTimeLeft">
                                        {moment(Number(item.timestamp)).format('LLL')}
                                    </span>
                                ) : null}
                            </div>
                        )
                    } else if (item.type === 1) {
                        viewListMessage.push(
                            <div className="viewWrapItemLeft2" key={item.timestamp}>
                                <div className="viewWrapItemLeft3">
                                    {this.isLastMessageLeft(index) ? (
                                        <img
                                            src={this.currentPeerUser.URL}
                                            alt="avatar"
                                            className="peerAvatarLeft"
                                        />
                                    ) : (
                                            <div className="viewPaddingLeft" />
                                        )}
                                    <div className="viewItemLeft2">
                                        <img
                                            className="imgItemLeft"
                                            src={item.content}
                                            alt="content message"
                                        />
                                    </div>
                                </div>
                                {this.isLastMessageLeft(index) ? (
                                    <span className="textTimeLeft">
                                        {moment(Number(item.timestamp)).format('LLL')}
                                    </span>
                                ) : null}
                            </div>
                        )
                    } else {
                        viewListMessage.push(
                            <div className="viewWrapItemLeft2" key={item.timestamp}>
                                <div className="viewWrapItemLeft3">
                                    {this.isLastMessageLeft(index) ? (
                                        <img
                                            src={this.currentPeerUser.URL}
                                            alt="avatar"
                                            className="peerAvatarLeft"
                                        />
                                    ) : (
                                            <div className="viewPaddingLeft" />
                                        )}
                                    <div className="viewItemLeft3" key={item.timestamp}>
                                        <img
                                            className="imgItemLeft"
                                            src={this.getGifImage(item.content)}
                                            alt="content message"
                                        />
                                    </div>
                                </div>
                                {this.isLastMessageLeft(index) ? (
                                    <span className="textTimeLeft">
                                        {moment(Number(item.timestamp)).format('LLL')}
                                    </span>
                                ) : null}
                            </div>
                        )
                    }
                }
            })
            return viewListMessage
        } else {
            return (
                <div className="viewWrapSayHi">
                    <span className="textSayHi">Say hi to new friend</span>
                    <img
                        className="imgWaveHand"
                        src={images.ic_wave_hand}
                        alt="wave hand"
                    />
                </div>
            )
        }
    }

    renderStickers = () => {
        return (
            <div className="viewStickers">
                <img
                    className="imgSticker"
                    src={images.mimi1}
                    alt="sticker"
                    onClick={() => this.onSendMessage('mimi1', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.mimi2}
                    alt="sticker"
                    onClick={() => this.onSendMessage('mimi2', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.mimi3}
                    alt="sticker"
                    onClick={() => this.onSendMessage('mimi3', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.mimi4}
                    alt="sticker"
                    onClick={() => this.onSendMessage('mimi4', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.mimi5}
                    alt="sticker"
                    onClick={() => this.onSendMessage('mimi5', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.mimi6}
                    alt="sticker"
                    onClick={() => this.onSendMessage('mimi6', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.mimi7}
                    alt="sticker"
                    onClick={() => this.onSendMessage('mimi7', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.mimi8}
                    alt="sticker"
                    onClick={() => this.onSendMessage('mimi8', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.mimi9}
                    alt="sticker"
                    onClick={() => this.onSendMessage('mimi9', 2)}
                />
            </div>
        )
    }

    hashString = (str) => {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
            hash += Math.pow(str.charCodeAt(i) * 31, str.length - i)
            hash = hash & hash // Convert to 32bit integer
        }
        return hash
    }

    getGifImage = (value) => {
        switch (value) {
            case 'mimi1':
                return images.mimi1
            case 'mimi2':
                return images.mimi2
            case 'mimi3':
                return images.mimi3
            case 'mimi4':
                return images.mimi4
            case 'mimi5':
                return images.mimi5
            case 'mimi6':
                return images.mimi6
            case 'mimi7':
                return images.mimi7
            case 'mimi8':
                return images.mimi8
            case 'mimi9':
                return images.mimi9
            default:
                return null
        }
    }

    isLastMessageLeft(index) {
        if (
            (index + 1 < this.listMessage.length &&
                this.listMessage[index + 1].idFrom === this.currentUserId) ||
            index === this.listMessage.length - 1
        ) {
            return true
        } else {
            return false
        }
    }

    isLastMessageRight(index) {
        if (
            (index + 1 < this.listMessage.length &&
                this.listMessage[index + 1].idFrom !== this.currentUserId) ||
            index === this.listMessage.length - 1
        ) {
            return true
        } else {
            return false
        }
    }
}
