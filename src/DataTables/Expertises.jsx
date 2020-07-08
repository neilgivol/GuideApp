import { MDBDataTableV5, MDBBtn } from 'mdbreact';
import React, { Component } from 'react';
import './DataTablesCss.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table-next';
import { Link, withRouter } from 'react-router-dom';
import { Button, Col, Row, Form, ListGroup, Card, ListGroupItem, Container } from 'react-bootstrap';
import '../Css/globalhome.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import '../Profile/Css/ProfileDetails.css';
import pic from '../Img/iconHead.png';
import FileUpload from '../Profile/Components/fileUpload';
import Swal from "sweetalert2";

class ExpertisesDataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ArrayExpertises: [],
            openEdit: false,
            selectedExpertise: { NameE: "", Picture: "", Code: "" },
            upload: false,
            showDivPicture: false,
            newProfilePicURL: "",
            ExpertiseName: "",
            ExpertisePic: "",
            isNew: false,
            local: this.props.local,


        }
        let local = this.state.local;
        this.apiUrl = 'http://localhost:49948/api/';
        if (!local) {
            this.apiUrl = 'https://proj.ruppin.ac.il/bgroup10/PROD/api/';
        }
    }

    Del = (e) => {
        this.DeleteExpertiseFromSQL(e);
    }

    Edit = (e) => {
        this.setState({
            isNew: false,
            selectedExpertise: e,
            ExpertiseName: e.NameE,
            ExpertisePic: e.Picture,
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
    }

    ChangeProfileImage = (newurl) => {
        this.setState({
            showDivPicture: true,
            newProfilePicURL: newurl,
            ExpertisePic: "http://proj.ruppin.ac.il/bgroup10/PROD/uploadedFiles/" + newurl
        })
        this.ChangeProfilePic();
    }


    UpdateExpertise = () => {

        let newExpertise = {
            NameE: this.state.ExpertiseName,
            Picture: this.state.ExpertisePic
        }
        if (this.state.isNew) {
            this.PostExpertiseToSQL(newExpertise);
        }
        else {
            let Expertise = {
                NameE: newExpertise.NameE,
                Picture: newExpertise.Picture,
                Code: this.state.selectedExpertise.Code
            }
            this.UpdateExpertiseInSQL(Expertise);
        }

    }
    ChangeProfilePic = () => {
    }

    handleOnChange = (e) => {
        this.setState({
            ExpertiseName: e.target.value
        })
    };

    AddnewExpertise = () => {
        let newPicture = { pic };
        this.setState({
            ExpertiseName: "",
            ExpertisePic: newPicture.pic,
            selectedExpertise: "",
            isNew: true,
            openEdit: !this.state.openEdit
        })
    }
    DeleteExpertiseFromSQL = (expertise) => {
        fetch(this.apiUrl + 'Expertise/DeleteExpertise', {
            method: 'DELETE',
            body: JSON.stringify(expertise),
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
                        title: " ההתמחות נמחקה בהצלחה",
                        showConfirmButton: false,
                        timer: 1800
                    });


                    this.setState({
                        isNew: false,
                        openEdit: false,
                        selectedExpertise: "",
                        ExpertiseName: "",
                        ExpertisePic: "",
                        upload:false

                    })
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

    UpdateExpertiseInSQL = (expertise) => {
        fetch(this.apiUrl + 'Expertise', {
            method: 'PUT',
            body: JSON.stringify(expertise),
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
                            title: " ההתמחות נשמרה בהצלחה",
                            showConfirmButton: false,
                            timer: 1800
                        });
                    }
                    else {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: " ההתמחות לא נשמרה",
                            showConfirmButton: false,
                            timer: 1800
                        });
                    }

                    this.setState({
                        isNew: false,
                        openEdit: false,
                        selectedExpertise: "",
                        ExpertiseName: "",
                        ExpertisePic: "",
                        upload:false

                    })
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

    PostExpertiseToSQL = (expertise) => {
        fetch(this.apiUrl + 'Expertise/AddNew', {
            method: 'POST',
            body: JSON.stringify(expertise),
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
                            title: " ההתמחות נשמרה בהצלחה",
                            showConfirmButton: false,
                            timer: 1800
                        });
                    }
                    else {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: " ההתמחות לא נשמרה",
                            showConfirmButton: false,
                            timer: 1800
                        });
                    }
                    this.setState({
                        isNew: false,
                        openEdit: false,
                        selectedExpertise: "",
                        ExpertiseName: "",
                        ExpertisePic: "",
                        upload:false

                    })
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

    render() {
        return (
            <Container fluid className="Cont">
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
                                            placeholder="Name of the expertise"
                                            value={this.state.ExpertiseName}
                                            onChange={this.handleOnChange}
                                        />
                                    </Col>
                                </Row>
                                <Row form>
                                    <Col sm="12" className="form-group">
                                        <label>Image</label>
                                        <div className="imageEditDivChange">
                                            <img src={this.state.ExpertisePic} />
                                            <div className="uploadPicIconEdit"><span><i class="far fa-image" onClick={this.changeup}></i></span></div>
                                        </div>
                                    </Col>
                                </Row>

                            </ListGroupItem>
                        </ListGroup>
                        <Row>
                            <Col className="ColBtnSave">
                                <Button onClick={() => { this.UpdateExpertise() }} className="BtnSave">Save</Button>
                            </Col>

                        </Row>
                    </Card>
                    : null}
                <div className="row">
                    <div className="col BackAdmin">
                        <Link to="/"><i className="fa fa-undo" aria-hidden="true"></i></Link>
                    </div>
                    <div className="row titleDataTable"><h3>עריכת התמחויות</h3></div>
                    <div className="row btnAddDataTable"><Button className="BtnSave" onClick={this.AddnewExpertise}><h3>הוספת התמחות</h3></Button></div>
                </div>
                <div className="EditTableBody">{this.props.expertises.map((exper) =>
                    <div className="imageEditDiv">
                        <img src={exper.Picture} />
                        <div className="fotterItemEdit">
                            <div onClick={() => { this.Del(exper) }} className="col-sm-1 delIcon"><span><i class="fas fa-trash-alt"></i></span></div>
                            <div onClick={() => { this.Edit(exper) }} className="col-sm-1 editIcon"><span><i class="fas fa-edit"></i></span></div>
                            <div className="col-sm-9 titleImage"><h5>{exper.NameE}</h5></div>

                        </div>
                    </div>)}</div>
            </Container>
        );
    }
}

export default withRouter(ExpertisesDataTable);


