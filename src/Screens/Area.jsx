import React, { Component, useState } from 'react';
import "@kenshooui/react-multi-select/dist/style.css"
import '../Css/signUpNavBar.css';
import '../Css/globalhome.css';
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
            allAreasCities:[],
            guideList:this.props.guideListAreas
        };

        let local = true;
        this.apiUrl = 'http://localhost:49948/api';
        if (!local) {
            this.apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api';
        }
    }
  
    componentDidUpdate(PrevProps,state){
    if (PrevProps.guideListAreas !== this.props.guideListAreas) {
        this.setState({
            guideList:this.props.guideListAreas
        })
    }
    console.log(PrevProps.guideListAreas);
    console.log(this.props.guideListAreas);

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
        for (let i = 0; i < this.state.guideList.length; i++) {
            const SQLelement = this.state.guideList[i];
            for (let j = 0; j < this.state.items.length; j++) {
                const itemsElement = this.state.items[j];
                if (SQLelement.Area_Code === itemsElement.id) {
                    array.push(itemsElement);
                }
            }
        }
        this.setState({
            selectedItems:array
        })
    }

    UpdateGuideAreas = () =>{
        let tempArrayGuideAreas = [];
        let GuideCode = this.props.GuideDetails.gCode;
        for (let i = 0; i < this.state.selectedItems.length; i++) {
            const element = this.state.selectedItems[i];
            const Guide_Area = {
                Guide_Code:GuideCode,
                Area_Code:element.id
            }
            tempArrayGuideAreas.push(Guide_Area);
        }

        if (tempArrayGuideAreas.length === 0) {
            console.log("del")
            fetch(this.apiUrl + '/Area/' + GuideCode, {
                method: 'DELETE',
                //body: JSON.stringify({id:7}),
                headers: new Headers({
                'accept': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
                })
                })
                .then(res => {
                console.log('res=', res);
                return res.json()
                })
                .then(
                (result) => {
                    this.setState({
                        guideList:result
                    })
                    this.UpdateNewAreas(this.state.guideList);
                },
                (error) => {
                console.log("err post=", error);
                });
                
        }else{
            this.PostAreaGuideToSQL(tempArrayGuideAreas);
        }
    }
    PostAreaGuideToSQL = (tempArrayGuideAreas) => {
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
                    this.setState({
                        guideList:result
                    })
                    this.UpdateNewAreas(this.state.guideList);
                },
                (error) => {
                    console.log("err post=", error);
                });
    }
    UpdateNewAreas=()=>{
        this.props.updateArea(this.state.guideList);
        let array=[];
        for (let i = 0; i < this.state.guideList.length; i++) {
            const SQLelement = this.state.guideList[i];
            for (let j = 0; j < this.state.items.length; j++) {
                const itemsElement = this.state.items[j];
                if (SQLelement.Area_Code === itemsElement.id) {
                    array.push(itemsElement);
                }
            }
        }
        this.setState({
            selectedItems:array
        })
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