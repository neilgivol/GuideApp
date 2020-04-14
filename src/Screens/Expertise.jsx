import React, { Component } from 'react';
import { Card, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Css/Hobbies.css';
import HobbiesList from '../Components/HobbiesList';
import HobbieAdded from '../Components/HobbieAdded';
import '../Css/globalhome.css';


class Expertise extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemsInCart: [],
            itemsArray:this.props.AllExpertises,
            ListFromSQL:[]

        }
        let local = false;
        this.apiUrl = 'http://localhost:49948/api';
        if (!local) {
            this.apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api';
        }
    }
    componentDidMount(){
        if(this.props.GuideExpertises.length !== 0){
            this.UpdateList(this.props.GuideExpertises);
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
    UpdateExpertise = ()=>{
        let tempArray = [];
        for (let i = 0; i < this.state.itemsInCart.length; i++) {
            const element = this.state.itemsInCart[i].id;
            let Guide_Expertise = {
                guidegCode:this.props.GuideDetails.gCode,
                ExpertiseCode:element
            }
            tempArray.push(Guide_Expertise);
        }
        if (tempArray.length === 0) {
            console.log("del")
            fetch(this.apiUrl + '/Expertise/' + this.props.GuideDetails.gCode, {
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
                        ListFromSQL: result
                    });
                    this.UpdateList(this.state.ListFromSQL);
                },
                (error) => {
                console.log("err post=", error);
                });
                
        }else{
            this.PostExpertiseGuideToSQL(tempArray);

        }    }


    updateHobbies=()=>{
        let tempArray = [];
        for (let i = 0; i < this.state.itemsInCart.length; i++) {
            const element = this.state.itemsInCart[i].id;
            let Guide_Hobby = {
                guidegCode:this.props.GuideDetails.gCode,
                HobbyHCode:element
            }
            tempArray.push(Guide_Hobby);
        }

          }

          PostExpertiseGuideToSQL = (tempArray) => {
        fetch(this.apiUrl + '/Expertise', {
            method: 'POST',
            body: JSON.stringify(tempArray),
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
                    this.setState({
                        ListFromSQL: result
                    });
                    this.UpdateList(this.state.ListFromSQL);
                },
                (error) => {
                    console.log("err post=", error);
                });
    }
    UpdateList=(result)=>{
        let temp = [];
        console.log(result);
              for (let i = 0; i < result.length; i++) {
                  const element = result[i];
                  let expertise = {
                    id:element.Code,
                    name: element.NameE,
                    image:element.Picture
                }
                  temp.push(expertise);
              }
              this.setState({
                itemsInCart:temp
              })


              let tempArray = [];
              let boolifExist = false;
              for(let i = 0; i < this.state.itemsArray.length; i++){
                boolifExist = false;
                 let elementArray = this.state.itemsArray[i];
                 console.log(elementArray);
                  for(let j = 0; j < temp.length; j++){
                      let elementCart = temp[j];
                      console.log(elementCart);
                      if(elementArray.id === elementCart.id){
                          console.log("WHAT???");
                        boolifExist = true;
                      }
                  }
                  if(!boolifExist){
                      tempArray.push(elementArray);
                  }
              }
              this.setState({
                  itemsArray:tempArray
              })
    }
    render() {
        return (
            <Card className="cardDivCenter">
                {/* <Card.Header>Expertises</Card.Header> */}
                <ListGroup>
                    <ListGroupItem>
                        <div className="row title"><h2>Choose Expertises:</h2></div>
                    </ListGroupItem>
                    <ListGroupItem>
                        <div className='row HobbiesDiv'>
                            <div className='col HobbiesList col-md col-xs-12'>
                                <HobbiesList addToCart={this.addToCart} itemsInArray={this.state.itemsArray} />
                            </div>
                            <span className="middleLine col-md-1 col-xs-12"></span>
                            <div className='col HobbiesAdded col-md col-xs-12'>
                                <div className="row titleAdded"><span>selection:</span> </div>
                                <div className="row HobbiesListSide HobbieAddedList">
                                    {this.state.itemsInCart.map((item, key) =>
                                        <HobbieAdded removeFromCart={this.removeFromCart} item={item} key={item.id} />)}
                                </div>
                            </div>
                        </div>
                    </ListGroupItem>

                    <div>
                        <Button onClick={() => {this.UpdateExpertise() }}>Save</Button>
                    </div>
                </ListGroup>
            </Card>

        );
    }
}

export default Expertise;