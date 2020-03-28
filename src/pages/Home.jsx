import React, { Component } from 'react'
import '../Css/signUpNavBar.css';
import { Link, withRouter } from 'react-router-dom';
import ProfileDetails from "../Screens/ProfileDetails.jsx";
import Area from '../Screens/Area';
import ProfileCard from '../Components/ProfileCard.jsx';
import NavbarProfile from '../Components/NavbarProfile';
import Languages from '../Screens/Languages';
import '../Css/Home.css';
import Hobbies from '../Screens/Hobbies';
import Expertise from '../Screens/Expertise';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import facebook from '../Img/facebook.png';
import twitter from '../Img/twitter.png';
import website from '../Img/website.png';
import linkdin from '../Img/linkedin.png';
import instegram from '../Img/The_Instagram_Logo.jpg';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="#">
                IsraVisor
        </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            namePage: 'Profile Details',
            navbar: this.props.navbarOpenCheck,
            //allUsers: this.props.Allusers,
            Guide: '',
            GuideLanguages: [],
            GuideAreas: [],
            AllAreas: [],
            GuideLinks:[],
            fulllink:[],
            options: [
                {
                    id: 0,
                    name: 'Select…',
                    value: null,
                    label: null
                },
                {
                    id: 1,
                    name: 'Instegram',
                    value: 'Instegram',
                    label: <div><img className="imageicons" src={instegram} /><span>Instegram</span></div>
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
        };
        let local = true;
        this.apiUrl = 'http://localhost:49948/api/Guide';
        if (!local) {
            this.apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Guide';
        }
    }
    componentDidUpdate(PrevProps, state) {
        console.log(PrevProps);
    }
    componentWillMount() {
        const Guidetemp = JSON.parse(localStorage.getItem('Guide'));
        if (this.props.location.state === undefined) {
            this.setState({
                Guide: Guidetemp
            })
        }
        else {
            this.setState({
                Guide: this.props.location.state.GuideTemp
            })
        }
        this.getLinksFromSQL(Guidetemp);
    }
    componentDidMount(){
        this.GetLanguagesGuideList(this.state.Guide);
        this.GetAreasGuideList(this.state.Guide);
        //this.getLinksFromSQL(this.state.Guide);
        this.GetAllAreas();
    }
    getLinksFromSQL=(TempGuide)=>{
        fetch('http://localhost:49948/api/Link/'+TempGuide.gCode, {
            method: 'GET',
            headers: new Headers({
              'Content-Type': 'application/json; charset=UTF-8',
            })
          })
            .then(res => {
              return res.json()
            })
            .then(
              (result) => {
              this.setState({
                  GuideLinks:result
              })
              this.orgenzie(result);
            },
              (error) => {
                console.log("err post=", error);
              });
    }

    orgenzie=(links)=>{
        let templink ="";
        let temparraylinks = [];
         for (let j = 0; j < links.length; j++) {
             const link = links[j].LinksCategoryLCode;
             for (let i = 0; i < this.state.options.length; i++) {
                 const element = this.state.options[i];
                 if (element.id == link) {
                     temparraylinks.push(element.value + " - " + links[j].linkPath)
                 }
             }
         }
        this.setState({
            fulllink:temparraylinks
        })
        localStorage.setItem('links', JSON.stringify(temparraylinks));
    }
   

    GetAllAreas = () => {
        fetch("http://localhost:49948/api/Area", {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
            })
        })
            .then(res => {
                return res.json()
            })
            .then(
                (result) => {
                    this.setState({
                        AllAreas: result
                    })
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

    ClickPage2 = (e) => {
        this.setState({
            namePage: e
        });
    }
    funcGoogleFacebook = () => {
        return <ProfileCard GuideDetails={this.state.Guide} languages={this.state.GuideLanguages} areas={this.state.GuideAreas} GuideLinks={this.state.fulllink} />
    }

    func1 = () => {
        const namePage2 = this.state.namePage;
        if (namePage2 === "Profile Details") {
            return <ProfileDetails GuideDetails={this.state.Guide} GuideLinks={this.state.fulllink} />
        }
        else if (namePage2 === "Area Knowledge") {
            return <Area guideListAreas={this.state.GuideAreas} GuideDetails={this.state.Guide} AreasArray={this.state.AllAreas} />
        }
        else if (namePage2 === "Languages") {
            return <Languages guideListLanguages={this.state.GuideLanguages} GuideDetails={this.state.Guide} />
        }
        else if (namePage2 === "Hobbies") {
            return <Hobbies GuideDetails={this.state.Guide} />
        }
        else if (namePage2 === "Expertise") {
            return <Expertise GuideDetails={this.state.Guide} />
        }
    }

    GetAreasGuideList = (TempGuide) => {
        fetch("http://localhost:49948/api/Area/" + TempGuide.gCode, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
            })
        })
            .then(res => {
                return res.json()
            })
            .then(
                (result) => {
                    this.setState({ GuideAreas: result })
                    localStorage.setItem('areas', JSON.stringify(result));
                },
                (error) => {
                    console.log("err post=", error);
                });
    }


    GetLanguagesGuideList = (TempGuide) => {
        fetch("http://localhost:49948/api/Language/" + TempGuide.gCode, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
            })
        })
            .then(res => {
                return res.json()
            })
            .then(
                (result) => {
                    this.setState({ GuideLanguages: result })
                    localStorage.setItem('languages',JSON.stringify(result));
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

    render() {
        return (
            <div id={this.props.navbarOpenCheck} className="container-fluid HomePageContainer">
                <NavbarProfile ClickPage2={this.ClickPage2} />
                <div className="row homePage">
                    <div className="cardDiv col-lg-4 col-md-2 hidden-xs hidden-sm">
                        {this.funcGoogleFacebook()}
                    </div>
                    <div className="col-lg-8 col-md-10 col-sm-12 ">
                        {this.func1()}

                    </div>

                </div>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </div>
        )
    }
}

export default withRouter(Home)