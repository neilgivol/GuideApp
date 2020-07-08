import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import ReactLoading from 'react-loading'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';
import '../Profile/Css/Home.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import "../Css/BuildTrip.css";
import { Container } from "shards-react";
import moment from 'moment'
import { Button, Col, Row, Form, ListGroup, Card, ListGroupItem } from 'react-bootstrap';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
//import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { ItemContent } from 'semantic-ui-react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { GoogleComponent } from 'react-google-location'
import { Input } from '@material-ui/core';
import Swal from "sweetalert2";
import $ from "jquery";
import Draggable, { DraggableCore } from 'react-draggable'; // Both at the same time
const defaultCenter = {
    lat: 32.088780, lng: 34.854863
}
const mapStyles = {
    width: '600px',
    height: '750px',
};

const styles = {
    position: "relative",
    padding: "10px 15px",
    fontSize: "20px",
    border: "1px solid #f9fafa",
    background: "#f9fafa",
    cursor: "pointer"
};
const autoStyle = {
    margin: 'none'
}

class BuildTrip2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            openDates: false,
            EditAttraction: false,
            AddNewAttractionBool: false,
            classnameDivAtt: "modalAddattraction noOpen drag",
            AttractionFromDate: new Date(),
            AttractionToDate: new Date(),
            AllAttractions: this.props.Attractions,
            local: this.props.local,
            SelectedAttraction: "",
            ListTripArray: [],
            types: [],
            SelectedType: "",
            lastDate: "",
            place: null,
            openNewAttraction: true,
            newAttraction: "",
            RegionNewAttraction: "",
            CityNewAttraction: "",
            TypeNewAttraction: "",
            cities: this.props.cities,
            Regions: [],
            allTotal: [],
            item: "",
            activeDrags: 0,
            tourist: this.props.tourist,
            listFavoriteTypes: [],
            listFavoritesAtt: [],
            numberLength: 0,
            TouristsList: [],
            ChooseTourist: false,
            chosen: '',
            TripTourist: '',
            lastDay:"",
            image:""

        }

        let local = this.state.local;
        this.apiUrl = "http://localhost:49948/api/";
        if (!local) {
            this.apiUrl = "https://proj.ruppin.ac.il/bgroup10/PROD/api/";
        }
        this.toggle = this.toggle.bind(this);
        this.EditNewAttraction = this.EditNewAttraction.bind(this);

    }

    componentDidMount() {
        let g = JSON.parse(localStorage.getItem('cities'))
        if (g == null) {
            this.props.GetCities();
        }
        this.GetTouristLists();
        this.sortAlpha();
        this.GetTypesList();
        this.GetRegionsList();
        this.AddLine();

    }
    GetTouristLists = () => {
        let arr = [];
        arr = JSON.parse(localStorage.getItem('ListTourists'));
        let arr2 = [];
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            if (element.Email !== null) {
                arr2.push(element);
            }
        }
        console.log(arr2);
        if (arr2 !== null || arr2 !== "") {
            this.setState({
            TouristsList: arr2
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

    toggle = () => {
        this.setState({
            open: !this.state.open
        });
    }
    sortAlpha = () => {
        const AllAttractions = [...this.state.AllAttractions].sort((a, b) => {
            if (a.Region < b.Region) return -1;
            if (a.Region > b.Region) return 1;
            return 0;
        });
        this.setState({ AllAttractions: AllAttractions });
    }

    //מציג את ההאטרקציה לפני שבוחרים בה
    renderAttractionDetails = () => {
        let URL = "";
        if (this.state.SelectedAttraction.Product_Url !== "" || this.state.SelectedAttraction.Product_Url !== null) {
             URL = <p><a href={this.state.SelectedAttraction.Product_Url}>Attraction Site</a></p>
        }
        if (this.state.SelectedAttraction.Region === this.state.SelectedAttraction.AreaName) {
            return (<div className="DetailsAttraction"><h3>{this.state.SelectedAttraction.AttractionName}</h3>
                <p><b>Region Name:</b> {this.state.SelectedAttraction.Region}</p>
                <p><b>Attraction Type:</b> {this.state.SelectedAttraction.Attraction_Type}</p>
                {/* <h5>Description: </h5>
                <p>{this.state.SelectedAttraction.FullDescription}</p> */}
                <p><b>Opening Hours:</b> {this.state.SelectedAttraction.Opening_Hours}</p>
                {URL}
                <p><b>Adress:</b> {this.state.SelectedAttraction.Address}</p>
            </div>)
        }
        else {
            return (<div className="DetailsAttraction"><h3>{this.state.SelectedAttraction.AttractionName}</h3>
                <p><b>Region Name:</b> {this.state.SelectedAttraction.Region}</p>
                <p><b>City Name:</b> {this.state.SelectedAttraction.AreaName}</p>
                <p><b>Attraction Type:</b> {this.state.SelectedAttraction.Attraction_Type}</p>
                {/* <h5>Description: </h5>
                <p>{this.state.SelectedAttraction.FullDescription}</p> */}
                <p><b>Opening Hours:</b> {this.state.SelectedAttraction.Opening_Hours}</p>
                {URL}
                <p><b>Adress:</b> {this.state.SelectedAttraction.Address}</p>
            </div>)
        }

    }

    //מוסיף אטרקציה למסלול טיול
    AddAtractionToArray = () => {
        console.log(new Date(this.state.AttractionFromDate));
        this.setState({
            lastDay:""
        })
        // if (this.state.AttractionFromDate  || this.state.AttractionToDate) {
        // }
        let TripTourist = "";
        let AttractionPointInTrip = "";
        let tempArray = [];
        if (this.state.ListTripArray !== null) {
            for (let i = 0; i < this.state.ListTripArray.length; i++) {
                const element = this.state.ListTripArray[i];
                tempArray.push(element);
            }
        }

        if (this.state.newAttraction !== "") {
            if (this.state.CityNewAttraction !== "") {
                let Name = this.state.newAttraction;
                let Region = this.state.RegionNewAttraction;
                let AreaName = this.state.CityNewAttraction;
                let location = {
                    lng: this.state.CityNewAttraction.X,
                    lat: this.state.CityNewAttraction.Y
                };
                let type = this.state.TypeNewAttraction;
                let p = {
                    AttractionName: Name,
                    AreaName: AreaName.Name,
                    location: location,
                    Attraction_Type: type,
                    Region: Region
                }
                AttractionPointInTrip = {
                    Point: p,
                    FromHour: new Date(this.state.AttractionFromDate),
                    ToHour: new Date(this.state.AttractionToDate)
                };

                tempArray.push(AttractionPointInTrip);
                const list = tempArray.sort((a, b) => {
                    if (a.FromHour < b.FromHour) return -1;
                    if (a.FromHour > b.FromHour) return 1;
                    return 0;
                });
                // console.log(list);
                let ddd = this.OrderDaysTrip(list);
                             console.log(ddd);
                             tempArray = ddd;

                TripTourist = {
                    TouristEmail: this.state.chosen.Email,
                    TripListArray: tempArray
                }

                this.setState({
                    AttractionFromDate:new Date(),
                    ListTripArray: tempArray,
                    open: !this.state.open,
                    TripTourist: TripTourist,
                    newAttraction: "",
                RegionNewAttraction: "",
                CityNewAttraction: "",
                TypeNewAttraction: "",
                cities:this.props.cities,
                openNewAttraction:false,
                SelectedAttraction:""
                })
                //console.log(this.state.ListTripArray);
                localStorage.setItem('TripTourist', JSON.stringify(TripTourist));
                //localStorage.setItem('ListTripArray', JSON.stringify(tempArray));
                //this.props.SaveListAtt(tempArray);
            }
            else {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: " Must Insert City Name",
                    showConfirmButton: false,
                    timer: 1200
                });
            }
        }
        else {
            console.log(this.state.image);
            AttractionPointInTrip = {
                Point: this.state.SelectedAttraction,
                FromHour: this.state.AttractionFromDate.toLocaleString(),
                ToHour: this.state.AttractionToDate.toLocaleString()
            };
            if (this.state.image !== "") {
                AttractionPointInTrip.Point.Image = this.state.image;
            }
            console.log(AttractionPointInTrip);
            tempArray.push(AttractionPointInTrip);
            const list = tempArray.sort((a, b) => {
                if (a.FromHour < b.FromHour) return -1;
                if (a.FromHour > b.FromHour) return 1;
                return 0;
            });
            let ddd = this.OrderDaysTrip(list);
            console.log(ddd);
            tempArray = ddd;
            TripTourist = {
                TouristEmail: this.state.chosen.Email,
                TripListArray: tempArray
            }
            console.log(TripTourist);

            this.setState({
                AttractionFromDate:new Date(),
                ListTripArray: tempArray,
                open: !this.state.open,
                TripTourist: TripTourist,
                newAttraction: "",
                RegionNewAttraction: "",
                CityNewAttraction: "",
                TypeNewAttraction: "",
                cities:this.props.cities,
                openNewAttraction:false,
                SelectedAttraction:""
            })
            //console.log(this.state.ListTripArray);
            localStorage.setItem('TripTourist', JSON.stringify(TripTourist));
            //localStorage.setItem('ListTripArray', JSON.stringify(tempArray));
            //this.props.SaveListAtt(tempArray);
        }


    }

    //מציג את מסלול הטיול
    renderListTrip = () => {
        if (this.state.ListTripArray) {
            return this.state.ListTripArray.map((item) =>
            <div>
               {item.Day?<div className="DayTrip">{item.Day}</div> : null}
               {item.Day?  <ListGroup.Item id="attInTrip1">
            <p>{item.Point.AttractionName} - <span className="">{item.TimeFrom}</span> - <span className="">{item.TimeTo} </span>
            <span className="editAttraction" onClick={() => { this.EditAttraction(item) }}><i class="fas fa-edit"></i></span>
            <span className="delAttraction" onClick={() => { this.deleteLocation(item) }}><i class="fas fa-trash-alt"></i></span></p>
            </ListGroup.Item>:  <ListGroup.Item id="attInTrip2">
            <p>{item.Point.AttractionName} - <span className="">{item.TimeFrom}</span> - <span className="">{item.TimeTo} </span>
            <span className="editAttraction" onClick={() => { this.EditAttraction(item) }}><i class="fas fa-edit"></i></span>
            <span className="delAttraction" onClick={() => { this.deleteLocation(item) }}><i class="fas fa-trash-alt"></i></span></p>
            </ListGroup.Item>}
           
            </div>)
        }
    }

    OrderDaysTrip = (list) =>{
        let elem = "";
        let tempArray = [];
        let lastDay = "";
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            let check = element.FromHour.toLocaleString().replace(", ",' ');
            check = check.replace('.','/');
            check = moment(check).format("DD-MM-YYYY");
            console.log(check);
            let date = element.FromHour.toLocaleString().split(', ');
            let dateTo = element.ToHour.toLocaleString().split(', ');
            let timeFrom = date[1].split(":");
            timeFrom = timeFrom[0] + ":" + timeFrom[1];
            let timeTo = dateTo[1].split(":");
            timeTo = timeTo[0] + ":" + timeTo[1];
            date = date[0].replace('.','/');
            date = date.replace('.','/');
            if (date == lastDay) {
                elem = {
                    FromHour:element.FromHour,
                    ToHour:element.ToHour,
                    Point:element.Point,
                    TimeFrom:timeFrom,
                    TimeTo:timeTo
                }
            }
            else if(lastDay !== date){
                elem = {
                    FromHour:element.FromHour,
                    ToHour:element.ToHour,
                    Point:element.Point,
                    Day:date,
                    TimeFrom:timeFrom,
                    TimeTo:timeTo
                }
            }

            tempArray.push(elem);
            lastDay = date;
          
        }
        this.setState({
            ListTripArray:tempArray
        })
        console.log(tempArray);
        return tempArray;
    }
orderDates=(item)=>{
// {moment(item.FromHour).format('LL')}
    //console.log(moment(item.FromHour).format('ll'))
    //let date = new Date(item.FromHour);
    let date = item.FromHour.split(',');
    date = date[0].replace('.','/');
    date = date.replace('.','/');
this.setState({
})
}
    //מציג טבלת עריכת האטרציה
    EditAttraction = (item) => {
        this.setState({
            EditAttraction: true,
            item: item
        })
    }

    //עורך את האטרקציה
    EditNewAttraction = () => {
        let TripTourist = "";
        let AttractionPointInTrip = "";
        if (this.state.newAttraction !== "") {
            let Name = this.state.newAttraction;
            let Region = this.state.RegionNewAttraction;
            let AreaName = this.state.CityNewAttraction;
            let location = {
                lng: this.state.CityNewAttraction.X,
                lat: this.state.CityNewAttraction.Y
            };
            let type = this.state.TypeNewAttraction;
            let p = {
                AttractionName: Name,
                AreaName: AreaName.Name,
                location: location,
                Attraction_Type: type,
                Region: Region
            }
            AttractionPointInTrip = {
                Point: p,
                FromHour: this.state.AttractionFromDate.toLocaleString(),
                ToHour: this.state.AttractionToDate.toLocaleString()
            };
        }
        else {
            AttractionPointInTrip = {
                Point: this.state.SelectedAttraction,
                FromHour: this.state.AttractionFromDate.toLocaleString(),
                ToHour: this.state.AttractionToDate.toLocaleString()
            };
        }

        let tempArray = [];
        for (let i = 0; i < this.state.ListTripArray.length; i++) {
            const element = this.state.ListTripArray[i];
            if (this.state.item !== element) {
                tempArray.push(element);
            }
            else {
                tempArray.push(AttractionPointInTrip);
            }
        }
        TripTourist = {
            TouristEmail: this.state.chosen.Email,
            TripListArray: tempArray
        }
        this.setState({
            ListTripArray: tempArray,
            EditAttraction: !this.state.EditAttraction,
            TripTourist: TripTourist
        })
        localStorage.setItem('TripTourist', JSON.stringify(TripTourist));
        //localStorage.setItem('ListTripArray', JSON.stringify(tempArray));
        //this.props.SaveListAtt(tempArray);
        this.clearSelect();
    }
    clearSelect = () => {
        this.setState({
            SelectedAttraction: ""
        })
    }

    //מוחק את האטרקציה
    deleteLocation = (item) => {
        let TripTourist = "";
        // console.log(item);
        let newArrayTemp = [];
        for (let i = 0; i < this.state.ListTripArray.length; i++) {
            const element = this.state.ListTripArray[i];
            if (element !== item) {
                newArrayTemp.push(element);
            }
        }
        TripTourist = {
            TouristEmail: this.state.chosen.Email,
            TripListArray: newArrayTemp
        }

        this.setState({
            ListTripArray: newArrayTemp,
            TripTourist: TripTourist
        })
        localStorage.setItem('TripTourist', JSON.stringify(TripTourist));
        //localStorage.setItem('ListTripArray', JSON.stringify(newArrayTemp));
        // this.props.SaveListAtt(newArrayTemp);
    }

    //מוסיף נקודות אדומות על המפה
    AddMarkers = () => {
        if (this.state.ListTripArray) {
            return (this.state.ListTripArray ? this.state.ListTripArray.map((item) => <Marker title={item.Point.AttractionName} position={item.Point.location} />) : null)
        }
    }

    //מוסיף קו בין הנקודות האדומות
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
                        strokeColor: "#ff2527",
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
    FilerArray = () => {
        if (this.state.SelectedType == null) {
            let arrayTemp = this.props.Attractions;
            const AllAttractions = arrayTemp.sort((a, b) => {
                if (a.Region < b.Region) return -1;
                if (a.Region > b.Region) return 1;
                return 0;
            });
            this.setState({
                AllAttractions: AllAttractions
            })

            //this.sortAlpha();
        }
        else {
            let tempArray = [];
            for (let i = 0; i < this.props.Attractions.length; i++) {
                const att = this.props.Attractions[i];
                if (att.Attraction_Type.length > 1) {
                    for (let j = 0; j < att.Attraction_Type.length; j++) {
                        const attType = att.Attraction_Type[j];
                        if (attType === this.state.SelectedType) {
                            tempArray.push(att);

                        }
                    }
                }
                else {
                    if (att.Attraction_Type[0] === this.state.SelectedType) {
                        tempArray.push(att);
                    }
                }
            }
            tempArray = tempArray.sort((a, b) => {
                if (a.Region < b.Region) return -1;
                if (a.Region > b.Region) return 1;
                return 0;
            });
            this.setState({
                AllAttractions: tempArray
            })
        }

    }
    handleScriptLoad = (d) => {
    }


    ifNull = (value) => {
        if (value === null || value === "") {
            this.setState({
                openDates: false,
                SelectedAttraction: ""
            })
        }
        else {
            this.searchPhoto(value.AttractionName);
            this.setState({ SelectedAttraction: value, openDates: true })
        }
    }

    searchPhoto=(nameAtt)=>{

        $.ajax({
            url:
                "https://www.triposo.com/api/20200405/poi.json?location_id=Israel&fields=all&annotate=trigram:"+nameAtt+"&trigram=>=0.6&account=ZZR2AGIH&token=lq24f5n02dn276wmas9yrdpf9jq7ug3p",
            dataType: "json",
            success: this.search
        });
        }
        search=(res)=>{
        let arr = [];
        console.log(res.results);
        if (res.results !== null) {
            for (let i = 0; i < res.results.length; i++) {
                const element = res.results[i];
                if (element.images !== null) {
                    for (let j = 0; j < element.images.length; j++) {
                        const image = element.images[j];
                        console.log(image);
                        arr.push(image.source_url)
                    }
                }
            }
        }
        if (arr !== null) {
           this.setState({image:arr[0]})
           console.log(arr[0]);
        }
        
        }
    listCities = (value) => {
        let newArray = [];
        this.setState({
            RegionNewAttraction: value
        })
        if (value === "" || value === null) {
            this.setState({
                cities: this.props.cities
            })
        }
        else {
            for (let i = 0; i < this.props.cities.length; i++) {
                const element = this.props.cities[i];
                if (element.Region === value) {
                    newArray.push(element);
                }
            }
            console.log(newArray)
            this.setState({
                cities: newArray
            })
        }
    }
    AddNewAttractionName = (e) => {
        console.log(e.target.value);
        this.setState({ newAttraction: e.target.value })
        if (e.target.value === "" || e.target.value === null) {

            this.setState({
                openDates: false
            })
        }
        else {
            this.setState({
                openDates: true
            })
        }
    }
    onStart = () => {
        this.setState({ activeDrags: ++this.state.activeDrags });
    };

    onStop = () => {
        this.setState({ activeDrags: --this.state.activeDrags });
    };

    AddTourist = (value) => {
        this.setState({ chosen: value })
        this.filterTouristHandE(value);
        this.GetPointsTouristFromSQL(value.Email);
    }

    saveTrip = () => {
        let tempArray = [];
        console.log(this.state.TripTourist.TripListArray)
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
                Product_Url:element.Point.Product_Url
            }
            tempArray.push(TripPoint);
        }
        //this.AddTripToSQL(tempArray)
        if (this.state.chosen.Token !== null) {
            //this.SendNotification(this.state.chosen);
        }
    }

   
    SendNotification=(tourist)=>{
        let message = {
            to:tourist.Token,
            title:'Update Trip',
            body:'Your Trip is update by ' + this.props.Guide.Email,
            sound: 'default',
            data: { path: 'MyTrip'} ,
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
                    this.RenderListFromSQL(result);
                    this.setState({ ChooseTourist: true })
                },
                (error) => {
                    console.log("err post=", error);
                }
            );
    };

    AddTripToSQL = (tripPoints) => {
        console.log(tripPoints)
        //pay attention case sensitive!!!! should be exactly as the prop in C#!
        fetch(this.apiUrl + "BuildTrip", {
            method: "POST",
            body: JSON.stringify(tripPoints),
            headers: new Headers({
                "Content-type": "application/json; charset=UTF-8" //very important to add the 'charset=UTF-8'!!!!
            })
        })
            .then((res) => {
                return res.json();
            })
            .then(
                (result) => {
                    if (result !== null) {
                        this.RenderListFromSQL(result);
                    } else {
                    }
                },
                (error) => {
                    console.log("err post=", error);
                }
            );
    }

    RenderListFromSQL = (res) => {
        let tempArr = [];
        let AttractionPointInTrip = '';
        for (let i = 0; i < res.length; i++) {
            const sqlPoint = res[i];

            let p = this.props.Attractions.find(myFunction)
            function myFunction(value, index, array) {
                return value.AttractionName == sqlPoint.AttractionName
            }
            if (p == undefined) {
                console.log(this.props.cities);
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
                        FromHour: f.toLocaleString(),
                        ToHour: t.toLocaleString(),
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
                    FromHour: f.toLocaleString(),
                    ToHour: t.toLocaleString(),
                    Point: p
                }
                tempArr.push(AttractionPointInTrip);

            }

        }
        let TripTourist = {
            TouristEmail: this.state.chosen.Email,
            TripListArray: tempArr
        }
        localStorage.setItem('TripTourist', JSON.stringify(TripTourist));
        //localStorage.setItem('ListTripArray', JSON.stringify(newArrayTemp));
        this.setState({
            ListTripArray: tempArr,
            TripTourist: TripTourist
        })

        this.OrderDaysTrip(tempArr);


    }
    renderAll = () => {
        const dragHandlers = { onStart: this.onStart, onStop: this.onStop };
        if (!this.state.ChooseTourist) {
            if (this.state.TouristsList) {
                return (
                    <Container fluid id={this.props.navbarOpenCheck} className="HomePageContainer" >
                        <div className="SelectTourist">
                            <Row><h1>Choose Tourist:</h1></Row>
                            <Autocomplete
                                onChange={(event, value) => this.AddTourist(value)}  // prints the selected value
                                id="combo-box-demo"
                                options={this.state.TouristsList}
                                //groupBy={(option) => option.Region}
                                getOptionLabel={(option) => option.Email}
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
                    <div className="row">
                        <div className="col-md-7 col-sm-12 leftSide">
                            {this.state.open ?
                                <Draggable  {...dragHandlers}>
                                
                                    <div className="col-md-7 addAttDiv drag"> <div className={this.state.classnameDivAtt}><div className="ExistDiv"><span onClick={() => this.setState({ open: !this.state.open })} className="ExistSpan"><i class="fas fa-times"></i></span></div>
                                        <Form>  <Row form>
                                            <Col md="12" className="form-group">
                                                <h5>Filter By Type</h5>
                                                <Col md="8">
                                                    <Autocomplete
                                                        onChange={(event, value) => this.setState({ SelectedType: value })} // prints the selected value
                                                        id="combo-box-demo"
                                                        options={this.state.types}
                                                        getOptionLabel={(option) => option}
                                                        //style={}
                                                        renderInput={(params) => <TextField {...params} margin="normal" label="Choose Type" variant="outlined" />}
                                                    />
                                                </Col>
                                                <Col className="FilterButton" md="4"><Button onClick={() => { this.FilerArray() }}>Filter</Button></Col>
                                            </Col>

                                            <Col md="12" className="form-group">
                                                <label htmlFor="feCityName">Attraction Name</label>
                                                <Autocomplete
                                                    onChange={(event, value) => this.ifNull(value)} // prints the selected value
                                                    id="combo-box-demo"
                                                    options={this.state.AllAttractions}
                                                    groupBy={(option) => option.Region}
                                                    getOptionLabel={(option) => option.AttractionName}
                                                    //style={}
                                                    renderInput={(params) => <TextField {...params} margin="normal" label="Choose Attraction" variant="outlined" />}
                                                />
                                            </Col>
                                            <Col md="12">
                                                {this.state.SelectedAttraction ? this.renderAttractionDetails()
                                                    : null}
                                            </Col>
                                            {this.state.openNewAttraction ? <Col md="12">
                                                <span>Want to Add a New Attraction?</span> <Button onClick={() => { this.setState({ AddNewAttractionBool: !this.state.AddNewAttractionBool }) }} variant="info">Click Here</Button>
                                                {this.state.AddNewAttractionBool ? <div>
                                                    <input
                                                        className="form-control"
                                                        name="NewAttraction"
                                                        id="newAttraction"
                                                        placeholder="Attraction Name"
                                                        value={this.state.newAttraction}
                                                        onChange={this.AddNewAttractionName}
                                                    />
                                                    <Autocomplete
                                                        onChange={(event, value) => this.listCities(value)} // prints the selected value
                                                        id="combo-box-demo"
                                                        options={this.state.Regions}
                                                        //groupBy={(option) => option.Region}
                                                        getOptionLabel={(option) => option}
                                                        //style={}
                                                        renderInput={(params) => <TextField {...params} margin="normal" label="Choose Region" variant="outlined" />}
                                                    />
                                                    <Autocomplete
                                                        onChange={(event, value) => this.setState({ CityNewAttraction: value })} // prints the selected value
                                                        id="combo-box-demo"
                                                        options={this.state.cities}
                                                        //groupBy={(option) => option.Region}
                                                        getOptionLabel={(option) => option.Name}
                                                        //style={}
                                                        renderInput={(params) => <TextField {...params} margin="normal" label="Choose City" variant="outlined" />}
                                                    />
                                                    <Autocomplete
                                                        onChange={(event, value) => this.setState({ TypeNewAttraction: value })} // prints the selected value
                                                        id="combo-box-demo"
                                                        options={this.state.types}
                                                        //groupBy={(option) => option.Region}
                                                        getOptionLabel={(option) => option}
                                                        //style={}
                                                        renderInput={(params) => <TextField {...params} margin="normal" label="Choose Type" variant="outlined" />}
                                                    />
                                                </div> : null}
                                            </Col> : null}
                                            {this.state.openDates ? <Col md="5" className="form-group">
                                                <label htmlFor="feDate">From Date</label>
                                                <DatePicker
                                                    excludeOutOfBoundsTimes
                                                    selected={this.state.AttractionFromDate}
                                                    onChange={(newDate) => this.setState({ AttractionFromDate: newDate })}
                                                    showTimeSelect
                                                    timeFormat="HH:mm"
                                                    timeIntervals={15}
                                                    timeCaption="time"
                                                    //dateFormat="MMMM d, yyyy h:mm aa"
                                                    minDate={new Date()}
                                                />
                                            </Col> : null}
                                            {this.state.openDates ? <Col md="5" className="form-group">
                                                <label htmlFor="feDate">To Date</label>
                                                <DatePicker
                                                    selected={this.state.AttractionToDate}
                                                    onChange={(newDate) => this.setState({ AttractionToDate: newDate })}
                                                    showTimeSelect
                                                    timeFormat="HH:mm"
                                                    timeIntervals={15}
                                                    timeCaption="time"
                                                    //dateFormat="MMMM d, yyyy h:mm aa"
                                                    //minTime={new Date()}
                                                    minDate={this.state.AttractionFromDate}
                                                />
                                            </Col> : null}
                                        </Row>
                                            <Row>
                                                <Col>
                                                    <Button className="BTNSubmit" variant="primary" onClick={() => { this.AddAtractionToArray() }} >Add</Button>
                                                </Col>
                                            </Row></Form></div></div>
                                </Draggable>
                                : null}
                            {this.state.EditAttraction ?
                                <Draggable {...dragHandlers}>
                                    <div className={this.state.classnameDivAtt}><div className="ExistDiv"><span onClick={() => this.setState({ EditAttraction: !this.state.EditAttraction })} className="ExistSpan"><i class="fas fa-times"></i></span></div>
                                        <Form>
                                            <Row form>
                                                <Col md="12" className="form-group">
                                                    <h5>Filter By Type</h5>
                                                    <Col md="8">
                                                        <Autocomplete
                                                            onChange={(event, value) => this.setState({ SelectedType: value })} // prints the selected value
                                                            id="combo-box-demo"
                                                            options={this.state.types}
                                                            getOptionLabel={(option) => option}
                                                            //style={}
                                                            renderInput={(params) => <TextField {...params} margin="normal" label="Choose Type" variant="outlined" />}
                                                        />
                                                    </Col>
                                                    <Col className="FilterButton" md="4"><Button onClick={() => { this.FilerArray() }}>Filter</Button></Col>
                                                </Col>
                                                <Col md="12" className="colAutoName form-group">
                                                    <label htmlFor="feCityName">Attraction Name</label>
                                                    <Autocomplete
                                                        onChange={(event, value) => this.ifNull(value)} // prints the selected value
                                                        id="combo-box-demo"
                                                        options={this.state.AllAttractions}
                                                        groupBy={(option) => option.Region}
                                                        getOptionLabel={(option) => option.AttractionName}
                                                        //style={}
                                                        renderInput={(params) => <TextField {...params} margin="normal" label={this.state.item.Point.AttractionName} variant="outlined" />}
                                                    />
                                                </Col>
                                                <Col md="12">
                                                    {this.state.SelectedAttraction ? this.renderAttractionDetails()
                                                        : null}
                                                </Col>
                                                {this.state.openNewAttraction ? <Col md="12">
                                                    <span>Want to Add a New Attraction?</span> <Button onClick={() => { this.setState({ AddNewAttractionBool: !this.state.AddNewAttractionBool }) }} variant="info">Click Here</Button>
                                                    {this.state.AddNewAttractionBool ? <div>
                                                        <input
                                                            className="form-control"
                                                            name="NewAttraction"
                                                            id="newAttraction"
                                                            placeholder="Attraction Name"
                                                            value={this.state.newAttraction}
                                                            onChange={this.AddNewAttractionName}
                                                        />
                                                        <Autocomplete
                                                            onChange={(event, value) => this.listCities(value)} // prints the selected value
                                                            id="combo-box-demo"
                                                            options={this.state.Regions}
                                                            //groupBy={(option) => option.Region}
                                                            getOptionLabel={(option) => option}
                                                            //style={}
                                                            renderInput={(params) => <TextField {...params} margin="normal" label="Choose Region" variant="outlined" />}
                                                        />
                                                        <Autocomplete
                                                            onChange={(event, value) => this.setState({ CityNewAttraction: value })} // prints the selected value
                                                            id="combo-box-demo"
                                                            options={this.state.cities}
                                                            //groupBy={(option) => option.Region}
                                                            getOptionLabel={(option) => option.Name}
                                                            //style={}
                                                            renderInput={(params) => <TextField {...params} margin="normal" label="Choose City" variant="outlined" />}
                                                        />
                                                        <Autocomplete
                                                            onChange={(event, value) => this.setState({ TypeNewAttraction: value })} // prints the selected value
                                                            id="combo-box-demo"
                                                            options={this.state.types}
                                                            //groupBy={(option) => option.Region}
                                                            getOptionLabel={(option) => option}
                                                            //style={}
                                                            renderInput={(params) => <TextField {...params} margin="normal" label="Choose Type" variant="outlined" />}
                                                        />
                                                    </div> : null}
                                                </Col> : null}
                                                {this.state.openDates ? <Col md="5" className="form-group">
                                                    <label htmlFor="feDate">From Date</label>
                                                    <DatePicker
                                                        excludeOutOfBoundsTimes
                                                        selected={this.state.AttractionFromDate}
                                                        onChange={(newDate) => this.setState({ AttractionFromDate: newDate })}
                                                        showTimeSelect
                                                        timeFormat="HH:mm"
                                                        timeIntervals={15}
                                                        timeCaption="time"
                                                        dateFormat="MMMM d, yyyy h:mm aa"
                                                        minDate={new Date()}
                                                    />
                                                </Col> : null}
                                                {this.state.openDates ? <Col md="5" className="form-group">
                                                    <label htmlFor="feDate">To Date</label>
                                                    <DatePicker
                                                        selected={this.state.AttractionToDate}
                                                        onChange={(newDate) => this.setState({ AttractionToDate: newDate })}
                                                        showTimeSelect
                                                        timeFormat="HH:mm"
                                                        timeIntervals={15}
                                                        timeCaption="time"
                                                        dateFormat="MMMM d, yyyy h:mm aa"
                                                        //minTime={new Date()}
                                                        minDate={this.state.AttractionFromDate}
                                                    />
                                                </Col> : null}
                                            </Row>
                                            <Row>
                                                <Col md="12">
                                                    <Button className="BTNSubmit" variant="primary" onClick={this.EditNewAttraction} >Add</Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </div>
                                </Draggable>
                                : null}
                            <div className="col-md-9 col-sm-12 showTrip">
                                <h2>{this.state.chosen.FirstName} {this.state.chosen.LastName} - Trip</h2>
                                <div>
                                    <Button onClick={this.toggle}>Add Attraction</Button>
                                </div>
                                <div className="TripList">
                                    {this.state.ListTripArray ? <ListGroup variant="flush" className="listGroupTrip">
                                        {this.renderListTrip()}</ListGroup> : null}
                                </div>
                                <Button onClick={() => this.setState({ ChooseTourist: false })}>Logout Tourist Trip</Button>
                                <Button onClick={() => this.saveTrip()}>Save Trip</Button>
                            </div>
                        </div>
                        {/* AIzaSyCna1GfDry3zMNWiD9GlUK4VzUc1bu6_Wk */}

                        <div className="col-3 rightSide hidden-xs hidden-sm">
                            <LoadScript
                                //libraries= 'places'
                                googleMapsApiKey='AIzaSyD_2VscttN1yLn9NLZYH_60pdYHfA6jzfQ'>
                                <GoogleMap
                                    mapContainerStyle={mapStyles}
                                    zoom={8}
                                    center={defaultCenter}
                                >

                                    {this.AddMarkers()}
                                    {this.AddLine()}
                                </GoogleMap>

                            </LoadScript>
                        </div>
                    </div>

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

export default withRouter(BuildTrip2);
