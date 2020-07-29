import React, { Component,useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';
import '../Profile/Css/Home.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import "./BuildTrip.css";
import moment from 'moment'
import { Button, Col, Row, Form, Card } from 'react-bootstrap';
import ReactLoading from "react-loading";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Swal from "sweetalert2";
import Draggable, { DraggableCore } from 'react-draggable'; // Both at the same time

class AddAttraction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classnameDivAtt: "modalAddattraction noOpen drag",
            open: this.props.open,
            SelectedType: "",
            types: this.props.types,
            openDates: false,
            SelectedAttraction: "",
            image: "",
            AllAttractions: this.props.AllAttractions,
            openNewAttraction: true,
            newAttraction: "",
            AddNewAttractionBool: false,
            RegionNewAttraction: "",
            CityNewAttraction: "",
            TypeNewAttraction: "",
            cities: this.props.cities,
            Regions: this.props.Regions,
            AttractionFromDate: new Date(),
            AttractionToDate: new Date(),
            lastDay: "",
            ListTripArray: this.props.ListTripArray,
            TouristsList: this.props.TouristsList,
            TripTourist: this.props.TripTourist,
            chosen: this.props.chosen,
            item: this.props.item,
            editAtt: false,
            labelRegion: "Choose Region",
            labelCity: "Choose City",
            ButtonAdd: "Add",
            isLoading: false,
        }

        this.EditNewAttraction = this.EditNewAttraction.bind(this);

    }
    //בודק אם לחצו על עריכת נקודה בטיול או שמדובר בהוספת נקודה חדשה
    componentDidMount() {
        if (this.props.EditAttraction) {
            if (this.state.item.Point.Address !== undefined) {
                this.setState({
                    editAtt: true,
                    AttractionFromDate: new Date(this.state.item.FromHour),
                    AttractionToDate: new Date(this.state.item.ToHour),
                    ButtonAdd: "Save"
                })
                this.ifNull(this.state.item.Point);
            }
            else {
                this.setState({
                    AttractionFromDate: new Date(this.state.item.FromHour),
                    AttractionToDate: new Date(this.state.item.ToHour),
                    newAttraction: this.state.item.Point.AttractionName,
                    RegionNewAttraction: this.state.item.Point.Region,
                    CityNewAttraction: this.state.item.Point.AreaName,
                    editAtt: true,
                    AddNewAttractionBool: true,
                    openDates: true,
                    SelectedAttraction: "",
                    labelRegion: this.state.item.Point.Region,
                    labelCity: this.state.item.Point.AreaName,
                    ButtonAdd: "Save"
                })
            }
        }
    }

    //מעדכנת את רשימת האטרקציות ע"פ הסוג אטרקציה שהמדריך בחר
    FilterArray = () => {
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

    //כאשר המדריך בוחר נקודה, נפתח לו אפשרות לבחור תאריכים
    ifNull = (value) => {
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

    //בודק אם יש לאטרקציה תמונה בטריפוסו
    searchPhoto = (nameAtt) => {
        $.ajax({
            url:
                "https://www.triposo.com/api/20200405/poi.json?location_id=Israel&fields=all&annotate=trigram:" + nameAtt + "&trigram=>=0.4&account=ZZR2AGIH&token=lq24f5n02dn276wmas9yrdpf9jq7ug3p",
            dataType: "json",
            success: this.search
        });
    }
    search = (res) => {
        this.setState({
            isLoading: true
        })
        let arr = [];
        if (res.results !== null) {
            for (let i = 0; i < res.results.length; i++) {
                const element = res.results[i];
                if (element.images !== null) {
                    for (let j = 0; j < element.images.length; j++) {
                        const image = element.images[j];
                        arr.push(image.source_url)
                    }
                }
            }
            if (arr.length > 0) {
                this.setState({ image: arr[0], isLoading: false })
                localStorage.setItem('imgAttraction', arr[0]);
            }
            else {
                this.setState({ isLoading: false })
            }
        }
        else {
            this.setState({ isLoading: false })
        }

    }

    //מציג את ההאטרקציה לפני שבוחרים בה
    renderAttractionDetails = () => {
        let URL = "";
        if (this.state.SelectedAttraction.Product_Url !== "" || this.state.SelectedAttraction.Product_Url !== null) {
            URL = <p><a href={this.state.SelectedAttraction.Product_Url} target="_blank">Attraction Site</a></p>
        }
        if (this.state.SelectedAttraction.Region === this.state.SelectedAttraction.AreaName) {
            return (<div className="DetailsAttraction"><h3>{this.state.SelectedAttraction.AttractionName}</h3>
                <p><b>Region Name:</b> {this.state.SelectedAttraction.Region}</p>
                <p><b>Attraction Type:</b> {this.state.SelectedAttraction.Attraction_Type}</p>
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
                <p><b>Opening Hours:</b> {this.state.SelectedAttraction.Opening_Hours}</p>
                {URL}
                <p><b>Adress:</b> {this.state.SelectedAttraction.Address}</p>
            </div>)
        }
    }

    //אם מדובר באטרקציה חדשה ולא כזאת ממשרד התיירות
    AddNewAttractionName = (e) => {
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

    //ערים ממשרד התיירות
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
            this.setState({
                cities: newArray
            })
        }
    }


    //מוסיף אטרקציה למסלול טיול
    AddAtractionToArray = () => {
        let boolCorrectDates = true;
        this.setState({
            lastDay: ""
        })
        if (this.state.ListTripArray !== null) {
            for (let i = 0; i < this.state.ListTripArray.length; i++) {
                const element = this.state.ListTripArray[i];
                if (this.state.AttractionFromDate < element.ToHour && this.state.AttractionFromDate > element.FromHour) {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "Dates can't be between " + element.FromHour.toLocaleString() + " to " + element.ToHour.toLocaleString() + "!" ,
                        showConfirmButton: true,
                    });
                    boolCorrectDates = false;
                }
            }
        }
        if(new Date(this.state.AttractionFromDate).toLocaleString() ==  new Date(this.state.AttractionToDate).toLocaleString()){
            Swal.fire({
                position: "center",
                icon: "error",
                title: "You must add new dates",
                showConfirmButton: true,
            });
            boolCorrectDates = false;
        }

        if(boolCorrectDates){
        let TripTourist = "";
        let AttractionPointInTrip = "";
        let tempArray = [];
        if (this.state.ListTripArray !== null) {
            for (let i = 0; i < this.state.ListTripArray.length; i++) {
                const element = this.state.ListTripArray[i];
                tempArray.push(element);
            }
        }
        //בודק אם האטרקציה מתוך רשימת האטרקציות או הכנסה ידנית של המדריך
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
                let ddd = this.OrderDaysTrip(list);
                tempArray = ddd;

                TripTourist = {
                    TouristEmail: this.state.chosen.Email,
                    TripListArray: tempArray
                }

                this.setState({
                    AttractionFromDate: new Date(),
                    ListTripArray: tempArray,
                    open: !this.state.open,
                    TripTourist: TripTourist,
                    newAttraction: "",
                    RegionNewAttraction: "",
                    CityNewAttraction: "",
                    TypeNewAttraction: "",
                    cities: this.props.cities,
                    openNewAttraction: false,
                    SelectedAttraction: ""
                })
                let temparr2 = [];
                if (localStorage.getItem('TripTourists')) {
                    let temparr = JSON.parse(localStorage.getItem('TripTourists'));
                    temparr2 = [];
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
            this.searchPhoto(this.state.SelectedAttraction.AttractionName);
            let img = localStorage.getItem('imgAttraction');
            AttractionPointInTrip = {
                Point: this.state.SelectedAttraction,
                FromHour: new Date(this.state.AttractionFromDate),
                ToHour: new Date(this.state.AttractionToDate)
            };
            if (img !== null) {
                AttractionPointInTrip.Point.Image = img;
            }
            tempArray.push(AttractionPointInTrip);
            const list = tempArray.sort((a, b) => {
                if (new Date(a.FromHour) < new Date(b.FromHour)) return -1;
                if (new Date(a.FromHour) > new Date(b.FromHour)) return 1;
                return 0;
            });
            let ddd = this.OrderDaysTrip(list);
            tempArray = ddd;
            TripTourist = {
                TouristEmail: this.state.chosen.Email,
                TripListArray: tempArray
            }

            this.setState({
                AttractionFromDate: new Date(),
                ListTripArray: tempArray,
                open: !this.state.open,
                TripTourist: TripTourist,
                newAttraction: "",
                RegionNewAttraction: "",
                CityNewAttraction: "",
                TypeNewAttraction: "",
                cities: this.props.cities,
                openNewAttraction: false,
                SelectedAttraction: ""
            })
            let temparr2 = [];
            if (localStorage.getItem('TripTourists')) {
                let temparr = JSON.parse(localStorage.getItem('TripTourists'));
                temparr2 = [];
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
        localStorage.removeItem('imgAttraction');
        this.props.MoveList(tempArray, TripTourist);
        this.props.CloseOpenDiv();
    }
    }

    //מסדר את המסלול לפי ימים
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

    //לצאת ממודל ההוספה/עריכה
    CloseDiv = () => {
        this.setState({ open: !this.state.open })
        this.props.CloseOpenDiv();
    }

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
                FromHour: new Date(this.state.AttractionFromDate),
                ToHour: new Date(this.state.AttractionToDate)
            };
        }
        else {
            AttractionPointInTrip = {
                Point: this.state.SelectedAttraction,
                FromHour: new Date(this.state.AttractionFromDate),
                ToHour: new Date(this.state.AttractionToDate)
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
        const list = tempArray.sort((a, b) => {
            if (new Date(a.FromHour) < new Date(b.FromHour)) return -1;
            if (new Date(a.FromHour) > new Date(b.FromHour)) return 1;
            return 0;
        });
        tempArray = list;

        TripTourist = {
            TouristEmail: this.state.chosen.Email,
            TripListArray: tempArray
        }
        this.setState({
            ListTripArray: tempArray,
            EditAttraction: !this.state.EditAttraction,
            TripTourist: TripTourist
        })


        let temparr2 = [];
        if (localStorage.getItem('TripTourists')) {
            let temparr = JSON.parse(localStorage.getItem('TripTourists'));
            temparr2 = [];
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
        //localStorage.setItem('ListTripArray', JSON.stringify(tempArray));
        //this.props.SaveListAtt(tempArray);
        this.clearSelect();
        tempArray = this.OrderDaysTrip(tempArray)
        this.props.MoveList(tempArray, TripTourist);
        this.props.CloseOpenDiv();
    }

    //מציג טבלת עריכת האטרציה
    clearSelect = () => {
        this.setState({
            SelectedAttraction: "",
            AttractionToDate: new Date(),
            AttractionFromDate: new Date()
        })
    }

    //עריכה או הוספה?
    EditOrNew = () => {
        if (this.state.editAtt) {
            this.EditNewAttraction();
        }
        else {
            this.AddAtractionToArray();
        }
    }

    render() {
        const dragHandlers = { onStart: this.onStart, onStop: this.onStop };
        return (
            <div className="zindex">
                {this.state.isLoading ? (
                    <div className="viewLoading">
                        <ReactLoading
                            type={"spin"}
                            color={"#203152"}
                            height={"3%"}
                            width={"3%"}
                        />
                    </div>
                ) : null}
                {this.state.open ?
                    <div>
                        <Draggable  {...dragHandlers}>
                            <div className="hidden-sm hidden-xs">
                                <div className="col-md-7 addAttDiv drag">
                                    <Card className={this.state.classnameDivAtt}>
                                        <Card.Header className="border-bottom headDiv">
                                            <h6 className="m-0">Add Attraction</h6>
                                            <div className="ExistDiv">
                                                <span onClick={() => { this.CloseDiv() }} className="ExistSpan"><i class="fas fa-times"></i></span>
                                            </div>
                                        </Card.Header>
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
                                                <Col className="FilterButton" md="4"><Button onClick={() => { this.FilterArray() }}>Filter</Button></Col>
                                            </Col>
                                            {this.state.editAtt ? <Col md="12" className="colAutoName form-group">
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
                                            </Col> : <Col md="12" className="form-group">
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
                                                </Col>}
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
                                                        renderInput={(params) => <TextField {...params} margin="normal" label={this.state.labelRegion} variant="outlined" />}
                                                    />
                                                    <Autocomplete
                                                        onChange={(event, value) => this.setState({ CityNewAttraction: value })} // prints the selected value
                                                        id="combo-box-demo"
                                                        options={this.state.cities}
                                                        //groupBy={(option) => option.Region}
                                                        getOptionLabel={(option) => option.Name}
                                                        //style={}

                                                        renderInput={(params) => <TextField {...params} margin="normal" label={this.state.labelCity} variant="outlined" />}
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
                                            {this.state.openDates ?
                                                <Col md="5" className="form-group">
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
                                            {this.state.openDates ?
                                                <Col md="5" className="form-group">
                                                    <label htmlFor="feDate">To Date</label>
                                                    <DatePicker
                                                        selected={this.state.AttractionToDate}
                                                        onChange={(newDate) => this.setState({ AttractionToDate: newDate })}
                                                        showTimeSelect
                                                        timeFormat="HH:mm"
                                                        timeIntervals={15}
                                                        timeCaption="time"
                                                        minDate={this.state.AttractionFromDate}
                                                    />
                                                </Col> : null}
                                        </Row>
                                            <Row>
                                                <Col>
                                                    <Button className="BTNSubmit" variant="primary" onClick={() => { this.EditOrNew() }} >{this.state.ButtonAdd}</Button>
                                                </Col>
                                            </Row></Form>
                                    </Card>
                                </div>
                            </div>
                        </Draggable>
                        <div className="hidden-xl hidden-lg hidden-md">
                            <div id="addAttphone" className="addAttDiv col-sm-12 drag">
                                <Card className={this.state.classnameDivAtt}>
                                    <Card.Header className="border-bottom headDiv">
                                        <h6 className="m-0">Add Attraction</h6>
                                        <div className="ExistDiv">
                                            <span onClick={() => { this.CloseDiv() }} className="ExistSpan"><i class="fas fa-times"></i></span>
                                        </div>
                                    </Card.Header>
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
                                            <Col className="FilterButton" md="4"><Button onClick={() => { this.FilterArray() }}>Filter</Button></Col>
                                        </Col>
                                        {this.state.editAtt ? <Col md="12" className="colAutoName form-group">
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
                                        </Col> : <Col md="12" className="form-group">
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
                                            </Col>}
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
                                            id="datePicker"
                                            popperPlacement="bottom-end"
                                                excludeOutOfBoundsTimes
                                                selected={this.state.AttractionFromDate}
                                                onChange={(newDate) => this.setState({ AttractionFromDate: newDate })}
                                                showTimeSelect
                                                timeFormat="HH:mm"
                                                timeIntervals={15}
                                                timeCaption="time"
                                                minDate={new Date()}
                                            />
                                        </Col> : null}
                                        {this.state.openDates ? <Col md="5" className="form-group">
                                            <label htmlFor="feDate">To Date</label>
                                            <DatePicker
                                            id="datePicker"
                                            popperPlacement="bottom-end"
                                                selected={this.state.AttractionToDate}
                                                onChange={(newDate) => this.setState({ AttractionToDate: newDate })}
                                                showTimeSelect
                                                timeFormat="HH:mm"
                                                timeIntervals={15}
                                                timeCaption="time"
                                                minDate={this.state.AttractionFromDate}
                                            />
                                        </Col> : null}
                                    </Row>
                                        <Row>
                                            <Col>
                                                <Button className="BTNSubmit" variant="primary" onClick={() => { this.EditOrNew() }} >Add</Button>
                                            </Col>
                                        </Row></Form>
                                </Card>
                            </div>
                        </div>
                    </div> : null}

            </div>


        );
    }
}

export default AddAttraction;