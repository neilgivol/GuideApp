import React, { Component } from 'react';
import ShopItem from '../ShopItem';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Css/Hobbies.css';
import HobbieAdded from '../Components/HobbieAdded';
import HobbiesList from '../Components/HobbiesList';
import { Card, ListGroup, ListGroupItem, Button } from 'react-bootstrap';

import art from '../Img/Hobbies/artMuseums.jpg';
import camping from '../Img/Hobbies/camping.jfif';
import classicMusic from '../Img/Hobbies/classicMusic.jpg';
import computerGamer from '../Img/Hobbies/computerGamer.jpg';
import cooking from '../Img/Hobbies/cooking.jpg';
import drawing from '../Img/Hobbies/drawing.jfif';
import diving from '../Img/Hobbies/diving.jpg';
import geopolitics from '../Img/Hobbies/geopolitics.jpg';
import paintball from '../Img/Hobbies/paintball.jpg';
import rafting from '../Img/Hobbies/rafting.jpg';
import rappelling from '../Img/Hobbies/rappelling.jpg';
import Sports2 from '../Img/Hobbies/Sports2.png';
import theater from '../Img/Hobbies/theater.jpg';
import photography from '../Img/Hobbies/photography.jfif';
import hiking from '../Img/Hobbies/hiking.jfif';

class Hobbies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemsArray: [
             new ShopItem(1,"art Museums",art),
             new ShopItem(2,"camping",camping),
             new ShopItem(3,"classic Music",classicMusic),
             new ShopItem(4,"computer Gamer",computerGamer),
             new ShopItem(5,"cooking",cooking),
             new ShopItem(6,"diving",diving),
             new ShopItem(7,"drawing",drawing),
             new ShopItem(8,"geopolitics",geopolitics),
             new ShopItem(9,"paintball",paintball),
             new ShopItem(10,"theater",theater),
             new ShopItem(11,"rafting",rafting),
             new ShopItem(12,"rappelling",rappelling),
             new ShopItem(13,"Sports",Sports2),
             new ShopItem(14,"photography",photography),
             new ShopItem(15,"hiking",hiking)
            ],
            itemsInCart: []
        }
    }

    addToCart = (newItem) => {
        const tempArr = [];
        for (let i = 0; i < this.state.itemsArray.length; i++) {
            const element = this.state.itemsArray[i];
            if (newItem.id !== element.id) {
                tempArr.push(element);
            }
        }
        this.setState({
            itemsInCart: [...this.state.itemsInCart, newItem],
            itemsArray: tempArr,
        });
    }

    removeFromCart = (newItem) => {
        const tempArr = [];
        for (let i = 0; i < this.state.itemsInCart.length; i++) {
            const element = this.state.itemsInCart[i];
            if (newItem.id !== element.id) {
                tempArr.push(element);
            }
        }
        this.setState({
            itemsArray: [...this.state.itemsArray, newItem],
            itemsInCart: tempArr,
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
                            <div className='row HobbiesDiv'>
                                <div className='col HobbiesList'>
                                    <HobbiesList addToCart={this.addToCart} itemsInArray={this.state.itemsArray} />
                                </div>
                                <span className="middleLine col-1"></span>
                                <div className='col HobbiesAdded'>
                                <div className="row titleAdded"><span>selection:</span> </div>
                                    <div className="row HobbiesListSide HobbieAddedList">
                                        {this.state.itemsInCart.map((item, key) =>
                                            <HobbieAdded removeFromCart={this.removeFromCart} item={item} key={item.id} />)}
                                    </div>
                                </div>
                            </div>
                    </ListGroupItem>

                    <div>
                        <Button onClick={() => { }}>Save</Button>
                    </div>
                </ListGroup>
            </Card>


        );
    }
}

export default Hobbies;