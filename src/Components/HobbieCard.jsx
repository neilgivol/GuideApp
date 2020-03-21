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
            <img  className="CardImage"  variant="top" src={this.props.oneItem.image} />
                    <h4>{this.props.oneItem.name}</h4>

            </div>
        );
    }
}

export default HobbieCard;