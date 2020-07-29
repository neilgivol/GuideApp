import React, { Component } from 'react';
import "@kenshooui/react-multi-select/dist/style.css"
import { Card, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import MultiSelect from "@kenshooui/react-multi-select";
import '../Css/globalhome.css';
import Swal from 'sweetalert2';

const Guide = JSON.parse(localStorage.getItem('Guide'));

class Languages extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            items:this.props.LanguagesList,
            selectedItems: [],
            ListFromSQL: [],
            tempList: [],
            GuideListFromSQL: this.props.guideListLanguages,
            local: this.props.local
        };
        let local = this.state.local;
        this.apiUrl = 'http://localhost:49948/api';
        if (!local) {
            this.apiUrl = 'https://proj.ruppin.ac.il/bgroup10/PROD/api';
        }
    }

    componentDidMount() {
        let array = [];
        //רץ על כל השפות של המדריך מהמסד נתונים
        for (let i = 0; i < this.state.GuideListFromSQL.length; i++) {
            const SQLelement = this.state.GuideListFromSQL[i];
            //רץ על מערך אייטמס שמופיע למעלה
            for (let j = 0; j < this.state.items.length; j++) {
                const itemsElement = this.state.items[j];
                //בודק אם השפה של המדריך תואמת לשפה בריצה הנוכחית ע"י השוואת ה-איי די שלהם
                if (SQLelement.Language_Code === itemsElement.id) {
                    array.push(itemsElement);
                }
            }
        }
        this.setState({
            //מכניס את המערך הזמני למערך שפות שנבחרו ובכך מציג אותם למסך
            selectedItems: array
        })

        this.props.CheckMessagesNotifications();

    }

    handleChange(selectedItems) {
        this.setState({ selectedItems });
    }

    //עדכון שפות במסד נתונים
    UpdateAllLanguages = () => {
        let tempArrayGuideLanguages = [];
        let GuideCode = this.props.GuideDetails.gCode;
        for (let i = 0; i < this.state.selectedItems.length; i++) {
            const element = this.state.selectedItems[i];
            //יצירת אובייקט גייסון הכולל את המספר זיהוי של המדריך והמספר זיהוי של השפה
            const Guide_Language = {
                Guide_Code: GuideCode,
                Language_Code: element.id
            }
            tempArrayGuideLanguages.push(Guide_Language);
        }


        //  בדיקה האם למדריך יש  שפות מסוימות בסל בעת לחיצה על כפתור השמירה

        // אם אין שפות בסל בעת לחיצה על כפתור השמירה ובמסד הנתונים קיימות שפות - ימחקו כל השפות של המדריך
        if (tempArrayGuideLanguages.length === 0) {
            fetch(this.apiUrl + '/Language/' + GuideCode, {
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

        //אם יש שפות ברשימה- הן יוכנסו למסד הנתונים.
        else {
            this.PostLangGuideToSQL(tempArrayGuideLanguages);
        }
    }

    //הכנסת השפות למסד הנתונים
    PostLangGuideToSQL = (tempArrayGuideLanguages) => {
        fetch(this.apiUrl + '/Guide/PostGuideLanguage', {
            method: 'POST',
            body: JSON.stringify(tempArrayGuideLanguages),
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

    //עדכון רשימת השפות החדשה על המסך לאחר שהוכנסו למסד הנתונים
    UpdateList = (e) => {
        this.props.updateLanguage();
        let array = [];
        for (let i = 0; i < e.length; i++) {
            const SQLelement = e[i];
            for (let j = 0; j < this.state.items.length; j++) {
                const itemsElement = this.state.items[j];
                if (SQLelement.Language_Code === itemsElement.id) {
                    array.push(itemsElement);
                }
            }
        }
        this.setState({
            selectedItems: array
        });

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your languages updates!',
            showConfirmButton: false,
            timer: 1200
        });
    }
    render() {
        const { items, selectedItems } = this.state;
        return (
            <Card className="cardDivCenter">
                {/* <Card.Header>Languages</Card.Header> */}
                <ListGroup>
                    <ListGroupItem className="listgroupTitle">
                        <div className="row title"><h3>Choose Language:</h3></div>
                    </ListGroupItem>
                    <ListGroupItem id="languageGroupItem" className="">
                        <MultiSelect
                            items={items}
                            selectedItems={selectedItems}
                            onChange={this.handleChange}
                            showSearch={true}
                            showSelectAll={false}
                            responsiveHeight={600}
                        />
                    </ListGroupItem>
                </ListGroup>
                <div className="divBtnSave">
                    <Button className="BtnSave" onClick={() => { this.UpdateAllLanguages() }}>Save</Button>
                </div>
            </Card>
        );
    }
}

export default Languages;