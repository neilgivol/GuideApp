import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import ReactLoading from 'react-loading'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';
import '../Css/Home.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import "../Css/BuildTrip.css";
import { Container } from "shards-react";
import { Button, Col, Row, Form, ListGroup, Card, ListGroupItem } from 'react-bootstrap';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
//import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { ItemContent } from 'semantic-ui-react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { GoogleComponent } from 'react-google-location'
import { Input } from '@material-ui/core';
import Draggable, { DraggableCore } from 'react-draggable'; // Both at the same time
const defaultCenter = {
    lat: 32.088780, lng: 34.854863
}
const mapStyles = {
    width: '600px',
    height: '900px',
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
            ListTripArray: this.props.ListAttractions,
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
         
        }

        let local = this.state.local;
        this.apiUrl = "http://localhost:49948/api/";
        if (!local) {
            this.apiUrl = "http://proj.ruppin.ac.il/bgroup10/PROD/api/";
        }
        this.toggle = this.toggle.bind(this);
        this.EditNewAttraction = this.EditNewAttraction.bind(this);

    }

    componentDidMount() {
        const ListTripArray = JSON.parse(localStorage.getItem('ListTripArray'));
        this.setState({
            ListTripArray: ListTripArray,
        })
        this.sortAlpha();
        this.GetTypesList();
        this.GetRegionsList();
        console.log(this.props.tourist);
        console.log(this.state.types);
        this.AddLine();
    }

   
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
        console.log(uniqueTags);
    }
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
        let HobbiesAndExpertises = [];
        for (let i = 0; i < this.props.tourist.HobbiesNames.length; i++) {
            const element = this.props.tourist.HobbiesNames[i];
            HobbiesAndExpertises.push(element);
        }
        for (let i = 0; i < this.props.tourist.ExpertisesNames.length; i++) {
            const element = this.props.tourist.ExpertisesNames[i];
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
            switch (element.name) {
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
        console.log(tempArray);
        console.log(HobbiesAndExpertises)
        console.log(uniqueTags)
    }


    toggle = () => {
        this.setState({
            open: !this.state.open
        });
        console.log(this.state.open)
    }
    sortAlpha = () => {
        const AllAttractions = [...this.state.AllAttractions].sort((a, b) => {
            if (a.Region < b.Region) return -1;
            if (a.Region > b.Region) return 1;
            return 0;
        });
        this.setState({ AllAttractions: AllAttractions });
    }
    renderAttractionDetails = () => {
        if (this.state.SelectedAttraction.Region === this.state.SelectedAttraction.AreaName) {
            return (<div className="DetailsAttraction"><h3>{this.state.SelectedAttraction.AttractionName}</h3>
                <p><b>Region Name:</b> {this.state.SelectedAttraction.Region}</p>
                <p><b>Attraction Type:</b> {this.state.SelectedAttraction.Attraction_Type}</p>
                <h5>Description: </h5>
                <p>{this.state.SelectedAttraction.FullDescription}</p>
                <p><b>Opening Hours:</b> {this.state.SelectedAttraction.Opening_Hours}</p>
                <p><b>Adress:</b> {this.state.SelectedAttraction.Address}</p>
            </div>)
        }
        else {
            return (<div className="DetailsAttraction"><h3>{this.state.SelectedAttraction.AttractionName}</h3>
                <p><b>Region Name:</b> {this.state.SelectedAttraction.Region}</p>
                <p><b>City Name:</b> {this.state.SelectedAttraction.AreaName}</p>
                <p><b>Attraction Type:</b> {this.state.SelectedAttraction.Attraction_Type}</p>
                <h5>Description: </h5>
                <p>{this.state.SelectedAttraction.FullDescription}</p>
                <p><b>Opening Hours:</b> {this.state.SelectedAttraction.Opening_Hours}</p>
                <p><b>Adress:</b> {this.state.SelectedAttraction.Address}</p>
            </div>)
        }

    }
    AddAtractionToArray = () => {
        let AttractionPointInTrip = "";
        let tempArray = [];
        if (this.state.ListTripArray !== null) {
            for (let i = 0; i < this.state.ListTripArray.length; i++) {
            const element = this.state.ListTripArray[i];
            tempArray.push(element);
        }
        }
      
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
        tempArray.push(AttractionPointInTrip);
        console.log(tempArray);
        this.setState({
            ListTripArray: tempArray,
            open: !this.state.open
        })
        console.log(this.state.ListTripArray);
        localStorage.setItem('ListTripArray', JSON.stringify(tempArray));
        this.props.SaveListAtt(tempArray);
    }
    renderListTrip = () => {
        return this.state.ListTripArray.map((item) => <ListGroup.Item><p>{item.Point.AttractionName} -<b> From: </b><span className="GreenSpan">{item.FromHour}</span> <b> To: </b><span className="GreenSpan">{item.ToHour} </span><span className="editAttraction" onClick={() => { this.EditAttraction(item) }}><i class="fas fa-edit"></i></span><span className="delAttraction" onClick={() => { this.deleteLocation(item) }}><i class="fas fa-minus"></i></span></p></ListGroup.Item>)
    }
    EditAttraction = (item) => {
        console.log(item);
        this.setState({
            EditAttraction: true,
            item: item
        })
    }
    EditNewAttraction = () => {
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
        this.setState({
            ListTripArray: tempArray,
            EditAttraction: !this.state.EditAttraction
        })
        localStorage.setItem('ListTripArray', JSON.stringify(tempArray));
        this.props.SaveListAtt(tempArray);
        this.clearSelect();
    }
    clearSelect = () => {
        this.setState({
            SelectedAttraction: ""
        })
    }
    deleteLocation = (item) => {
        // console.log(item);
        let newArrayTemp = [];
        for (let i = 0; i < this.state.ListTripArray.length; i++) {
            const element = this.state.ListTripArray[i];
            if (element !== item) {
                newArrayTemp.push(element);
            }
        }
        this.setState({
            ListTripArray: newArrayTemp
        })
        localStorage.setItem('ListTripArray', JSON.stringify(newArrayTemp));
        this.props.SaveListAtt(newArrayTemp);
    }
    AddMarkers = () => {
        return (this.state.ListTripArray ? this.state.ListTripArray.map((item) => <Marker name={item.Point.AttractionName} position={item.Point.location} />) : null)
    }
    AddLine = () => {
        let tempArray = [];
        for (let i = 0; i < this.state.ListTripArray.length; i++) {
            const element = this.state.ListTripArray[i];
            tempArray.push(element.Point.location)
        }
        this.setState({
            pathCoordinates: tempArray
        })
    }
    FilerArray = () => {
        console.log(this.state.SelectedType);
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
            console.log(tempArray);
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
        console.log(d);
    }
    ifNull = (value) => {
        console.log(value);
        if (value === null || value === "") {
            this.setState({
                openDates: false,
                SelectedAttraction: ""
            })
        }
        else {
            this.setState({ SelectedAttraction: value, openDates: true })
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
    render() {
        const dragHandlers = { onStart: this.onStart, onStop: this.onStop };

        return (
            <Container fluid id={this.props.navbarOpenCheck} className="HomePageContainer" >

                <div className="row">
                    <div className="col-7 leftSide">
                        {this.state.open ?
                            <Draggable  {...dragHandlers}>
                                <div className="col-7 drag"> <div className={this.state.classnameDivAtt}><div className="ExistDiv"><span onClick={() => this.setState({ open: !this.state.open })} className="ExistSpan"><i class="fas fa-times"></i></span></div>
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
                                                options={this.props.listAPI}
                                                //groupBy={(option) => option.Region}
                                                getOptionLabel={(option) => option.name}
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
                        <div className="col-9">
                            <h3>Trip Details</h3>
                            <div>
                                <Button onClick={this.toggle}>Add Attraction</Button>
                            </div>
                            <div className="TripList">
                                {this.state.ListTripArray ? <ListGroup variant="flush" className="listGroupTrip">
                                    {this.renderListTrip()}</ListGroup> : null}
                            </div>
                        </div>
                    </div>
                    {/* AIzaSyCna1GfDry3zMNWiD9GlUK4VzUc1bu6_Wk */}

                    <div className="col-3 rightSide">
                        {/* <GoogleComponent
                            apiKey={'AIzaSyD_2VscttN1yLn9NLZYH_60pdYHfA6jzfQ'}
                            language={'en'}
                            country={'country:in|country:il'}
                            coordinates={true}
                            locationBoxStyle={'custom-style'}
                            locationListStyle={'custom-style-list'}
                            onChange={(e) => { this.setState({ place: e }) }} /> */}
                        {/* <LoadScript
                          //libraries= 'places'
                            googleMapsApiKey='AIzaSyD_2VscttN1yLn9NLZYH_60pdYHfA6jzfQ'>
                            <GoogleMap
                                mapContainerStyle={mapStyles}
                                zoom={8}
                                center={defaultCenter}
                            >

                                {this.AddMarkers()}
                                <Polyline
                path={this.state.pathCoordinates}
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
                            </GoogleMap>

                        </LoadScript> */}
                    </div>
                </div>
            </Container>

        );
    }
}

export default withRouter(BuildTrip2);
