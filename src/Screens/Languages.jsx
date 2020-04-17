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
            items: [
                { id: 1, label: "Hebrew / עברית" },
                { id: 2, label: "English", disabled: false },
                { id: 3, label: "Spainish / Español", disabled: false },
                { id: 4, label: "Arabic / العربية" },
                { id: 5, label: "Chinese / 古文" },
                { id: 6, label: "Dutch / Nederlands" },
                { id: 7, label: "French / Français" },
                { id: 8, label: "German / Deutsch" },
                { id: 9, label: "Italian / Italiano" },
                { id: 10, label: "Portuguese / Português" },
                { id: 11, label: "Russian / Русский" },
                { id: 12, label: "Polish / polski" },
                { id: 13, label: "Hungarian / Magyar" },
                { id: 14, label: "Swedish / Svenska" },
                { id: 15, label: "Norwegian / Norsk" },
                { id: 16, label: "Danish / Dansk" },
                { id: 17, label: "Yiddish / יידיש" },
                { id: 18, label: "Romanian / Română" }

            ],
            selectedItems: [],
            ListFromSQL: [],
            tempList: [],
            GuideListFromSQL: this.props.guideListLanguages,
            local: this.props.local
        };
        let local = this.state.local;
        this.apiUrl = 'http://localhost:49948/api';
        if (!local) {
            this.apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api';
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
            console.log("del")
            fetch(this.apiUrl + '/Language/' + GuideCode, {
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

    //עדכון רשימת השפות החדשה על המסך לאחר שהוכנסו למסד הנתונים
    UpdateList = (e) => {
        this.props.updateLanguage();
        console.log(e);
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
        console.log(array);
        this.setState({
            selectedItems: array
        });

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'הפרטים שלך עודכנו בהצלחה',
            showConfirmButton: false,
            timer: 1200
        });
    }
    render() {
        const { items, selectedItems } = this.state;
        return (
            <Card>
                {/* <Card.Header>Languages</Card.Header> */}
                <ListGroup>
                    <ListGroupItem>
                        <div className="row title"><h2>Choose Language:</h2></div>
                    </ListGroupItem>
                    <ListGroupItem>
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
                <div>
                    <Button onClick={() => { this.UpdateAllLanguages() }}>Save</Button>
                </div>
            </Card>
        );
    }
}

export default Languages;