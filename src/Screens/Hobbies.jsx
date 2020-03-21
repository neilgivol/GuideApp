import React, { Component } from 'react';
import ShopItem from '../ShopItem';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Css/Hobbies.css';
import HobbieAdded from '../Components/HobbieAdded';
import HobbiesList from '../Components/HobbiesList';
import HobbieCard from '../Components/HobbieCard';
import { Card, ListGroup, ListGroupItem, Form, Button, Dropdown } from 'react-bootstrap';

class Hobbies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemsArray: [
                new ShopItem(1, "Hat", 10, "https://d3m9l0v76dty0.cloudfront.net/system/photos/4141217/large/8f61421b9b9c5b933c55ed11c6a04061.jpg"),
                new ShopItem(2, "Pants", 20, "https://images.thenorthface.com/is/image/TheNorthFace/NF0A2TCT_T5C_hero?$638x745$"),
                new ShopItem(3, "T-shirt", 30, "https://bprint.co.il/wp-content/uploads/2017/10/136-1-262x262.jpg"),
                new ShopItem(4, "Hat", 10, "https://d3m9l0v76dty0.cloudfront.net/system/photos/4141217/large/8f61421b9b9c5b933c55ed11c6a04061.jpg"),
                new ShopItem(5, "Pants", 20, "https://images.thenorthface.com/is/image/TheNorthFace/NF0A2TCT_T5C_hero?$638x745$"),
                new ShopItem(6, "T-shirt", 30, "https://bprint.co.il/wp-content/uploads/2017/10/136-1-262x262.jpg"),
                new ShopItem(7, "Hat", 10, "https://d3m9l0v76dty0.cloudfront.net/system/photos/4141217/large/8f61421b9b9c5b933c55ed11c6a04061.jpg"),
                new ShopItem(8, "Pants", 20, "https://images.thenorthface.com/is/image/TheNorthFace/NF0A2TCT_T5C_hero?$638x745$"),
                new ShopItem(9, "T-shirt", 30, "https://bprint.co.il/wp-content/uploads/2017/10/136-1-262x262.jpg"),
                new ShopItem(10, "Pants", 20, "https://images.thenorthface.com/is/image/TheNorthFace/NF0A2TCT_T5C_hero?$638x745$"),
                new ShopItem(11, "T-shirt", 30, "https://bprint.co.il/wp-content/uploads/2017/10/136-1-262x262.jpg"),
                new ShopItem(12, "Hat", 10, "https://d3m9l0v76dty0.cloudfront.net/system/photos/4141217/large/8f61421b9b9c5b933c55ed11c6a04061.jpg"),
                new ShopItem(13, "Pants", 20, "https://images.thenorthface.com/is/image/TheNorthFace/NF0A2TCT_T5C_hero?$638x745$"),
                new ShopItem(14, "T-shirt", 30, "https://bprint.co.il/wp-content/uploads/2017/10/136-1-262x262.jpg")
            ],
            itemsInCart: [],
            totalPrice: 0
        }
    }

    addToCart = (newItem) => {
        const tempArr = [];
        for (let i = 0; i < this.state.itemsArray.length; i++) {
            const element = this.state.itemsArray[i];
            if (newItem.id != element.id) {
                tempArr.push(element);
            }
        }
        this.setState({
            itemsInCart: [...this.state.itemsInCart, newItem],
            itemsArray: tempArr,
            totalPrice: this.state.totalPrice += newItem.price
        });
    }

    removeFromCart = (newItem) => {
        const tempArr = [];
        for (let i = 0; i < this.state.itemsInCart.length; i++) {
            const element = this.state.itemsInCart[i];
            if (newItem.id != element.id) {
                tempArr.push(element);
            }
        }
        this.setState({
            itemsArray: [...this.state.itemsArray, newItem],
            itemsInCart: tempArr,
            totalPrice: this.state.totalPrice -= newItem.price
        });
    }
    render() {
        return (
            <Card>
                <Card.Header>Hobbies</Card.Header>
                <ListGroup>
                <ListGroupItem>
                            <div className="row title"><h2>Choose Hobbies:</h2></div>
                        </ListGroupItem>
                        <ListGroupItem>

                        <div className='container-fluid'>
                <div className='row'>
                    <div className='col-6 HobbiesList'>
                        <HobbiesList addToCart={this.addToCart} itemsInArray={this.state.itemsArray} />
                    </div>
                    <div className='col-lg-5 HobbiesAdded'>
                        <div className="row HobbiesListSide HobbieAddedList">
                            {this.state.itemsInCart.map((item, key) =>
                                <HobbieAdded removeFromCart={this.removeFromCart} item={item} key={item.id} />)}
                        </div>
                    </div>
                </div>
            </div>
                        </ListGroupItem>

                        <div>
                        <Button onClick={() => {  }}>Save</Button>
                    </div>
                </ListGroup>
            </Card>

           
        );
    }
}

export default Hobbies;