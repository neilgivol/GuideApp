import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import '../Profile/Css/Home.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import "../BuildTrip/BuildTrip.css";
import { Container } from "shards-react";
import { Button, Row, ListGroup } from 'react-bootstrap';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import Swal from "sweetalert2";
import AddAttraction from '../BuildTrip/AddAttraction';
import TouristProfile from '../Components/TouristProfile';
import iconPic from '../Img/iconHeadGoogleMap.png';
import first from '../Img/buildtrip0.jpeg';
import second from '../Img/buildtrip1.jpeg';
import Modal from 'react-modal';

//מרכז מפת הגוגל
const defaultCenter = {
    lat: 31.768318, lng: 34.854863
}
//עיצוב מפת הגוגל
const mapStyles = {
    width: '400px',
    height: '800px',
};

// const styles = {
//     position: "relative",
//     padding: "10px 15px",
//     fontSize: "20px",
//     border: "1px solid #f9fafa",
//     background: "#f9fafa",
//     cursor: "pointer"
// };
// const autoStyle = {
//     margin: 'none'
// }

//Tutorial Style
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

class BuildTrip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            EditAttraction: false,
            AllAttractions: this.props.Attractions,
            local: this.props.local,
            ListTripArray: [],
            lastDate: "",
            cities: this.props.cities,
            item: "",
            activeDrags: 0,
            tourist: this.props.tourist,
            TouristsList: [],
            ChooseTourist: false,
            chosen: '',
            TripTourist: '',
            showTourist:false,
            tutorialSecond: false,
            tutorialStart: this.props.openTutorial,
        }

        let local = this.state.local;
        this.apiUrl = "http://localhost:49948/api/";
        if (!local) {
            this.apiUrl = "https://proj.ruppin.ac.il/bgroup10/PROD/api/";
        }
        this.toggle = this.toggle.bind(this);
        //this.EditNewAttraction = this.EditNewAttraction.bind(this);
    }

    componentDidMount() {
        this.setState({
            tutorialStart:false
        })
        this.props.QuestionFunc(false);
        let g = JSON.parse(localStorage.getItem('cities')) //בדיקה אם הגיעה רשימת הערים ממשרד התיירות
        if (g == null) {
            this.props.GetCities();
        }
        this.GetTouristLists(); //מביא את רשימת התיירים של המדריך
        this.sortAlpha(); //מסדר רשימות
        this.GetTypesList(); //מביא את רשימת סוגי האטרקציות
        this.GetRegionsList(); //מביא רשימת אזורים בארץ
        this.AddLine(); //מוסיף קווים למפה
        this.props.CheckMessagesNotifications() //בודק נוטיפיקיישן
    }

    componentDidUpdate(PrevProps) {
        if (PrevProps.openTutorial !== this.props.openTutorial) {
            this.setState({
                tutorialStart: this.props.openTutorial,
            })
        }
    }

//הדרכה ראשונה
    //מציג הקדמה למסלול טיול
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
                    <div className="divImageTutorial">
                        <img className="imageDiv" src={first} />
                    </div>
                    <div className="buttonsTutorial">
                        <Button onClick={() => { this.setState({ tutorialStart: false }); this.props.QuestionFunc(false) }} variant="danger" autoFocus> Skip</Button>
                        <Button onClick={() => { this.setState({ tutorialStart: false, tutorialSecond: true }) }} variant="primary" autoFocus>Next</Button>
                    </div>
                </Modal>
            </div>
        )
    }

    //הקדמה שנייה למסלול טיול
    nextToSecond = () => {
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
                    <Button onClick={() => { this.setState({ tutorialSecond: false });this.props.QuestionFunc(false) }} variant="primary" autoFocus>Finish</Button>
                </div>
            </Modal>
        </div>
    }

    //מביא את רשימת התיירים של המדריך
    GetTouristLists = () => {
        let arr = [];
        if (localStorage.getItem('ListTourists')) {
            arr = JSON.parse(localStorage.getItem('ListTourists'));
        let arr2 = [];
        if (arr !== null || arr !== undefined) {
            for (let i = 0; i < arr.length; i++) {
                const element = arr[i];
                if (element.Email !== null) {
                    arr2.push(element);
                }
            }
        }
        if (arr2 !== null || arr2 !== "") {
            this.setState({
                TouristsList: arr2
            })
            this.GetTouristsFromSQL(arr2);
        }
        }
    }

    //מביא את כל רשימת הסטטוסים של התיירים בשרת
    GetTouristsFromSQL = (emails) => {
        fetch(this.apiUrl + "BuildTrip/GetAllListTouristsStatus", {
            method: "POST",
            body: JSON.stringify(emails),
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8"
            })
        })
            .then((res) => {
                return res.json();
            })
            .then(
                (result) => {
                    this.UpdateListTourists(result);
                },
                (error) => {
                    console.log("err post=", error);
                }
            );
    };

    //במידה והתייר עובד עם המדריך מוסיפים לרשימת תיירים של מדריך
    UpdateListTourists = (res) =>{
        let TempArr = [];
        for (let i = 0; i < res.length; i++) {
            const sqlStatus = res[i];
           for (let j = 0; j < this.state.TouristsList.length; j++) {
               const tourist = this.state.TouristsList[j];
               if (sqlStatus.TouristEmail === tourist.Email && sqlStatus.GuideEmail === this.props.Guide.Email) {
                   TempArr.push(tourist);
               }
           }
        }
        this.setState({
            TouristsList:TempArr
        })
    }

    //הצגת פרופיל תייר
    ShowProfile = ()=>{
        this.setState({
            showTourist:!this.state.showTourist
        })
    }
    //יציאה מפרופיל תייר
    ExitProfile = (res) =>{
        if (res == 'close') {
            this.setState({
                showTourist:false
            })
        }
    }

    //מביא את רשימת סוגי האטרקציות
    GetTypesList = () => {
        let allTypes = [];
        for (let i = 0; i < this.state.AllAttractions.length; i++) {
            const element = this.state.AllAttractions[i];
            if (element.Attraction_Type.length > 1) {
                for (let j = 0; j < element.Attraction_Type.length; j++) {
                    const element2 = element.Attraction_Type[j];
                    allTypes.push(element2);
                }
            }
            else {
                allTypes.push(element.Attraction_Type[0])
            }
        }
        const uniqueTags = [];
        allTypes.map(att => {
            if (uniqueTags.indexOf(att) === -1) {
                uniqueTags.push(att)
            }
        });
        this.setState({
            types: uniqueTags
        })
    }

    //מביא את רשימת האזורים
    GetRegionsList = () => {
        let allRegions = [];
        for (let i = 0; i < this.state.AllAttractions.length; i++) {
            const element = this.state.AllAttractions[i];
            allRegions.push(element.Region)
        }
        const uniqueTags = [];
        allRegions.map(att => {
            if (uniqueTags.indexOf(att) === -1) {
                uniqueTags.push(att)
            }
        });
        this.setState({
            Regions: uniqueTags
        })
    }

    //!***************************************************************************************לטפל בזה אם יש זמן*******************************
    //מכין מערך של רשימת סוגי אטרקציות שמתאימות לתייר
    filterTouristHandE = (value) => {
        let HobbiesAndExpertises = [];

        for (let i = 0; i < value.HobbiesNames.length; i++) {
            const element = value.HobbiesNames[i];
            HobbiesAndExpertises.push(element);
        }
        for (let i = 0; i < value.ExpertisesNames.length; i++) {
            const element = value.ExpertisesNames[i];
            HobbiesAndExpertises.push(element);
        }
        // 4: "Public Parks & Gardens"
        // 6: "National Sites"
        // 10: "Agriculture"
        // 13: "Amusement and Adventure"
        // 14: " Birding Centers"
        // 15: "Workshops and experiences"
        let tempArray = [];
        for (let i = 0; i < HobbiesAndExpertises.length; i++) {
            const element = HobbiesAndExpertises[i];
            switch (element) {
                case "Theater":
                    tempArray.push("Amusement and Adventure")
                    break;
                case "Sport":
                    tempArray.push("Extreme Sports")
                    break;
                case "Classic Music":
                    tempArray.push("Museums And Culture")
                    break;
                case "Photography":
                    tempArray.push("National Sites")
                    tempArray.push("Public Parks & Gardens")
                    tempArray.push("Birding Centers")
                    break;
                case "Diving":
                    tempArray.push("Extreme Sports")
                    break;
                case "Geopolitics":
                    tempArray.push("National Sites")
                    break;
                case "Art Museum":
                    tempArray.push("Museums And Culture")
                    break;
                case "Computer Gamer":
                    tempArray.push("Amusement and Adventure")
                    break;
                case "Cooking":
                    tempArray.push("Wineries")
                    break;
                case "Beach":
                    tempArray.push("Beaches")
                    break;
                case "Parties":
                    break;
                case "Shopping":
                    tempArray.push("Markets & Shopping Centres")
                    break;
                case "Shopping in Markets":
                    tempArray.push("Markets & Shopping Centres")
                    break;
                case "Extreme":
                    tempArray.push("Extreme Sports")
                    break;
                case "Wine Tours":
                    tempArray.push("Wineries")
                    break;
                case "Culinary":
                    break;
                case "Desert Trips":
                    tempArray.push("Nature And Animals");
                    tempArray.push("National Sites")
                    break;
                case "Jeep Trips":
                    tempArray.push("Extreme Sports")
                    break;
                case "Islam":
                    tempArray.push("Holy Places")
                    break;
                case "Christianity":
                    tempArray.push("Holy Places")
                    break;
                case "Judaism":
                    tempArray.push("Holy Places")
                    break;
                case "Bible":
                    tempArray.push("Holy Places")
                    break;
                case "Rappeling":
                    tempArray.push("Extreme Sports")
                    break;
                case "History Places":
                    tempArray.push("Archaeology and History")
                    break;
                case "Nature":
                    tempArray.push("Nature And Animals");
                    tempArray.push("National Sites")
                    break;

                default:
                    break;
            }
        }
    }
    //*************************************************************************************************************************************8 */
    //כפתור הוספת אטרקציה
    toggle = () => {
        this.setState({
            open: !this.state.open
        });
    }
    //סידור אזורים בארץ
    sortAlpha = () => {
        const AllAttractions = [...this.state.AllAttractions].sort((a, b) => {
            if (a.Region < b.Region) return -1;
            if (a.Region > b.Region) return 1;
            return 0;
        });
        this.setState({ AllAttractions: AllAttractions });
    }

    // //מוסיף אטרקציה למסלול טיול
    // AddAtractionToArray = () => {
    //     this.setState({
    //         lastDay: ""
    //     })
    //     // if (this.state.AttractionFromDate  || this.state.AttractionToDate) {
    //     // }
    //     let TripTourist = "";
    //     let AttractionPointInTrip = "";
    //     let tempArray = [];
    //     if (this.state.ListTripArray !== null) {
    //         for (let i = 0; i < this.state.ListTripArray.length; i++) {
    //             const element = this.state.ListTripArray[i];
    //             tempArray.push(element);
    //         }
    //     }
    //     //בודק אם האטרקציה מתוך רשימת האטרקציות או הכנסה ידנית של המדריך
    //     if (this.state.newAttraction !== "") {
    //         if (this.state.CityNewAttraction !== "") {
    //             let Name = this.state.newAttraction;
    //             let Region = this.state.RegionNewAttraction;
    //             let AreaName = this.state.CityNewAttraction;
    //             let location = {
    //                 lng: this.state.CityNewAttraction.X,
    //                 lat: this.state.CityNewAttraction.Y
    //             };
    //             let type = this.state.TypeNewAttraction;
    //             let p = {
    //                 AttractionName: Name,
    //                 AreaName: AreaName.Name,
    //                 location: location,
    //                 Attraction_Type: type,
    //                 Region: Region
    //             }
    //             AttractionPointInTrip = {
    //                 Point: p,
    //                 FromHour: new Date(this.state.AttractionFromDate),
    //                 ToHour: new Date(this.state.AttractionToDate)
    //             };

    //             tempArray.push(AttractionPointInTrip);
    //             const list = tempArray.sort((a, b) => {
    //                 if (a.FromHour < b.FromHour) return -1;
    //                 if (a.FromHour > b.FromHour) return 1;
    //                 return 0;
    //             });
    //             let ddd = this.OrderDaysTrip(list);
    //             tempArray = ddd;

    //             TripTourist = {
    //                 TouristEmail: this.state.chosen.Email,
    //                 TripListArray: tempArray
    //             }

    //             this.setState({
    //                 AttractionFromDate: new Date(),
    //                 ListTripArray: tempArray,
    //                 open: !this.state.open,
    //                 TripTourist: TripTourist,
    //                 newAttraction: "",
    //                 RegionNewAttraction: "",
    //                 CityNewAttraction: "",
    //                 TypeNewAttraction: "",
    //                 cities: this.props.cities,
    //                 openNewAttraction: false,
    //                 SelectedAttraction: ""
    //             })
    //             localStorage.setItem('TripTourist', JSON.stringify(TripTourist));
    //         }
    //         else {
    //             Swal.fire({
    //                 position: "center",
    //                 icon: "error",
    //                 title: " Must Insert City Name",
    //                 showConfirmButton: false,
    //                 timer: 1200
    //             });
    //         }
    //     }
    //     else {
    //         AttractionPointInTrip = {
    //             Point: this.state.SelectedAttraction,
    //             FromHour: this.state.AttractionFromDate.toLocaleString(),
    //             ToHour: this.state.AttractionToDate.toLocaleString()
    //         };
    //         if (this.state.image !== "") {
    //             AttractionPointInTrip.Point.Image = this.state.image;
    //         }
    //         tempArray.push(AttractionPointInTrip);
    //         const list = tempArray.sort((a, b) => {
    //             if (a.FromHour < b.FromHour) return -1;
    //             if (a.FromHour > b.FromHour) return 1;
    //             return 0;
    //         });
    //         let ddd = this.OrderDaysTrip(list);
    //         tempArray = ddd;
    //         TripTourist = {
    //             TouristEmail: this.state.chosen.Email,
    //             TripListArray: tempArray
    //         }

    //         this.setState({
    //             AttractionFromDate: new Date(),
    //             ListTripArray: tempArray,
    //             open: !this.state.open,
    //             TripTourist: TripTourist,
    //             newAttraction: "",
    //             RegionNewAttraction: "",
    //             CityNewAttraction: "",
    //             TypeNewAttraction: "",
    //             cities: this.props.cities,
    //             openNewAttraction: false,
    //             SelectedAttraction: ""
    //         })
    //         localStorage.setItem('TripTourist', JSON.stringify(TripTourist));
    //     }
    // }

    //מציג את מסלול הטיול
    renderListTrip = () => {
        if (this.state.ListTripArray) {
            return this.state.ListTripArray.map((item) =>
                <div>
                    {item.Day ? <div className="DayTrip">{item.Day}</div> : null}
                    {item.Day ? <ListGroup.Item id="attInTrip1">
                        <p>{item.Point.AttractionName} - <span className="">{item.TimeFrom}</span> - <span className="">{item.TimeTo} </span>
                            <span className="editAttraction" onClick={() => { this.EditAttraction(item) }}><i class="fas fa-edit"></i></span>
                            <span className="delAttraction" onClick={() => { this.deleteLocation(item) }}><i class="fas fa-trash-alt"></i></span></p>
                    </ListGroup.Item> : <ListGroup.Item id="attInTrip2">
                            <p>{item.Point.AttractionName} - <span className="">{item.TimeFrom}</span> - <span className="">{item.TimeTo} </span>
                                <span className="editAttraction" onClick={() => { this.EditAttraction(item) }}><i class="fas fa-edit"></i></span>
                                <span className="delAttraction" onClick={() => { this.deleteLocation(item) }}><i class="fas fa-trash-alt"></i></span></p>
                        </ListGroup.Item>}

                </div>)
        }
    }

    //עריכת אטרקציה
    EditAttraction = (item) => {
        this.setState({
            EditAttraction: true,
            item: item,
            open: !this.state.open
        })
    }

    //סידור אטרקציות לפי ימים
    OrderDaysTrip = (list) => {
        let elem = "";
        let tempArray = [];
        let lastDay = "";
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            let date = null;
            let dateTo = null;
            if (new Date(element.FromHour) == "Invalid Date") {
                date = element.FromHour.toLocaleString().split(', ');
                dateTo = element.ToHour.toLocaleString().split(', ');

            }
            else {
                date = new Date(element.FromHour).toLocaleString().split(', ');
                dateTo = new Date(element.ToHour).toLocaleString().split(', ');
            }

            let timeFrom = date[1].split(":");
            timeFrom = timeFrom[0] + ":" + timeFrom[1];
            let timeTo = dateTo[1].split(":");
            timeTo = timeTo[0] + ":" + timeTo[1];
            date = date[0].replace('.', '/');
            date = date.replace('.', '/');
            if (date == lastDay) {
                elem = {
                    FromHour: new Date(element.FromHour),
                    ToHour: new Date(element.ToHour),
                    Point: element.Point,
                    TimeFrom: timeFrom,
                    TimeTo: timeTo
                }
            }
            else if (lastDay !== date) {
                elem = {
                    FromHour: new Date(element.FromHour),
                    ToHour: new Date(element.ToHour),
                    Point: element.Point,
                    Day: date,
                    TimeFrom: timeFrom,
                    TimeTo: timeTo
                }
            }

            tempArray.push(elem);
            lastDay = date;

        }
        this.setState({
            ListTripArray: tempArray
        })
        return tempArray;
    }

    //עורך את האטרקציה
    clearSelect = () => {
        this.setState({
            SelectedAttraction: ""
        })
    }

    //מוחק את האטרקציה
    deleteLocation = (item) => {
        let temparr = null;
        let TripTourist = "";
        let newArrayTemp = [];
        for (let i = 0; i < this.state.ListTripArray.length; i++) {
            const element = this.state.ListTripArray[i];
            if (element !== item) {
                newArrayTemp.push(element);
            }
        }

        const list = newArrayTemp.sort((a, b) => {
            if (new Date(a.FromHour) < new Date(b.FromHour)) return -1;
            if (new Date(a.FromHour) > new Date(b.FromHour)) return 1;
            return 0;
        });
        newArrayTemp = list;
        TripTourist = {
            TouristEmail: this.state.chosen.Email,
            TripListArray: newArrayTemp
        }

        this.setState({
            ListTripArray: newArrayTemp,
            TripTourist: TripTourist
        })

        let temparr2 = [];
        if (localStorage.getItem('TripTourists')) {
            let temparr = JSON.parse(localStorage.getItem('TripTourists'));
            for (let i = 0; i < temparr.length; i++) {
                const element = temparr[i];
                if (element.TouristEmail !== this.state.chosen.Email) {
                    temparr2.push(element);
                }
            }
            temparr2.push(TripTourist)
        }
        else {
            temparr2.push(TripTourist)
        }
        localStorage.setItem('TripTourists', JSON.stringify(temparr2));
    }

    //מוסיף נקודות על המפה
    AddMarkers = () => {
        if (this.state.ListTripArray) {
            return (this.state.ListTripArray ? this.state.ListTripArray.map((item) => <Marker animation={Animation} icon={iconPic} title={item.Point.AttractionName + " " + item.FromHour.toLocaleString()} position={item.Point.location} />) : null)
        }
    }

    //מוסיף קו בין הנקודות 
    AddLine = () => {
        if (this.state.ListTripArray) {
            let pathCoordinates = [];
            for (let i = 0; i < this.state.ListTripArray.length; i++) {
                const element = this.state.ListTripArray[i];
                pathCoordinates.push(element.Point.location)
            }
            return (
                <Polyline
                    path={pathCoordinates}
                    geodesic={true}
                    options={{
                        strokeColor: "#125fb1",
                        strokeOpacity: 0.75,
                        strokeWeight: 2,
                        icons: [
                            {
                                offset: "0",
                                repeat: "20px"
                            }
                        ]
                    }}
                />
            )
        }

    }

    //מציג רשימת אטרקציות לפי הסוג שנבחר
    onStart = () => {
        this.setState({ activeDrags: ++this.state.activeDrags });
    };
    onStop = () => {
        this.setState({ activeDrags: --this.state.activeDrags });
    };

    //לאחר בחירת תייר
    AddTourist = (value) => {
        this.setState({ chosen: value })
        this.filterTouristHandE(value);
        this.GetPointsTouristFromSQL(value.Email);
    }

    //שמירת טיול בשרת
    saveTrip = () => {
        let tempArray = [];
        for (let i = 0; i < this.state.TripTourist.TripListArray.length; i++) {
            const element = this.state.TripTourist.TripListArray[i];
            let TripPoint = {
                TouristEmail: this.state.chosen.Email,
                GuideEmail: this.props.Guide.Email,
                FromHour: element.FromHour,
                ToHour: element.ToHour,
                AttractionName: element.Point.AttractionName,
                Address: element.Point.Address,
                AreaName: element.Point.AreaName,
                Region: element.Point.Region,
                FullDescription: element.Point.FullDescription,
                Opening_Hours: element.Point.Opening_Hours,
                Product_Url: element.Point.Product_Url,
                lng: element.Point.location.lng,
                lat: element.Point.location.lat,
                Image: element.Point.Image
            }
            tempArray.push(TripPoint);
        }
        this.AddTripToSQL(tempArray)
    }
    AddTripToSQL = (tripPoints) => {
        for (let i = 0; i < tripPoints.length; i++) {
            let FromHour =  new Date(tripPoints[i].FromHour).toLocaleString()
            tripPoints[i].FromHour = FromHour
            let ToHour =  new Date(tripPoints[i].ToHour).toLocaleString()
            tripPoints[i].ToHour = ToHour
        }
        //pay attention case sensitive!!!! should be exactly as the prop in C#!
        fetch(this.apiUrl + 'BuildTrip/GetAtt', {
            method: "POST",
            body: JSON.stringify(tripPoints),
            headers: new Headers({
                "Content-type": "application/json; charset=UTF-8", 'Accept-encoding': 'gzip, deflate' //very important to add the 'charset=UTF-8'!!!!
            })
        })
            .then((res) => {
                return res.json();
            })
            .then(
                (result) => {
                    if (result !== null) {
                        this.RenderListFromSQL(result);
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "The Trip Added",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        if (this.state.chosen.Token !== null) {
                            this.SendNotification(this.state.chosen);
                        }
                    }
                     else {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: "The Trip did'nt Added",
                            showConfirmButton: false,
                            timer: 1200
                        });
                    }
                },
                (error) => {
                    console.log("err post=", error);
                }
            );
    }

    //שליחת התראה לתייר על עדכון טיול
    SendNotification = (tourist) => {
        let message = {
            to: tourist.Token,
            title: 'Update Trip',
            body: 'Your Trip is update by ' + this.props.Guide.FirstName + " " + this.props.Guide.LastName,
            sound: 'default',
            data: { path: 'MyTrip' },
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

    //מביא את רשימת האטרקציות של התייר
    GetPointsTouristFromSQL = (email) => {
        fetch(this.apiUrl + "BuildTrip?email=" + email, {
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
                    if (result !== null) {
                        this.RenderListFromSQL(result);
                    }
                    this.setState({ ChooseTourist: true })
                },
                (error) => {
                    console.log("err post=", error);
                }
            );
    };

    //הצגת רשימת האטרקציות מהשרת
    RenderListFromSQL = (res) => {
        let temparr = "";
        let tempArr = [];
        let TripTourist = null;
        let AttractionPointInTrip = '';
        if ( res !== null) {
            
        }
        if (res.length > 0 ) {
            for (let i = 0; i < res.length; i++) {
                const sqlPoint = res[i];
                let p = this.props.Attractions.find(myFunction)
                function myFunction(value, index, array) {
                    return value.AttractionName == sqlPoint.AttractionName
                }
                if (p == undefined) {
                    let p2 = this.props.cities.find(myFunction2)
                    function myFunction2(value, index, array) {
                        return value.Name == sqlPoint.AreaName
                    }
                    if (p2 !== undefined) {
                        let f = new Date(sqlPoint.FromHour);
                        let t = new Date(sqlPoint.ToHour)
                        let location = {
                            lng: p2.X,
                            lat: p2.Y
                        };

                        AttractionPointInTrip = {
                            FromHour: f,
                            ToHour: t,
                            Point: {
                                AttractionName: sqlPoint.AttractionName,
                                AreaName: sqlPoint.AreaName,
                                Region: sqlPoint.Region,
                                location: location
                            }
                        }
                        tempArr.push(AttractionPointInTrip);
                    }
                }
                else {
                    let f = new Date(sqlPoint.FromHour);
                    let t = new Date(sqlPoint.ToHour)
                    AttractionPointInTrip = {
                        FromHour: f,
                        ToHour: t,
                        Point: p
                    }
                    tempArr.push(AttractionPointInTrip);
                }
            }
            this.OrderDaysTrip(tempArr);
            TripTourist = {
                TouristEmail: this.state.chosen.Email,
                TripListArray: tempArr
            }
            this.setState({
                TripTourist: TripTourist
            })
        }
        else {
            if (localStorage.getItem('TripTourists')) {
                temparr = localStorage.getItem('TripTourists')
                if (temparr.length > 0) {
                    let temparr3 = JSON.parse(temparr);
                    for (let j = 0; j < temparr3.length; j++) {
                        const element = temparr3[j];
                        if (element.TouristEmail == this.state.chosen.Email) {
                            TripTourist = {
                                TouristEmail: this.state.chosen.Email,
                                TripListArray: element.TripListArray
                            }
                            tempArr = element.TripListArray;
                            const list = tempArr.sort((a, b) => {
                                if (new Date(a.FromHour) < new Date(b.FromHour)) return -1;
                                if (new Date(a.FromHour) > new Date(b.FromHour)) return 1;
                                return 0;
                            });
                            tempArr = list;
                            this.setState({
                                ListTripArray: tempArr,
                                TripTourist: TripTourist
                            })
                            this.OrderDaysTrip(tempArr);
                        }
                        else {
                            TripTourist = {
                                TouristEmail: this.state.chosen.Email,
                                TripListArray: null
                            }
                            tempArr = null;
                        }
                    }
                }
            }

        }
    }

    MoveList = (tempArray, touristJson) => {
        this.setState({
            ListTripArray: tempArray,
            TripTourist: touristJson
        })
    }

    CloseOpenDiv = () => {
        this.setState({
            open: !this.state.open
        })
    }

    renderAll = () => {
        const dragHandlers = { onStart: this.onStart, onStop: this.onStop };
        if (!this.state.ChooseTourist) {
            if (this.state.TouristsList) {
                return (
                    <Container fluid id={this.props.navbarOpenCheck} className="HomePageContainer" >
                        {this.state.tutorialStart ? this.FirstEnter() : null}
                    {this.state.tutorialSecond ? this.nextToSecond() : null}
                        <div className="SelectTourist">
                      
                            <Row><h1>Choose Tourist:</h1></Row>
                            <Autocomplete
                                onChange={(event, value) => this.AddTourist(value)}  // prints the selected value
                                id="combo-box-demo"
                                options={this.state.TouristsList}
                                //groupBy={(option) => option.Region}
                                getOptionLabel={(option) => option.FirstName + " " + option.LastName}
                                //style={}
                                renderInput={(params) => <TextField {...params} margin="normal" label="Choose Tourist" variant="outlined" />}
                            />
                        </div>
                      
                    </Container>
                )
            }
        }
        else {
            return (
                <Container fluid id={this.props.navbarOpenCheck} className="HomePageContainer" >
                    <div className="row allsides">
                        <div className="col-md-6 col-lg-7 col-xs-12 leftSide">
                            {this.state.open ?
                                <AddAttraction
                                    CloseOpenDiv={this.CloseOpenDiv}
                                    open={this.state.open}
                                    AllAttractions={this.state.AllAttractions}
                                    types={this.state.types}
                                    Regions={this.state.Regions}
                                    cities={this.props.cities}
                                    TouristsList={this.state.TouristsList}
                                    chosen={this.state.chosen}
                                    ListTripArray={this.state.ListTripArray}
                                    TripTourist={this.state.TripTourist}
                                    MoveList={this.MoveList}
                                    Attractions={this.props.Attractions}
                                    EditAttraction={this.state.EditAttraction}
                                    item={this.state.item}
                                /> : null}
                            <div className="col-sm-12 showTrip">
                                <div className="titleDivTrip"><h3>{this.state.chosen.FirstName} {this.state.chosen.LastName} - Trip</h3></div>
                                <div>
                                    <Button className="btn col-5" variant="success" onClick={this.toggle}>Add Attraction</Button>
                                    <Button className="btn col-5" variant="info" onClick={this.ShowProfile}>Profile Tourist</Button>
                                </div>
                                <div className="TripList">
                                    {this.state.ListTripArray ? <ListGroup variant="flush" className="listGroupTrip">
                                        {this.renderListTrip()}</ListGroup> : null}
                                </div>
                                <div>
                                <Button className="btn col-5" variant="danger" onClick={() => this.setState({ ChooseTourist: false, ListTripArray: [] })}>Switch Tourist</Button>
                                <Button className="btn col-5" variant="primary" onClick={() => this.saveTrip()}>Save Trip</Button>
                                </div>
                            </div>
                        </div>
                        {/* AIzaSyCna1GfDry3zMNWiD9GlUK4VzUc1bu6_Wk */}
                        <div className="col-lg-3 col-sm-6 rightSide hidden-xs">
                            <LoadScript
                                //libraries= 'places'
                                googleMapsApiKey='AIzaSyD_2VscttN1yLn9NLZYH_60pdYHfA6jzfQ'>
                                <GoogleMap
                                    mapContainerStyle={mapStyles}
                                    zoom={7.8}
                                    center={defaultCenter}
                                >
                                    {this.AddMarkers()}
                                    {this.AddLine()}
                                </GoogleMap>
                            </LoadScript>
                        </div>
                    </div>
                    {this.state.tutorialStart ? this.FirstEnter() : null}
                    {this.state.tutorialSecond ? this.nextToSecond() : null}
                    {this.state.showTourist ? (
                        <div>
                            <TouristProfile
                            ExitProfile={this.ExitProfile}
                                navbarOpenCheck={this.props.navbarOpenCheck} 
                                tourist={this.state.chosen}
                            />
                        </div>
                    ) : null}
                </Container>
            )
        }
    }
    render() {
        const dragHandlers = { onStart: this.onStart, onStop: this.onStop };
        return (
            <div>
                {this.renderAll()}
            </div>
        );
    }
}
export default withRouter(BuildTrip);