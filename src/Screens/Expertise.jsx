import React, { Component } from 'react';
import { Card, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Css/Hobbies.css';
import HobbiesList from '../Components/HobbiesList';
import HobbieAdded from '../Components/HobbieAdded';

import beach from '../Img/Expertise/beach.jpg';
import bible from '../Img/Expertise/bible.jpg';
import christianity from '../Img/Expertise/christianity.jpg';
import culinary from '../Img/Expertise/culinary.jpg';
import desert from '../Img/Expertise/desert.jpg';
import historyplaces from '../Img/Expertise/historyplaces.jpg';
import islam from '../Img/Expertise/islam.webp';
import judaism from '../Img/Expertise/judaism.jfif';
import kabbalah from '../Img/Expertise/kabbalah.jpg';
import parties from '../Img/Expertise/parties.jpg';
import shopping from '../Img/Expertise/shopping.jfif';
import shoppingInMarket from '../Img/Expertise/shoppingInMarket.jpg';
import wineTours from '../Img/Expertise/wineTours.jpg';
import zionism from '../Img/Expertise/zionism.jpg';



class Expertise extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemsInCart: [],
            itemsArray: [
                { id: 1, name: "zionism", image:zionism},
                { id: 2, name: "wine Tours", image:wineTours},
                { id: 3, name: "shopping In Markets", image:shoppingInMarket},
                { id: 4, name: "shopping In Malls", image:shopping},
                { id: 5, name: "parties", image:parties},
                { id: 6, name: "kabbalah", image:kabbalah},
                { id: 7, name: "judaism", image:judaism},
                { id: 8, name: "islam", image:islam},
                { id: 9, name: "history places", image:historyplaces},
                { id: 10, name: "desert", image:desert},
                { id: 11, name: "culinary", image:culinary},
                { id: 12, name: "christianity", image:christianity},
                { id: 13, name: "bible", image:bible},
                { id: 14, name: "beach", image:beach}
            ]
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
        });
    }
    render() {
        return (
            <Card>
                <Card.Header>Expertises</Card.Header>
                <ListGroup>
                    <ListGroupItem>
                        <div className="row title"><h2>Choose Expertises:</h2></div>
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

export default Expertise;