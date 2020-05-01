import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import ReactLoading from 'react-loading'
//import DatePicker from 'react-date-picker'
import "react-datepicker/dist/react-datepicker.css";
//import firebase from './services/firebase';
import DatePicker from 'react-datepicker';
import '../Css/Home.css';
import Radio from '@material-ui/core/Radio';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import "../Css/BuildTrip.css";
import { Container } from "shards-react";
//import Autocomplete from 'react-autocomplete';
import { Button, Col, Row, Form, ListGroup, Card, ListGroupItem } from 'react-bootstrap';
//import { AutoComplete } from '@progress/kendo-react-dropdowns';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { Map, GoogleApiWrapper } from 'google-maps-react';
const mapStyles = {
    width: '600px',
    height: '1000px',
};

export class BuildTrip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ListCities: this.props.cities,
            open: false,
            CityName: "",
            CityDate: new Date(),
            NewArrayCities: [],
            listOpenDiv: false,
            classnameDiv: "modalAddCity noOpen",
            cityAndDate: null,
            listTrip: [],
            itemSelected: false,

        }
        this.toggle = this.toggle.bind(this);
    }
    handleInputChange(event, value) {
    //    this.setState({
    //        CityName:value
    //    })
    console.log(value);
    console.log(event.target.value);
      }
    AddCity = () => {
        let temp = this.state.CityName + " " + new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(this.state.CityDate);
        this.setState({
            cityAndDate: temp,
            open: !this.state.open
        })
        const tempArray = [];
        console.log(this.state.listTrip);
        for (let i = 0; i < this.state.listTrip.length; i++) {
            const element = this.state.listTrip[i];
            tempArray.push(element);
        }
        console.log(tempArray);
        tempArray.push(temp);
        this.setState({
            listTrip: tempArray
        })
        console.log(tempArray);
    }
    toggle() {
        this.setState({
            open: !this.state.open
        });
    }
   
    componentDidMount() {
        this.UploadAllCities();
    }
    UploadAllCities = () => {
        let NewArrayCities = [];
        for (let i = 0; i < this.state.ListCities.length; i++) {
            const element = this.state.ListCities[i];
            let city = {
                id: i,
                label: element.AreaName
            }
            NewArrayCities.push(city);
        }
        this.setState({
            NewArrayCities: NewArrayCities
        })
    }
    listOpen = () => {
        this.setState({
            listOpenDiv: !this.state.listOpenDiv
        })
        if (this.state.listOpenDiv) {
            this.setState({
                classnameDiv: "modalAddCity open"
            })
        }
        else {
            this.setState({
                classnameDiv: "modalAddCity noOpen"
            })
        }
    }

    render() {
        const { open, listOpenDiv } = this.state;
        //const [startDate, setStartDate] = useState(new Date());
        return (
            <Container fluid id={this.props.navbarOpenCheck} className="HomePageContainer" >
                <div className="row">
                    {this.state.open ? <div className={this.state.classnameDiv}><Form>  <Row form>
                        <Col md="6" className="form-group">
                            <label htmlFor="feCityName">City Name</label>
                            <Autocomplete
                                onChange={(event, value) => this.setState({CityName:value.label})} // prints the selected value
                                id="combo-box-demo"
                                options={this.state.NewArrayCities}
                                getOptionLabel={(option) => option.label}
                                style={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} margin="normal" label="Choose City" variant="outlined" />}
                            />

                        </Col>
                        <Col md="6" className="form-group">
                            <label htmlFor="feDate">Date</label>
                            <DatePicker
                                selected={this.state.CityDate}
                                onChange={(newDate) => this.setState({ CityDate: newDate })}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                timeCaption="time"
                                dateFormat="MMMM d, yyyy h:mm aa"
                            />
                        </Col>
                    </Row>
                        <Row>
                            <Col>
                                <Button className="BTNSubmit" variant="primary" onClick={() => { this.AddCity() }} >Update Your Account</Button>
                            </Col>

                        </Row></Form></div> : null}
                    <div className="col-6">
                        <h3>Trip Details</h3>
                        <div>
                            <Button onClick={this.toggle}>Click Me!</Button>

                        </div>
                        <ul>
                            {this.state.listTrip.map(item => <li>{item}</li>)}
                        </ul>
                        <Button></Button>
                    </div>
                    <div className="col-6">
                        <Map
                            google={this.props.google}
                            zoom={8}
                            style={mapStyles}
                            initialCenter={{ lat: 32.088780, lng: 34.854863 }}
                        />
                    </div>
                </div>
            </Container>

        );
    }
}
export default withRouter(GoogleApiWrapper((props) => ({
    apiKey: 'AIzaSyCna1GfDry3zMNWiD9GlUK4VzUc1bu6_Wk',
    language: 'he'
})

)(BuildTrip));
