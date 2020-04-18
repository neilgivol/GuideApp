import React, { Component } from 'react';
import { Card, ListGroup, ListGroupItem, Form, Button, Dropdown } from 'react-bootstrap';
import '../Css/Hobbies.css';
class HobbieCard extends Component {
    constructor(props){
        super(props);

    }
    render() {
        return (
            <div className="CardItem" onClick={()=>this.props.addToCart(this.props.oneItem)}>
            <img  className="CardImage" rel="preload" variant="top" src={this.props.oneItem.image} />
                    <div className="titleCardDiv"><h4 className="titleh">{this.props.oneItem.name}</h4></div>
            </div>
        );
    }
}

export default HobbieCard;