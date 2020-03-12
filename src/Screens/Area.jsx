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
            items: [
                { id: 0, label: "Haifa" },
                { id: 1, label: "Tel-Aviv", disabled: false },
                { id: 2, label: "Eilat", disabled: false },
                { id: 3, label: "Acre" },
                { id: 4, label: "Bethlehem" },
                { id: 5, label: "The Golan Heights" },
                { id: 6, label: "Lake Kinneret" },
                { id: 7, label: "Negev" }
            ],
            selectedItems: []
        };
    }

    handleChange(selectedItems) {
        this.setState({ selectedItems });
    }

    render() {
        const { items, selectedItems } = this.state;
        return (
            <div className="col-lg-8">
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
                                showSearch={false}
                                showSelectAll={false}
                            />
                        </ListGroupItem>
                    </ListGroup>
                </Card>
            </div>
        );
    }
}

export default Area;