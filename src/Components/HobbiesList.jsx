import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import HobbieCard from './HobbieCard';
import '../Css/Hobbies.css';
class HobbiesList extends Component {
    constructor(props){
        super(props);

    }

    addToCart = (e) =>{
        return(
          this.props.addToCart(e)
        );
      }
    render() {
        return (
            <div className='row HobbiesListSide'>
         {this.props.itemsInArray.map(item =><HobbieCard addToCart = {this.addToCart} oneItem={item} />)}
         </div>
        );
    }
}

export default HobbiesList;