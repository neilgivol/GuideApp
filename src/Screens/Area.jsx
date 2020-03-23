import React, { Component, useState } from 'react';
import "@kenshooui/react-multi-select/dist/style.css"
import '../Css/signUpNavBar.css';
import { Switch, Route, Link, withRouter } from 'react-router-dom';
import { Card, ListGroup, ListGroupItem, Form, Button, Dropdown } from 'react-bootstrap';
import MultiSelect from "@kenshooui/react-multi-select";


class Area extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            items: [],
            selectedItems: [],
            allAreasCities:[]
        };

        let local = true;
        this.apiUrl = 'http://localhost:49948/api';
        if (!local) {
            this.apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api';
        }
    }
  


    componentDidMount(){
        for (let i = 1; i < this.props.AreasArray.length; i++) {
            const element = {
                id:i,
               label: this.props.AreasArray[i].AreaName
            };
            this.state.items.push(element);
        }

        let array=[];
        console.log(this.props.guideListAreas);
        for (let i = 0; i < this.props.guideListAreas.length; i++) {
            const SQLelement = this.props.guideListAreas[i];
            for (let j = 0; j < this.state.items.length; j++) {
                const itemsElement = this.state.items[j];
                if (SQLelement.Area_Code === itemsElement.id) {
                    array.push(itemsElement);
                }
            }
        }
        console.log(array);
        this.setState({
            selectedItems:array
        })
    }

    UpdateGuideAreas = () =>{
        let tempArrayGuideAreas = [];
        let GuideCode = this.props.GuideDetails.gCode;
        console.log(GuideCode);
        for (let i = 0; i < this.state.selectedItems.length; i++) {
            const element = this.state.selectedItems[i];
            const Guide_Area = {
                Guide_Code:GuideCode,
                Area_Code:element.id
            }
            tempArrayGuideAreas.push(Guide_Area);
        }
     console.log(tempArrayGuideAreas);
     this.PostAreaGuideToSQL(tempArrayGuideAreas);
    }
    PostAreaGuideToSQL = (tempArrayGuideAreas) => {
        console.log(tempArrayGuideAreas);
        fetch('http://localhost:49948/api/Area/PostGuideAreas', {
            method: 'POST',
            body: JSON.stringify(tempArrayGuideAreas),
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
                    console.log("fetch POST= ", result);
                    console.log(result);
                },
                (error) => {
                    console.log("err post=", error);
                });
    }



    GetGuideAreasFromSQL = () => {
        let ifExist = false;
        fetch(this.apiUrl + "/Language/GetGuideLanguages", {
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
                    this.setState({ ListFromSQL: result })
                },
                (error) => {
                    console.log("err post=", error);
                });
        if (this.state.ListFromSQL === null) {
            ifExist = false;
        }
        else {
            ifExist = true;
        }

        return ifExist;
    }


    PostLangGuideToSQL = (tempArrayGuideLanguages) => {
        console.log(tempArrayGuideLanguages);
        fetch('http://localhost:49948/api/Guide/PostGuideLanguage', {
            method: 'POST',
            body: JSON.stringify(tempArrayGuideLanguages),
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
                    console.log("fetch POST= ", result);
                    console.log(result);
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

    handleChange(selectedItems) {
        this.setState({ selectedItems });
    }

    render() {
        const { items, selectedItems } = this.state;
        return (
                <Card>
                    <Card.Header>Area Knowledge</Card.Header>
                    <ListGroup>
                        <ListGroupItem>
                            <div className="row title"><h2>Choose Area:</h2></div>
                        </ListGroupItem>
                        <ListGroupItem>
                            <MultiSelect
                                items={items}
                                selectedItems={selectedItems}
                                onChange={this.handleChange}
                                showSearch={true}
                                showSelectAll={false}
                            />
                        </ListGroupItem>
                    </ListGroup>
                    <div>
                        <Button onClick={() => { this.UpdateGuideAreas() }}>Save</Button>
                    </div>
                </Card>
        );
    }
}

export default Area;