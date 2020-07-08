import { MDBDataTableV5, MDBBtn, MDBInput } from 'mdbreact';
import React, { Component } from 'react';
import './DataTablesCss.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table-next';
import { Link, withRouter } from 'react-router-dom';
import { Button, Col, Row, Form, ListGroup, Card, ListGroupItem } from 'react-bootstrap';
import '../Css/globalhome.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import '../Profile/Css/ProfileDetails.css';
import Swal from "sweetalert2";

class LanguagesDataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ArrayLanguages: [],
            LCode: "",
            LanguageEnglishName: "",
            LanguageName: "",
            selectedLanguage: "",
            openEdit: false,
            local: this.props.local,
            isNew: false

        }
        let local = this.state.local;
        this.apiUrl = 'http://localhost:49948/api/';
        if (!local) {
            this.apiUrl = 'https://proj.ruppin.ac.il/bgroup10/PROD/api/';
        }
    }

    componentWillMount() {
        let tempArr = [];
        for (let i = 0; i < this.props.languages.length; i++) {
            const language = this.props.languages[i];
            let lan = {
                LCode: language.LCode,
                LName: language.LName,
                LNameEnglish: language.LNameEnglish,
                Edit: <div><Button type="button" className="" onClick={() => this.Edit(language)}>Edit</Button> <Button className="" type="button" onClick={() => this.Del(language)}>Delete</Button></div>,
            }
            tempArr.push(lan);

        }

        this.setState({
            ArrayLanguages: tempArr
        })
    }

    Del = (e) => {
        this.DeleteLanguage(e);
    }
    CloseDiv = () => {
        this.setState({
            openEdit: false
        })
    }



    changeHandlerLCode = (e) => {
        let LCode = { ...this.state.LCode }
        LCode.val = event.target.value;
        this.setState({ LCode })
    }

    changeHandlerLName = (e) => {
        let LCode = { ...this.state.LCode }
        LCode.val = event.target.value;
        this.setState({ LCode })
    }

    Edit = (e) => {
        this.setState({
            selectedLanguage: e,
            isNew: false,
            LanguageEnglishName: e.LNameEnglish,
            LanguageName: e.LName,
            openEdit: !this.state.openEdit,
        })
    }

    handleOnChangeEnglish = (e) => {
        this.setState({
            LanguageEnglishName: e.target.value
        })
    };

    handleOnChange = (e) => {
        this.setState({
            LanguageName: e.target.value
        })
    };

    UpdateLanguage = () => {
        let newLanguage = {
            LName: this.state.LanguageName,
            LNameEnglish: this.state.LanguageEnglishName
        }
        if (this.state.isNew) {
            this.PostLanguageToSQL(newLanguage);
        }
        else {
            let Language = {
                LName: newLanguage.LName,
                LNameEnglish: newLanguage.LNameEnglish,
                LCode: this.state.selectedLanguage.LCode
            }
            this.UpdateLanguageInSQL(Language);
        }
    }

    AddNewLanguage = () => {
        this.setState({
            LanguageName: "",
            LanguageEnglishName: "",
            isNew: true,
            openEdit: !this.state.openEdit
        })

    }

    DeleteLanguage = (language) => {
        fetch(this.apiUrl + 'Language/DeleteLang', {
            method: 'DELETE',
            body: JSON.stringify(language),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
            })
        })
            .then(res => {
                return res.json()
            })
            .then(
                (result) => {
                    console.log("result= ", result)
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: " השפה נמחקה בהצלחה",
                        showConfirmButton: false,
                        timer: 1800
                    });
                    this.setState({
                        isNew: false,
                        openEdit: false,
                        selectedLanguage: "",
                        LanguageEnglishName: "",
                        LanguageName: ""
                    })
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

    UpdateLanguageInSQL = (language) => {
        fetch(this.apiUrl + 'Language', {
            method: 'PUT',
            body: JSON.stringify(language),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
            })
        })
            .then(res => {
                return res.json()
            })
            .then(
                (result) => {
                    console.log("result= ", result)
                    if (result == 1) {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: " השפה נשמרה בהצלחה",
                            showConfirmButton: false,
                            timer: 1800
                        });
                    }
                    else {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: " השפה לא נשמרה",
                            showConfirmButton: false,
                            timer: 1800
                        });
                    }

                    this.setState({
                        isNew: false,
                        openEdit: false,
                        selectedLanguage: "",
                        LanguageEnglishName: "",
                        LanguageName: ""
                    })
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

    PostLanguageToSQL = (language) => {
        fetch(this.apiUrl + 'Language', {
            method: 'POST',
            body: JSON.stringify(language),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
            })
        })
            .then(res => {
                return res.json()
            })
            .then(
                (result) => {
                    console.log("result= ", result)
                    if (result == 1) {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: " השפה נשמרה בהצלחה",
                            showConfirmButton: false,
                            timer: 1800
                        });
                    }
                    else {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: "השפה לא נשמרה",
                            showConfirmButton: false,
                            timer: 1800
                        });
                    }

                    this.setState({
                        isNew: false,
                        openEdit: false,
                        selectedLanguage: "",
                        LanguageEnglishName: "",
                        LanguageName: ""
                    })
                },
                (error) => {
                    console.log("err post=", error);
                });
    }


    render() {
        const columns = [
            {
                label: "קוד שפה",
                field: "LCode",
                sort: "asc",
                width: 80,
            },
            {
                label: "שם השפה בעברית",
                field: "LName",
                sort: "asc",
                width: 80,
            },
            {
                label: "שם השפה באנגלית",
                field: "LNameEnglish",
                sort: "asc",
                width: 80,
            },
            {
                label: "עריכה",
                field: "Edit",
                sort: "asc",
                width: 80,
            },

        ];
        return (
            <div>
                {this.state.openEdit ?
                    <Card small className="mb-4 editFormDiv">
                        <Card.Header className="border-bottom headDiv">
                            <h6 className="m-0">Edit Language</h6>
                            <div className="ExistDiv">
                                <span onClick={() => { this.CloseDiv() }} className="ExistSpan"><i class="fas fa-times"></i></span>
                            </div>
                        </Card.Header>
                        <ListGroup flush>
                            <ListGroupItem className="p-3">
                                <Row form>
                                    <Col sm="12" className="form-group">
                                        <label>Name</label>
                                        <input
                                            className="form-control"
                                            placeholder="Name of the language"
                                            value={this.state.LanguageName}
                                            onChange={this.handleOnChangeEnglish}
                                        />
                                    </Col>
                                </Row>
                                <Row form>
                                    <Col sm="12" className="form-group">
                                        <label>English Name</label>
                                        <input
                                            className="form-control"
                                            placeholder="Name of the language in English"
                                            value={this.state.LanguageEnglishName}
                                            onChange={this.handleOnChange}
                                        />
                                    </Col>
                                </Row>

                            </ListGroupItem>
                        </ListGroup>
                        <Row>
                            <Col className="ColBtnSave">
                                <Button onClick={() => { this.UpdateLanguage() }} className="BtnSave">Save</Button>
                            </Col>

                        </Row>
                    </Card>
                    : null}
                <div className="row">
                    <div className="col BackAdmin">
                        <Link to="/"><i className="fa fa-undo" aria-hidden="true"></i></Link>
                    </div>
                    <div className="row titleDataTable"><h3>עריכת שפות</h3></div>
                    <div className="row btnAddDataTable"><Button onClick={this.AddNewLanguage} className="BtnSave"><h3>הוספת שפה</h3></Button></div>

                </div>
                <MDBDataTableV5 theadColor="#B5DBF8"
                    paging={true}
                    className="dataTable"
                    sortable
                    striped
                    bordered
                    paginationLabel={["הקודם", "הבא"]}
                    hover
                    entriesOptions={[5, 20, 25]}
                    entries={15}
                    pagesAmount={4}
                    data={{
                        columns: columns,
                        rows: this.state.ArrayLanguages,
                    }} />;
            </div>
        );
    }
}

export default withRouter(LanguagesDataTable);


