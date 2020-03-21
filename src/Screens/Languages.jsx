import React, { Component } from 'react';
import "@kenshooui/react-multi-select/dist/style.css"
import '../Css/signUpNavBar.css';
import { Switch, Route, Link, withRouter } from 'react-router-dom';
import { Card, ListGroup, ListGroupItem, Form, Button, Dropdown } from 'react-bootstrap';
import MultiSelect from "@kenshooui/react-multi-select";
const Guide = JSON.parse(localStorage.getItem('Guide'));

class Languages extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            items: [
                { id: 1, label: "Hebrew / עברית" },
                { id: 2, label: "English", disabled: false },
                { id: 3, label: "Spainish / Español", disabled: false },
                { id: 4, label: "Arabic / العربية" },
                { id: 5, label: "Chinese / 古文" },
                { id: 6, label: "Dutch / Nederlands" },
                { id: 7, label: "French / Français" },
                { id: 8, label: "German / Deutsch" },
                { id: 9, label: "Italian / Italiano" },
                { id: 10, label: "Portuguese / Português" },
                { id: 11, label: "Russian / Русский" }

            ],
            selectedItems: [],
            ListFromSQL: [],
            tempList: [],
            GuideListFromSQL:this.props.guideListLanguages
        };
        let local = true;
        this.apiUrl = 'http://localhost:49948/api';
        if (!local) {
            this.apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api';
        }
    }
    componentWillMount(){
        let array=[];
        console.log(this.state.GuideListFromSQL);
        for (let i = 0; i < this.state.GuideListFromSQL.length; i++) {
            const SQLelement = this.state.GuideListFromSQL[i];
            for (let j = 0; j < this.state.items.length; j++) {
                const itemsElement = this.state.items[j];
                if (SQLelement.Language_Code === itemsElement.id) {
                    array.push(itemsElement);
                }
            }
        }
        console.log(array);
        this.setState({
            selectedItems:array
        })
    }

    handleChange(selectedItems) {
        this.setState({ selectedItems });
        console.log(this.state.selectedItems);
    }

    UpdateAllLanguages = () => {
        let tempArrayGuideLanguages = [];
        let GuideCode = this.props.GuideDetails.gCode;
        console.log(Guide.gCode);
        for (let i = 0; i < this.state.selectedItems.length; i++) {
            const element = this.state.selectedItems[i];
            const Guide_Language = {
                Guide_Code:GuideCode,
                Language_Code:element.id
            }
            tempArrayGuideLanguages.push(Guide_Language);
        }
     console.log(tempArrayGuideLanguages);
        this.PostLangGuideToSQL(tempArrayGuideLanguages);
        this.GetGuideLanguageSQL();
    }
    GetGuideLanguageSQL = () => {
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

    render() {
        const { items, selectedItems } = this.state;
        return (
                <Card>
                    <Card.Header>Languages</Card.Header>
                    <ListGroup>
                        <ListGroupItem>
                            <div className="row title"><h2>Choose Language:</h2></div>
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
                        <Button onClick={() => { this.UpdateAllLanguages() }}>Save</Button>
                    </div>
                </Card>
        );
    }
}

export default Languages;