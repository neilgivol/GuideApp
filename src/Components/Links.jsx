import React, { Component } from 'react'
import facebook from '../Img/facebook.png';
import twitter from '../Img/twitter.png';
import website from '../Img/website.png';
import linkdin from '../Img/linkedin.png';
import instegram from '../Img/The_Instagram_Logo.jpg';
import 'react-dropdown/style.css';
import '../Css/ProfileDetails.css';
import Select from 'react-select';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import { Button, Col, Row, Form, ListGroup, Card, ListGroupItem } from 'react-bootstrap';

export default class Links extends Component {
    constructor(props) {
        super(props);
        this.state = {
            linkURL: "",
            fulllink: this.props.GuideLinks,
            user: this.props.Guide,
            options: [
                {
                    id: 0,
                    name: 'Select…',
                    value: null,
                    label: null
                },
                {
                    id: 1,
                    name: 'Instagram',
                    value: 'Instagram',
                    label: <div><img className="imageicons" src={instegram} /><span>Instagram</span></div>
                },
                {
                    id: 2,
                    name: 'Facebook',
                    value: 'Facebook',
                    label: <div><img className="imageicons" src={facebook} /><span>Facebook</span></div>
                },
                {
                    id: 3,
                    name: 'Twitter',
                    value: 'Twitter',
                    label: <div><img className="imageicons" src={twitter} /><span>Twitter</span></div>
                },
                {
                    id: 4,
                    name: 'Linkdin',
                    value: 'Linkdin',
                    label: <div><img className="imageicons" src={linkdin} /><span>Linkdin</span></div>
                },
                {
                    id: 5,
                    name: 'Website',
                    value: 'Website',
                    label: <div><img className="imageicons" src={website} /><span>Website</span></div>
                },
            ],
            selectedOption: null,
            linksfromSQL: this.props.linksfromSQL,
            local: this.props.local
        };
        let local = this.state.local;
        this.apiUrl = 'http://localhost:49948/api/';
        if (!local) {
            this.apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/';
        }
    }
componentDidMount(){
    this.setState({
        linksfromSQL:this.props.linksfromSQL
    })
    console.log(this.props.linksfromSQL);
}
    componentDidUpdate(PrevProps, PrevState) {
        if (PrevProps.Guide !== this.props.Guide) {
            this.setState({
                user: this.props.Guide
            })
        }
        if (PrevProps.GuideLinks !== this.props.GuideLinks) {
            this.setState({
                fulllink: this.props.GuideLinks
            })
        }
        if (PrevProps.linksfromSQL !== this.props.linksfromSQL) {
            this.setState({
                linksfromSQL: this.props.linksfromSQL
            })
        }
        
    }
    handleChangeList = (selectedOption) => {
        this.setState({ selectedOption });
    }
    handleChangeLinkUrl = (e) => {
        this.setState({
            linkURL: e.target.value
        })
    }

    //הוספת לינקים
    Addlinks = () => {
        console.log(this.state.linksfromSQL);
        const fullLinkList = [];
        const linksToSQL = [];
        let link;
        for (let i = 0; i < this.state.fulllink.length; i++) {
            const element = this.state.fulllink[i];
            fullLinkList.push(element);
        }
        let type = this.state.selectedOption;
        let urlLink = this.state.linkURL;
        if (type !== null || urlLink !== "") {
            let temppp = type.value + ' - ' + urlLink;
            fullLinkList.push(temppp);
            this.setState({
                fulllink: fullLinkList
            })
             link = {
                LinksCategoryLCode: type.id,
                linkPath: urlLink,
                guidegCode: this.state.user.gCode
            }
        }
        let linkSQL = JSON.parse(localStorage.getItem('linksFromSQL'));
        for (let i = 0; i < linkSQL.length; i++) {
            const element = linkSQL[i];
            linksToSQL.push(element);
        }
    
        if (type !== null || urlLink !== "") {
            linksToSQL.push(link);
            this.setState({
                linksfromSQL: linksToSQL
            })
        }

        console.log(this.state.linksfromSQL);
        console.log(linksToSQL);
        this.props.updateLinks(linksToSQL);
    }

    //מחיקת לינק
    delUrl = (e) => {
        let temparray = [];
        for (let i = 0; i < this.state.fulllink.length; i++) {
            const element = this.state.fulllink[i];
            if (element !== e) {
                temparray.push(element);
            }
        }
        this.setState({
            fulllink: temparray
        })
        this.updateLinksToSQL(temparray);
    }
    updateLinksToSQL = (array) => {
        console.log(array);
        let ListToSQL = [];
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            let tempArray = element.split(" - ");
            for (let j = 0; j < this.state.options.length; j++) {
                const typeLink = this.state.options[j];
                if (typeLink.name === tempArray[0]) {
                    tempArray[0] = typeLink.id;
                }
            }
            console.log(tempArray);
            let Link = {
                guidegCode: this.state.user.gCode,
                LinksCategoryLCode: tempArray[0],
                linkPath: tempArray[1]
            }
            ListToSQL.push(Link);
        }
        this.setState({
            linksFromSQL: ListToSQL
        })
        console.log(this.state.linksfromSQL);
        this.props.updateLinks(ListToSQL);
    }

    render() {
        return (
            <div>
                <Row>
                    <Col md="6" className="form-group">
                        <label htmlFor="feLinks">Link Type</label><br />
                    </Col>
                </Row>
                <Row>
                    <Col md="3" className="form-group">
                        <Select
                            values={this.state.selectedOption}
                            onChange={this.handleChangeList}
                            options={this.state.options} >
                        </Select>
                    </Col>
                    <Col md="7" className="form-group">
                        <input
                            className="form-control"
                            id="feInsertYourLink"
                            placeholder="Insert Your Link"
                            value={this.state.linkURL}
                            onChange={this.handleChangeLinkUrl}
                        />
                    </Col>
                    <Col md="2" className="form-group Addlinks">
                        <Button onClick={() => { this.Addlinks() }}>Add Link</Button>
                    </Col>
                    <Col md="12" className="form-group">
                        <ul>
                            {this.state.fulllink.map(item => <li onClick={() => { this.delUrl(item) }} value={item} className="urlAndType">{item} <i value={item} class="fas fa-backspace" ></i></li>)}
                        </ul>
                    </Col>

                </Row>
            </div>
        )
    }
}
