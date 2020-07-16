import React, { Component } from 'react';
import './DataTablesCss.css';
import { Link, withRouter } from 'react-router-dom';
import { Button, Col, Row, ListGroup, Card, ListGroupItem } from 'react-bootstrap';
import '../Css/globalhome.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import '../Profile/Css/ProfileDetails.css';
import pic from '../Img/iconHead.png';
import FileUpload from '../Profile/Components/fileUpload';
import Swal from "sweetalert2";

class HobbiesDataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ArrayHobbies: [],
            openEdit: false,
            selectedHobby: { HName: "", Picture: "", HCode: "" },
            upload: false,
            showDivPicture: false,
            newProfilePicURL: "",
            HobbyName: "",
            HobbyPic: "",
            isNew: false,
            local: this.props.local,
            hobbies:this.props.hobbies


        }
        let local = this.state.local;
        this.apiUrl = 'http://localhost:49948/api/';
        if (!local) {
            this.apiUrl = 'https://proj.ruppin.ac.il/bgroup10/PROD/api/';
        }
    }
    componentDidMount(){
        this.setState({
            hobbies: this.props.hobbies
        })
        console.log(this.props.hobbies);
    }

    componentDidUpdate(PrevProps) {
        if (PrevProps.hobbies !== this.props.hobbies) {
            this.setState({
                hobbies: this.props.hobbies
            })
        }
      
    }


    Del = (e) => {
        this.DeleteHobbyFromSQL(e);
    }

    Edit = (e) => {
        console.log(e)
        this.setState({
            selectedHobby: e,
            isNew: false,
            HobbyName: e.HName,
            HobbyPic: e.Picture,
            openEdit: !this.state.openEdit,
        })
    }

    CloseDiv = () => {
        this.setState({
            openEdit: false
        })
    }

    changeup = () => {
        this.setState({
            upload: !this.state.upload
        })

        this.upload();
    }

    upload = () => {
        if (this.state.upload) {
            return <div className="uploadDivEdit"><FileUpload changeURL={this.ChangeProfileImage} local={this.props.local} /></div>
        }
        //this.ChangeProfileImage();
    }

    ChangeProfileImage = (newurl) => {
        this.setState({
            showDivPicture: true,
            newProfilePicURL: newurl,
            HobbyPic: "http://proj.ruppin.ac.il/bgroup10/PROD/uploadedFiles/" + newurl
        })
        this.ChangeProfilePic();
    }


    UpdateHobby = () => {
        let newHobby = {
            HName: this.state.HobbyName,
            Picture: this.state.HobbyPic
        }
        if (this.state.isNew) {
            this.PostHobbyToSQL(newHobby);
        }
        else {
            let Hobby = {
                HName: newHobby.HName,
                Picture: newHobby.Picture,
                HCode: this.state.selectedHobby.HCode
            }
            this.UpdateHobbyInSQL(Hobby);

        }
    }
    ChangeProfilePic = () => {
    }
    handleOnChange = (e) => {
        this.setState({
            HobbyName: e.target.value
        })
    };

    AddNewHobby = () => {
        let newPicture = { pic };
        console.log(newPicture);
        this.setState({
            HobbyName: "",
            HobbyPic: newPicture.pic,
            isNew: true,
            openEdit: !this.state.openEdit
        })

    }

    DeleteHobbyFromSQL = (hobby) => {
        fetch(this.apiUrl + 'Hobby/DeleteHobby', {
            method: 'DELETE',
            body: JSON.stringify(hobby),
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
                    if (result !== null) {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: " התחביב נמחק בהצלחה",
                            showConfirmButton: false,
                            timer: 1800
                        });
                        this.setState({
                            hobbies:result
                        })
                    }
                    else {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: "התחביב לא נמחק",
                            showConfirmButton: false,
                            timer: 1800
                        });
                    }
                    this.setState({
                        isNew: false,
                        openEdit: false,
                        selectedHobby: "",
                        HobbyName: "",
                        HobbyPic: "",
                        upload:false
                    })
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

    UpdateHobbyInSQL = (hobby) => {
        fetch(this.apiUrl + 'Hobby', {
            method: 'PUT',
            body: JSON.stringify(hobby),
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
                    if (result !== null) {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: " התחביב נשמר בהצלחה",
                            showConfirmButton: false,
                            timer: 1800
                        });
                        this.setState({
                            hobbies:result
                        })
                    }
                    else {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: "התחביב לא נשמר",
                            showConfirmButton: false,
                            timer: 1800
                        });
                    }
                    this.setState({
                        isNew: false,
                        openEdit: false,
                        selectedHobby: "",
                        HobbyName: "",
                        HobbyPic: "",
                        upload:false
                    })
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

    PostHobbyToSQL = (hobby) => {
        fetch(this.apiUrl + 'Hobby/AddNew', {
            method: 'POST',
            body: JSON.stringify(hobby),
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
                    if (result !== null) {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: " התחביב נשמר בהצלחה",
                            showConfirmButton: false,
                            timer: 1800
                        });
                        this.setState({
                            hobbies:result
                        })
                    }
                    else {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: "התחביב לא נשמר",
                            showConfirmButton: false,
                            timer: 1800
                        });
                    }
                    this.setState({
                        isNew: false,
                        openEdit: false,
                        selectedHobby: "",
                        HobbyName: "",
                        HobbyPic: "",
                        upload:false
                    })
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

    render() {
        return (
            <div className="AdminContainer">
                {this.upload()}
                {this.state.openEdit ?
                    <Card small className="mb-4 editFormDiv">
                        <Card.Header className="border-bottom headDiv">
                            <h6 className="m-0">Edit Hobby</h6>
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
                                            placeholder="Name of the hobby"
                                            value={this.state.HobbyName}
                                            onChange={this.handleOnChange}
                                        />
                                    </Col>
                                </Row>
                                <Row form>
                                    <Col sm="12" className="form-group">
                                        <label>Image</label>
                                        <div className="imageEditDivChange">
                                            <img src={this.state.HobbyPic} />
                                            <div className="uploadPicIconEdit"><span><i class="far fa-image" onClick={this.changeup}></i></span></div>
                                        </div>
                                    </Col>
                                </Row>

                            </ListGroupItem>
                        </ListGroup>
                        <Row>
                            <Col className="ColBtnSave">
                                <Button onClick={() => { this.UpdateHobby() }} className="BtnSave">Save</Button>
                            </Col>

                        </Row>
                    </Card>
                    : null}
                <div className="row">
                    <div className="col BackAdmin">
                        <Link to="/"><i className="fa fa-undo" aria-hidden="true"></i></Link>
                    </div>
                    <div className="row titleDataTable"><h3>עריכת תחביבים</h3></div>
                    <div className="row btnAddDataTable"><Button className="BtnSave" onClick={this.AddNewHobby}><h3>הוספת תחביב</h3></Button></div>
                </div>
                <div className="EditTableBody">{this.state.hobbies.map((hobby) =>
                    <div className="imageEditDiv">
                        <img src={hobby.Picture} />
                        <div className="fotterItemEdit">
                            <div onClick={() => { this.Del(hobby) }} className="col-sm-1 delIcon"><span><i class="fas fa-trash-alt"></i></span></div>
                            <div onClick={() => { this.Edit(hobby) }} className="col-sm-1 editIcon"><span><i class="fas fa-edit"></i></span></div>
                            <div className="col-sm-9 titleImage"><h5>{hobby.HName}</h5></div>

                        </div>
                    </div>)}</div>
            </div>
        );
    }
}

export default withRouter(HobbiesDataTable);


