import React, { Component } from 'react';
import "@kenshooui/react-multi-select/dist/style.css"
import '../Css/signUpNavBar.css';
import { Switch, Route, Link, withRouter } from 'react-router-dom';
import { Card, ListGroup, ListGroupItem, Form, Button, Dropdown } from 'react-bootstrap';
import MultiSelect from "@kenshooui/react-multi-select";

class Languages extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            items: [
                { id: 0, label: "Hebrew" },
                { id: 1, label: "English", disabled: false },
                { id: 2, label: "Spainish", disabled: false },
                { id: 3, label: "French" },
                { id: 4, label: "Portuguese" },
                { id: 5, label: "Arabic" },
                { id: 6, label: "Chinese" },
                { id: 7, label: "Russian" },
                { id: 8, label: "German" }

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
                    <Card.Header>Languages</Card.Header>
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
                </Card>
            </div>
        );
    }
}

export default Languages;