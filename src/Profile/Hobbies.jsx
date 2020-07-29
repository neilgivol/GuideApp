import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Css/Hobbies.css';
import HobbieAdded from './Hobbies/HobbieAdded';
import HobbiesList from './Hobbies/HobbiesList';
import ReactLoading from 'react-loading'
import { Card, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import '.././Css/globalhome.css';
import Swal from 'sweetalert2';


class Hobbies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            myHobbies: this.props.guideListHobbies,
            itemsArray: this.props.AllHobbies,
            itemsInCart: [],
            ListFromSQL: [],
            local: this.props.local,
            isLoading: true
        }
        let local = this.state.local;
        this.apiUrl = 'http://localhost:49948/api';
        if (!local) {
            this.apiUrl = 'https://proj.ruppin.ac.il/bgroup10/PROD/api';
        }
    }
    componentDidMount() {
        if (this.props.guideListHobbies.length !== 0) {
            //שולח לפונקציה שמעדכנת את רשימת התחביבים של המדריך על המסך
            this.UpdateList(this.props.guideListHobbies);
        }
        else {
            this.setState({
                isLoading: false
            })
        }

        this.props.CheckMessagesNotifications();
    }

    //הוספת תחביב חדש למערך.
    addToCart = (newItem) => {
        const tempArr = [];
        for (let i = 0; i < this.state.itemsArray.length; i++) {
            const element = this.state.itemsArray[i];
            //בדיקה האם התחביב נמצא כבר במערך או לא
            if (newItem.id !== element.id) {
                tempArr.push(element);
            }
        }
        this.setState({
            itemsInCart: [...this.state.itemsInCart, newItem],
            itemsArray: tempArr,
        });
    }

    //מחיקת תחביב מהמערך
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

    //עדכון תחביבים במסד נתונים
    updateHobbies = () => {
        let tempArray = [];
        for (let i = 0; i < this.state.itemsInCart.length; i++) {
            const element = this.state.itemsInCart[i].id;
            //יצירת אובייקט גייסון הכולל את המספר זיהוי של המדריך והמספר זיהוי של התחביב
            let Guide_Hobby = {
                guidegCode: this.props.GuideDetails.gCode,
                HobbyHCode: element
            }
            tempArray.push(Guide_Hobby);
        }

        //  בדיקה האם למדריך יש  תחביבים מסוימים בסל בעת לחיצה על כפתור השמירה

        // אם אין תחביבים בסל בעת לחיצה על כפתור השמירה ובמסד הנתונים קיימים תחביבים - ימחקו כל התחביבים של המדריך
        if (tempArray.length === 0) {
            fetch(this.apiUrl + '/Hobby/' + this.props.GuideDetails.gCode, {
                method: 'DELETE',
                //body: JSON.stringify({id:7}),
                headers: new Headers({
                    'accept': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
                })
            })
                .then(res => {
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

        }

        //אם יש תחביבם ברשימה- הם יוכנסו למסד הנתונים.
        else {
            this.PostLangGuideToSQL(tempArray);
        }

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your hobbies update!',
            showConfirmButton: false,
            timer: 1200
        });
    }

    //הכנסת התחביבים של המדריך למסד הנתונים 
    PostLangGuideToSQL = (tempArray) => {
        fetch(this.apiUrl + '/Hobby', {
            method: 'POST',
            body: JSON.stringify(tempArray),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
            })

        })
            .then(res => {
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
    }

    //עדכון רשימת התחביבים החדשה על המסך לאחר שהוכנסו למסד הנתונים
    UpdateList = (result) => {
        this.props.updateHobbies();
        let temp = [];
        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            let hobby = {
                id: element.HCode,
                name: element.HName,
                image: element.Picture
            }
            temp.push(hobby);
        }
        this.setState({
            itemsInCart: temp
        })
        //בדיקה אילו מהתחביבים נמצאים בתוך רשימת התחביבים שנבחרו, יופיע בצד שמאל 
        let tempArray = [];
        let boolifExist = false;
        for (let i = 0; i < this.state.itemsArray.length; i++) {
            boolifExist = false;
            let elementArray = this.state.itemsArray[i];
            for (let j = 0; j < temp.length; j++) {
                let elementCart = temp[j];
                if (elementArray.id === elementCart.id) {
                    boolifExist = true;
                }
            }
            if (!boolifExist) {
                tempArray.push(elementArray);
            }
        }
        this.setState({
            itemsArray: tempArray,
            isLoading: false
        });
        localStorage.setItem('Hobby',tempArray);

    }
    render() {
        const { itemsArray, itemsInCart, ListFromSQL } = this.state;
        return (
            <Card className="cardDivCenter">
                {/* <Card.Header>Hobbies</Card.Header> */}
                <ListGroup>
                    <ListGroupItem className="listgroupTitle">
                        <div className="row title"><h3>Choose Hobbies:</h3></div>
                    </ListGroupItem>
                    <ListGroupItem id="AllHobbieDiv">
                        <div className='row HobbiesDiv'>
                            <div className='col HobbiesList col-md col-xs-12'>
                                <HobbiesList addToCart={this.addToCart} itemsInArray={this.state.itemsArray} />
                            </div>
                            <span className="middleLine hidden-md hidden-lg hidden-sm hidden-xl col-xs-12"></span>
                            <div className='col HobbiesAdded col-md col-xs-12'>
                                <div className="row titleAdded"><span>Selected:</span> </div>
                                <div className="row HobbiesListSide HobbieAddedList">
                                    {this.state.itemsInCart.map((item, key) =>
                                        <HobbieAdded removeFromCart={this.removeFromCart} item={item} key={item.id} />)}
                                </div>
                            </div>
                        </div>
                    </ListGroupItem>

                    <div className="divBtnSave">
                        <Button className="BtnSave" onClick={() => { this.updateHobbies() }}>Save</Button>
                    </div>
                </ListGroup>
                {/* Loading */}
                {this.state.isLoading ? (
                    <div className="viewLoading">
                        <ReactLoading
                            type={'spin'}
                            color={'#203152'}
                            height={'3%'}
                            width={'3%'}
                        />
                    </div>
                ) : null}
            </Card>


        );

    }
}

export default Hobbies;