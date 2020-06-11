import React, { Component } from "react";
import "./App.css";
import SignIn from "./Screens/SignIn";
import { Switch, Route, withRouter } from "react-router-dom";
import SignUp from "./Screens/SignUp";
import Chat from "./pages/Chat.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import Home from "./pages/Home.jsx";
import ResponsiveNavigation from "./Components/ResponsiveNavigation.jsx";
import ResetPassword from "./Screens/ResetPassword";
import ProfileDetails from "./Screens/ProfileDetails";
import menu from "./Img/menu.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import MainFooter from "./Components/MainFooter";
import FileUpload from "./Components/fileUpload.jsx";
import $ from "jquery";
import { toast, ToastContainer } from "react-toastify";
import { myFirestore, myStorage, myFirebase } from "./services/firebase";
import ReactLoading from "react-loading";
import BuildTrip2 from "./pages/BuildTrip2";
import BuildTrip from "./pages/BuildTrip";
import Swal from "sweetalert2";
import ChatRealTime from "./pages/ChatRealTime";
import TouristProfile from "./Components/TouristProfile";
import Contact from './pages/Contact';
const navLinks = [
    {
        text: "Profile",
        path: "/home",
        icon: "ion-ios-home"
    },
    {
        text: "Chat",
        path: "/chat",
        icon: "ion-ios-chatbubbles"
    },
    {
        text: "Trips",
        path: "/BuildTrip2",
        icon: "ion-ios-map"
    },
    {
        text: "Contact Us",
        path: "/contact",
        icon: "ion-ios-mail"
    }
];
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            guides: [],
            local: true,
            navbarCheckOpen: "open",
            tempGuide: "",
            AllAreas: [],
            AllHobbies: [],
            AllExpertises: [],
            GuidesFromGovIL: [],
            LanguagesList: [],
            LanguagesListOrgenized: [],
            authentucated: false,
            isLoading: false,
            name: "",
            password: "",
            email: "",
            Attractions: [],
            tourist: "",
            AttractionsArray: [],
            ListAttractions: [],
            Cities: [],
            listAtt: [],
            listAPITypes: []
        };
        let local = this.state.local;
        this.apiUrl = "http://localhost:49948/api/";
        if (!local) {
            this.apiUrl = "https://proj.ruppin.ac.il/bgroup10/PROD/api/";
        }
    }
    //מביא את כל האזורים, התחביבים וההתמחויות שנמצאות במסד נתונים
    componentDidMount() {
        this.GetAllHobbies();
        this.GetAllExpertises();
        this.GetGuidesGOVFromSQL();
        //this.GetAllAttractionsFromSQL();
        let temparr = JSON.parse(localStorage.getItem("AllAtt"));
        console.log(temparr);
        if (temparr !== null) {
            this.setState({
                Attractions: temparr
            });
        } else {
            this.GetAllAttractions();
        }
        let citiesLocal = JSON.parse(localStorage.getItem("cities"))
        console.log(citiesLocal)
        if (citiesLocal !== null) {
            this.setState({
                Cities:citiesLocal
            })
        }
        else{
            this.GetAllCitiesFromGOVIL();
        }

        this.GetAllLanguages();
        //this.listAPI();
    }
    showToast = (type, message) => {
        switch (type) {
            case 0:
                toast.warning(message);
                break;
            case 1:
                toast.success(message);
            default:
                break;
        }
    };

    listAPI = () => {
        let arraylist = JSON.parse(localStorage.getItem("ListApi"));
        if (arraylist !== null) {
            this.setState({
                listAPITypes: arraylist
            });
        } else {
            this.setState({
                loading: true
            });
            let arr = [
                "beaches",
                "museums",
                "art",
                "culture",
                "history",
                "wildlife",
                "adrenaline",
                "amusementparks",
                "camping",
                "climbing",
                "diving",
                "rafting",
                "markets",
                "poitype-Shopping_centre",
                "wineries",
                "zoos",
                "poitype-Archaeological_site",
                "district-old_city",
                "character",
                "!eatingout"
            ];

            this.setState({
                listAPITypes: arr
            });

            this.GetAllPlaces(arr);
        }
    };
    //Add Beaches
    GetAttList = (number, cityName, arr) => {
        let Type = "&tag_labels=" + arr[0];
        for (let i = 1; i < arr.length; i++) {
            const element = arr[i];
            if (element.startsWith("!")) {
                Type += "&tag_labels=" + element;
            } else {
                Type += "|" + element;
            }
        }
        console.log(Type);
        let num = "";
        if (number !== 0) {
            num = "&offset=" + number;
        }
        $.ajax({
            url:
                "https://www.triposo.com/api/20200405/poi.json?location_id=" +
                cityName +
                "&fields=all&count=100" +
                num +
                Type +
                "&order_by=name&account=ZZR2AGIH&token=lq24f5n02dn276wmas9yrdpf9jq7ug3p",
            dataType: "json",
            success: this.addMore
        });
    };
    addMore = (data) => {
        console.log(data);
        for (let i = 0; i < data.results.length; i++) {
            const element = data.results[i];
            this.state.listAtt.push(element);
        }
        if (data.more) {
            this.GetAttList(
                this.state.listAtt.length,
                "Israel",
                this.state.listAPITypes
            );
        }

        if (!data.more) {
            console.log("FINISH");
            console.log(this.state.listAtt);
            this.setState({
                loading: false
            });
            let arrtemp = this.state.listAtt;
            // localStorage.setItem('ListApi', JSON.stringify(arrtemp));
        }
    };

    GetAllPlaces = (arr) => {
        this.GetAttList(0, "Israel", arr);
    };
    //סוגר ופותח את התפריט שנמצא בשלב שאחרי ההתחברות.
    navbarCheck = (nav) => {
        if (nav) {
            this.setState({
                navbarCheckOpen: "close"
            });
        } else {
            this.setState({
                navbarCheckOpen: "open"
            });
        }
    };

    //?????
    GetGuidesFromSQL = () => {
        fetch(this.apiUrl, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8"
            })
        })
            .then((res) => {
                return res.json();
            })
            .then(
                (result) => {
                    this.setState({
                        guides: result
                    });
                },
                (error) => {
                    console.log("err post=", error);
                }
            );
    };

    //מביא את כל האטרקציות שבאתר משרד התיירות
    GetAllAttractions = () => {
        this.setState({
            isLoading: true
        });
        var data = {
            resource_id: "85e01a85-a1b5-4206-97ce-ba1162cbcd08", // the resource id
            limit: 800
        };
        $.ajax({
            url: "https://data.gov.il/api/action/datastore_search",
            data: data,
            dataType: "json",
            success: this.AddAtractions
        });
    };
    GetAllCitiesFromGOVIL = () => {
      
        var data = {
            resource_id: "eb548bfa-a7ba-45c4-be7d-2e8271f55f70", // the resource id
            limit: 150
        };
        $.ajax({
            url: "https://data.gov.il/api/action/datastore_search",
            data: data,
            dataType: "json",
            success: this.AddCities
        });
    };
    AddCities = (data) => {
        console.log(data.result.records);
        localStorage.setItem('cities',JSON.stringify(data.result.records))
        this.setState({
            Cities: data.result.records
        });
    };
    //מוסיף את רשימת האטרקציות מאתר משרד התיירות
    AddAtractions = (data) => {
        console.log(data);
        this.setState({
            Attractions: data.result.records
        });
        let NewArray = [];
        for (let i = 0; i < this.state.Attractions.length; i++) {
            const element = this.state.Attractions[i];
            let point = {
                AttractionName: element.Name,
                AreaName: element.City,
                location: {
                    lng: element.X,
                    lat: element.Y
                },
                Opening_Hours: element.Opening_Hours,
                FullDescription: element.FullDescription,
                Address: element.Address,
                Attraction_Type: element.Attraction_Type,
                Region: element.Region
            };
            point.Attraction_Type = point.Attraction_Type.split(";");
            if (point.AreaName === "") {
                point.AreaName = element.Region;
            }
            if (point.Address.includes("'")) {
                point.Address = point.Address.replace("'", "`");
                point.Address = point.Address.replace("'", "`");
            }
            if (point.AttractionName.includes("'")) {
                point.AttractionName = point.AttractionName.replace("'", "`");
                point.AttractionName = point.AttractionName.replace("'", "`");
            }
            if (point.AreaName.includes("'")) {
                point.AreaName = point.AreaName.replace("'", "`");
                point.AreaName = point.AreaName.replace("'", "`");
            }
            if (point.FullDescription.includes("<p>")) {
                point.FullDescription = point.FullDescription.replace(
                    "<p>",
                    ""
                );
                point.FullDescription = point.FullDescription.replace(
                    "<p>",
                    ""
                );
                point.FullDescription = point.FullDescription.replace(
                    "<p>",
                    ""
                );
                point.FullDescription = point.FullDescription.replace(
                    "<p>",
                    ""
                );
                point.FullDescription = point.FullDescription.replace(
                    "<p>",
                    ""
                );
                point.FullDescription = point.FullDescription.replace(
                    "<p>",
                    ""
                );
            }
            if (point.FullDescription.includes("</p>")) {
                point.FullDescription = point.FullDescription.replace(
                    "</p>",
                    ""
                );
                point.FullDescription = point.FullDescription.replace(
                    "</p>",
                    ""
                );
                point.FullDescription = point.FullDescription.replace(
                    "</p>",
                    ""
                );
                point.FullDescription = point.FullDescription.replace(
                    "</p>",
                    ""
                );
                point.FullDescription = point.FullDescription.replace(
                    "</p>",
                    ""
                );
                point.FullDescription = point.FullDescription.replace(
                    "</p>",
                    ""
                );
            }
            NewArray.push(point);
        }
        this.setState({
            Attractions: NewArray
        });
        console.log(NewArray);
        localStorage.setItem("AllAtt", JSON.stringify(NewArray));

        this.setState({
            isLoading: false
        });
    };

    // postAttractionsToSQL = (attractions) => {
    //     fetch(this.apiUrl + "BuildTrip/AddAllAtractions", {
    //         method: "POST",
    //         body: JSON.stringify(attractions),
    //         headers: new Headers({
    //             "Content-type": "application/json; charset=UTF-8" //very important to add the 'charset=UTF-8'!!!!
    //         })
    //     })
    //         .then((res) => {
    //             console.log("res=", res);
    //             return res.json();
    //         })
    //         .then(
    //             (result) => {
    //                 console.log(result);
    //             },
    //             (error) => {
    //                 console.log("err post=", error);
    //             }
    //         );
    // };

    //מביא את כל המדריכים שבאתר משרד התיירות
    GetGuidesGOVFromSQL = () => {
        // this.setState({
        //     isLoading: true
        // });
        var data = {
            resource_id: "5f5afc43-639a-4216-8286-d146a8e048fe", // the resource id
            limit: 10000
        };
        $.ajax({
            url: "https://data.gov.il/api/action/datastore_search",
            data: data,
            dataType: "json",
            success: this.AddGovList
        });
    };
    //מוסיף את רשימת המדריכים מאתר משרד התיירות
    AddGovList = (data) => {
        console.log(data);
        this.setState({
            GuidesFromGovIL: data.result.records
        });

    };

    //בדיקה אם המדריך ממשרד התיירות נרשם באפליקציה או לא
    CheckIfGuidGovILExistInSQL = (licenseNum) => {
        this.setState({ isLoading: true });
        //pay attention case sensitive!!!! should be exactly as the prop in C#!
        fetch(this.apiUrl + "Guide/CheckIfGuideGovIlExistInSQL", {
            method: "POST",
            body: JSON.stringify(licenseNum),
            headers: new Headers({
                "Content-type": "application/json; charset=UTF-8" //very important to add the 'charset=UTF-8'!!!!
            })
        })
            .then((res) => {
                console.log("res=", res);
                return res.json();
            })
            .then(
                (result) => {
                    if (result !== null) {
                        this.setState({
                            tempGuide: result
                        });
                        console.log(result);
                        this.AddtoFirebase(result);
                        //this.AddLanguages(this.state.tempGuide, Languages);
                    } else {
                        this.checkIfGuideExistInGovilList(licenseNum);
                    }
                },
                (error) => {
                    console.log("err post=", error);
                }
            );
    };
    //בודק אם מדריך שהכניס מספר אישי קיים באתר משרד התירות
    checkIfGuideExistInGovilList = (licenseNum) => {
        let ifExist = false;
        console.log(licenseNum);
        for (let i = 0; i < this.state.GuidesFromGovIL.length; i++) {
            const element = this.state.GuidesFromGovIL[i];
            let num = element.License_Number;
            if (num == licenseNum) {
                ifExist = true;
                this.AddGuideFromGovIL(licenseNum);
                break;
            }
        }
        if (!ifExist) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: " You Not In Gov",
                showConfirmButton: false,
                timer: 1200
            });
            this.setState({
                isLoading: false
            });
        }
    };

    //מוסיף מדריך מאתר משרד התיירות
    AddGuideFromGovIL = async (licenseNum) => {
        for (let i = 0; i < this.state.GuidesFromGovIL.length; i++) {
            const element = this.state.GuidesFromGovIL[i];
            let num = element.License_Number;
            if (num == licenseNum) {
                let Email;
                if (element.Email !== "") {
                    Email = JSON.stringify(element.Email);
                    Email = Email.split(">");
                    Email = Email[1].split("<");
                    Email = Email[0];
                } else {
                    const { value: email } = await Swal.fire({
                        title: "Input email address",
                        input: "email",
                        inputPlaceholder: "Enter your email address",
                        confirmButtonText: "Continue"
                    });
                    Email = email;

                    //Email = "";
                }
                //let Email = this.AddEmailToGovIlGuide(element);
                if (Email !== "") {
                    let FirstName = this.AddFirstName(element);
                    let LastName = this.AddLastName(element);
                    let DescriptionGuide = this.AddDescription(element);
                    let Phone = this.AddPhoneNumber(element);
                    let Languages = this.AddLanguagesToGovIlGuide(element);
                    let SignDate = new Date();
                    let signDateCorrect = SignDate.toLocaleDateString("en-US");
                    let Guide = {
                        Email: Email,
                        FirstName: FirstName,
                        LastName: LastName,
                        Phone: Phone,
                        License: licenseNum,
                        SignDate: signDateCorrect,
                        DescriptionGuide: DescriptionGuide
                    };
                    console.log(Guide);
                    this.PostGuideToSQLFromGovIL(Guide, Languages);
                } else {
                    alert("ddcccc");
                }
            }
        }
    };

    //הוספת שם פרטי+משפחה למדריך משרד התיירות
    AddFirstName = (element) => {
        let FirstName = "";
        let LastName = "";
        let fullname = JSON.stringify(element.Name);
        if (fullname !== "") {
            fullname = fullname.split('"');
            fullname = fullname[1];
            fullname = fullname.split(" ");
            if (fullname.length > 2) {
                for (let i = 0; i < fullname.length; i++) {
                    const element = fullname[i];
                    if (i === fullname.length - 1) {
                        FirstName = element;
                    } else if (i === fullname.length - 2) {
                        LastName += element;
                    } else {
                        LastName += element + " ";
                    }
                }
            } else if (fullname.length === 2) {
                FirstName = fullname[1];
                LastName = fullname[0];
            } else {
                LastName = "Guide";
                FirstName = fullname[0];
            }
        }
        return FirstName;
    };

    //הוספת שם פרטי+משפחה למדריך משרד התיירות
    AddLastName = (element) => {
        let FirstName = "";
        let LastName = "";
        let fullname = JSON.stringify(element.Name);
        if (fullname !== "") {
            fullname = fullname.split('"');
            fullname = fullname[1];
            fullname = fullname.split(" ");
            if (fullname.length > 2) {
                for (let i = 0; i < fullname.length; i++) {
                    const element = fullname[i];
                    if (i === fullname.length - 1) {
                        FirstName = element;
                    } else if (i === fullname.length - 2) {
                        LastName += element;
                    } else {
                        LastName += element + " ";
                    }
                }
            } else if (fullname.length === 2) {
                FirstName = fullname[1];
                LastName = fullname[0];
            } else {
                LastName = "Guide";
                FirstName = fullname[0];
            }
        }
        return LastName;
    };
    //הוספת מידע כללי על מדריך
    AddDescription = (element) => {
        let DescriptionGuide = JSON.stringify(element.FullDescription);
        DescriptionGuide = DescriptionGuide.split('"');
        DescriptionGuide = DescriptionGuide[1].split("<p>");
        let tempDescription = "";
        for (let i = 0; i < DescriptionGuide.length; i++) {
            const element = DescriptionGuide[i];
            let templine = element.split("</p>");
            if (i === 0 || i === DescriptionGuide.length - 1) {
                tempDescription += templine[0];
            } else {
                tempDescription += templine[0] + " ";
            }
        }
        DescriptionGuide = tempDescription;
        DescriptionGuide = DescriptionGuide.replace("'", "`");
        console.log(DescriptionGuide);
        return DescriptionGuide;
    };
    //הוספת טלפון למדריך מאתר משרד התיירות
    AddPhoneNumber = (element) => {
        //הוספת טלפון
        let Phone = JSON.stringify(element.Phone);
        if (Phone !== "") {
            Phone = Phone.split(">");
            Phone = Phone[1].split("<");
            Phone = Phone[0].split("-");
            let PhoneTemp = "";
            for (let i = 0; i < Phone.length; i++) {
                const element = Phone[i];
                PhoneTemp += element;
            }
            Phone = PhoneTemp;
            let Phone1 = Phone.slice(0, 4);
            let Phone2 = Phone.slice(4, 7);
            let Phone3 = Phone.slice(7, 10);
            let Phone4 = Phone.slice(10, 13);
            Phone = Phone1 + " " + Phone2 + " " + Phone3 + " " + Phone4;
        }
        return Phone;
    };
    //הוספת שפות למדריך ממשרד התיירות
    AddLanguagesToGovIlGuide = (element) => {
        let gLanguages = JSON.stringify(element.Language);
        gLanguages = gLanguages.split(";");
        let Languages = [];
        for (let i = 0; i < gLanguages.length; i++) {
            let element = gLanguages[i];
            if (i === gLanguages.length - 1) {
                element = element.split('"');
                Languages.push(element[0]);
            } else if (i === 0) {
                element = element.split('"');
                Languages.push(element[1]);
            } else {
                Languages.push(element);
            }
        }
        return Languages;
    };
    //מכניס מדריך מאתר משרד התיירות
    PostGuideToSQLFromGovIL = (Guide, Languages) => {
        this.setState({ isLoading: true });
        //pay attention case sensitive!!!! should be exactly as the prop in C#!
        fetch(this.apiUrl + "Guide/PostGuideFromGovIL", {
            method: "POST",
            body: JSON.stringify(Guide),
            headers: new Headers({
                "Content-type": "application/json; charset=UTF-8" //very important to add the 'charset=UTF-8'!!!!
            })
        })
            .then((res) => {
                console.log("res=", res);
                return res.json();
            })
            .then(
                (result) => {
                    if (result !== null) {
                        this.setState({
                            tempGuide: result
                        });
                        this.AddLanguages(this.state.tempGuide, Languages);
                    } else {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: " Error",
                            showConfirmButton: false,
                            timer: 1200
                        });
                    }
                },
                (error) => {
                    console.log("err post=", error);
                }
            );
        console.log(this.state.tempGuide);
    };

    //מוסיף שפות מאתר התיירות למדריך
    AddLanguages = (guide, languages) => {
        console.log(languages);
        console.log(guide);
        let listGuideLang = [];
        for (let i = 0; i < languages.length; i++) {
            const element = languages[i];
            for (let j = 0; j < this.state.LanguagesList.length; j++) {
                const elementFromState = this.state.LanguagesList[j];
                if (elementFromState.LNameEnglish === element) {
                    let Guide_Language = {
                        Guide_Code: guide.gCode,
                        Language_Code: elementFromState.LCode
                    };
                    listGuideLang.push(Guide_Language);
                }
            }
        }
        console.log(listGuideLang);
        this.PostLanguagesGuide(listGuideLang);
    };

    //מכניסה את שפות המדריך מאתר משרד התיירות
    PostLanguagesGuide = (guideLanguages) => {
        fetch(this.apiUrl + "/Guide/PostGuideLanguage", {
            method: "POST",
            body: JSON.stringify(guideLanguages),
            headers: new Headers({
                "Content-type": "application/json; charset=UTF-8" //very important to add the 'charset=UTF-8'!!!!
            })
        })
            .then((res) => {
                console.log("res=", res);
                return res.json();
            })
            .then(
                (result) => {
                    console.log("fetch POST= ", result);
                    console.log(result);
                    this.MoveToHomePage(this.state.tempGuide);
                },
                (error) => {
                    console.log("err post=", error);
                }
            );
    };
    GetAllLanguages = () => {
        fetch(this.apiUrl + "Language", {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8"
            })
        })
            .then((res) => {
                return res.json();
            })
            .then(
                (result) => {
                    this.setState({
                        LanguagesList: result
                    });
                    this.OrgenizeLanguages(result);
                },
                (error) => {
                    console.log("err post=", error);
                }
            );
    };

    GetAllAttractionsFromSQL = () => {
        this.setState({
            isLoading: true
        });
        fetch(this.apiUrl + "BuildTrip/GetAllAttractions", {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8"
            })
        })
            .then((res) => {
                return res.json();
            })
            .then(
                (result) => {
                    this.setState({
                        AttractionsArray: result
                    });
                    this.GetAllAttractions();
                },
                (error) => {
                    console.log("err post=", error);
                }
            );
    };

    //לוקח את הפרטים מעמוד ההרשמה ובודק האם האימייל נמצא במסד נתונים- אם לא נמצא יוסיף אותו למסד נתונים
    PostGuideToCheckSignUp = (userDetails) => {
        //this.setState({isLoading:true})
        //pay attention case sensitive!!!! should be exactly as the prop in C#!
        fetch(this.apiUrl + "Guide/PostToCheck", {
            method: "POST",
            body: JSON.stringify({
                Email: userDetails.Email,
                PasswordGuide: userDetails.Password,
                ProfilePic: userDetails.picture,
                FirstName: userDetails.FirstName,
                LastName: userDetails.LastName,
                SignDate: userDetails.SignDate,
                Gender: userDetails.Gender,
                BirthDay: userDetails.Birthday
            }),
            headers: new Headers({
                "Content-type": "application/json; charset=UTF-8" //very important to add the 'charset=UTF-8'!!!!
            })
        })
            .then((res) => {
                return res.json();
            })
            .then(
                (result) => {
                    this.setState({
                        tempGuide: result
                    });
                    this.AddtoFirebase(result);
                    //this.MoveToHomePage(this.state.tempGuide);
                },
                (error) => {
                    console.log("err post=", error);
                }
            );
    };

    //לוקח את פרטי המשתמש מהעמוד ההתחברות(אימייל וסיסמא) ובודק האם נמצא במסד נתונים
    PostGuideToCheckSignIn = (signInUser) => {
        //this.setState({isLoading:true})
        //pay attention case sensitive!!!! should be exactly as the prop in C#!
        fetch(this.apiUrl + "Guide/PostToCheck", {
            method: "POST",
            body: JSON.stringify({
                Email: signInUser.Email,
                PasswordGuide: signInUser.Password
            }),
            headers: new Headers({
                "Content-type": "application/json; charset=UTF-8" //very important to add the 'charset=UTF-8'!!!!
            })
        })
            .then((res) => {
                return res.json();
            })
            .then(
                (result) => {
                    this.setState({
                        tempGuide: result
                    });
                    this.AddtoFirebase(result);
                    //this.MoveToHomePage(this.state.tempGuide);
                },
                (error) => {
                    console.log("err post=", error);
                }
            );
    };

    //הוספה לfirebase
    AddtoFirebase = (e) => {
        if (e !== null) {
            const name = e.FirstName + " " + e.LastName;
            const email = e.Email;
            const password = e.PasswordGuide;
            const URL = e.ProfilePic;
            try {
                myFirebase
                    .auth()
                    .createUserWithEmailAndPassword(e.Email, e.PasswordGuide)
                    .then(async (result) => {
                        console.log(result);
                        myFirebase
                            .firestore()
                            .collection("users")
                            .add({
                                name,
                                id: result.user.uid,
                                email,
                                password,
                                URL,
                                type: "Guide",
                                messages: [{ notificationId: "", number: 0 }]
                            })
                            .then((docRef) => {
                                localStorage.setItem("idChat", docRef.id);
                            })
                            .catch((error) => {
                                console.error("Error adding document", error);
                            });
                    });
            } catch (error) {
                // document.getElementById("1").innerHTML =
                //     "Error in singing up please try again";
            }
            this.MoveToHomePage(e);
        } else {
            this.setState({ isLoading: false });
            Swal.fire({
                position: "center",
                icon: "error",
                title: " incorrect login information",
                showConfirmButton: false,
                timer: 1200
            });
        }
    };
    //  במידה וההתחברות הצליחה, המשתמש יועבר לעמוד הבית.
    MoveToHomePage = (e) => {
        this.setState({ isLoading: false });
        if (e !== null) {
            localStorage.setItem("Guide", JSON.stringify(e));
            this.props.history.push({
                pathname: "/home/",
                state: { GuideTemp: e }
            });
        } else {
            this.setState({ isLoading: false });
            Swal.fire({
                position: "center",
                icon: "error",
                title: " incorrect login information",
                showConfirmButton: false,
                timer: 1200
            });
        }
    };

    //מביא את כל התחביבים שקיימים במסד הנתונים
    GetAllHobbies = () => {
        fetch(this.apiUrl + "Hobby", {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8"
            })
        })
            .then((res) => {
                return res.json();
            })
            .then(
                (result) => {
                    this.OrgenizeHobbies(result);
                },
                (error) => {
                    console.log("err post=", error);
                }
            );
    };

    //מסדר את התחביבים בגייסון הכולל מספר זיהוי,שם ותמונה
    OrgenizeHobbies = (result) => {
        let temp = [];
        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            let hobby = {
                id: element.HCode,
                name: element.HName,
                image: element.Picture
            };
            temp.push(hobby);
        }
        this.setState({
            AllHobbies: temp
        });
    };

    //מביא את כל ההתמחויות הקיימות במסד נתונים
    GetAllExpertises = () => {
        fetch(this.apiUrl + "Expertise", {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8"
            })
        })
            .then((res) => {
                return res.json();
            })
            .then(
                (result) => {
                    this.OrgenizeExpertises(result);
                },
                (error) => {
                    console.log("err post=", error);
                }
            );
    };

    //מסדר את כל ההתמחויות בקובץ גייסון הכולל מספר זיהוי, שם ותמונה
    OrgenizeExpertises = (result) => {
        let temp = [];
        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            let expertise = {
                id: element.Code,
                name: element.NameE,
                image: element.Picture
            };
            temp.push(expertise);
        }
        this.setState({
            AllExpertises: temp
        });
    };

    //מסדר את השפות לפי ID ו label
    OrgenizeLanguages = (result) => {
        let tempArrayList = [];
        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            let Language = {
                id: i + 1,
                label: element.LNameEnglish + " / " + element.LName
            };
            tempArrayList.push(Language);
        }
        this.setState({
            LanguagesListOrgenized: tempArrayList
        });
    };
    //מביא את כל האזורים הקיימים במסד נתונים
    GetAllAreas = () => {
        fetch(this.apiUrl + "Area", {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8"
            })
        })
            .then((res) => {
                return res.json();
            })
            .then(
                (result) => {
                    this.setState({
                        AllAreas: result
                    });
                },
                (error) => {
                    console.log("err post=", error);
                }
            );
    };
    SaveListAtt = (array) => {
        this.setState({
            ListAttractions: array
        });
    };
    render() {
        return this.state.loading === true ? (
            <div className="spinner-border text-success" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        ) : (
            <div className="app">
                <ToastContainer
                    autoClose={2000}
                    hideProgressBar={true}
                    position={toast.POSITION.BOTTOM_CENTER}
                />
                <Switch>
                    <Route path="/upload">
                        <FileUpload local={this.state.local} />
                    </Route>
                    <Route exact path="/reset">
                        <ResetPassword local={this.state.local} />
                    </Route>
                    <Route exact path="/">
                        <SignIn
                            GovList={this.CheckIfGuidGovILExistInSQL}
                            checkSignIn={this.PostGuideToCheckSignIn}
                            checkIfexistUsers={this.PostGuideToCheckSignUp}
                            local={this.state.local}
                        />
                    </Route>
                    <Route path="/signUp">
                        <SignUp
                            checkIfExistAndSignUP={this.PostGuideToCheckSignUp}
                            CheckIfGuideExist={this.CheckIfGuideExist}
                        />
                    </Route>
                    <Route path="/home">
                        <ResponsiveNavigation
                            navbarCheckFunc={this.navbarCheck}
                            navLinks={navLinks}
                            logo={menu}
                            background="#fff"
                            hoverBackground="#A2D4FF"
                            linkColor="#1988ff"
                        />
                        <Home
                            AllLanguages={this.state.LanguagesListOrgenized}
                            local={this.state.local}
                            ReloadHobbies={this.GetAllHobbies}
                            Allusers={this.state.guides}
                            AllExpertises={this.state.AllExpertises}
                            AllHobbies={this.state.AllHobbies}
                            AllAreas={this.state.AllAreas}
                            navbarOpenCheck={this.state.navbarCheckOpen}
                            GetGuidesFromSQL={this.GetGuidesFromSQL}
                        />
                        <MainFooter className="hidden-xs" />
                    </Route>
                    <Route path="/chat">
                        <ResponsiveNavigation
                            navbarCheckFunc={this.navbarCheck}
                            navLinks={navLinks}
                            logo={menu}
                            background="#fff"
                            hoverBackground="#A2D4FF"
                            linkColor="#1988ff"
                        />
                        <Chat
                            showToast={this.showToast}
                            navbarOpenCheck={this.state.navbarCheckOpen}
                            Guide={this.state.tempGuide}
                            tourist={this.state.tourist}
                            local={this.state.local}
                            LanguagesListOrgenized={
                                this.state.LanguagesListOrgenized
                            }
                            AllExpertises={this.state.AllExpertises}
                            AllHobbies={this.state.AllHobbies}
                        />
                        <MainFooter className="hidden-xs" />
                    </Route>
                    <Route path="/BuildTrip2">
                        <ResponsiveNavigation
                            navbarCheckFunc={this.navbarCheck}
                            navLinks={navLinks}
                            logo={menu}
                            background="#fff"
                            hoverBackground="#A2D4FF"
                            linkColor="#1988ff"
                        />
                        <BuildTrip2
                            SaveListAtt={this.SaveListAtt}
                            Attractions={this.state.Attractions}
                            showToast={this.showToast}
                            cities={this.state.Cities}
                            navbarOpenCheck={this.state.navbarCheckOpen}
                            Guide={this.state.tempGuide}
                            local={this.state.local}
                            ListAttractions={this.state.ListAttractions}
                            tourist={this.state.tourist}
                            listAPI={this.state.listAtt}
                            GetCities={this.GetAllCitiesFromGOVIL}
                        />
                        <MainFooter className="hidden-xs" />
                    </Route>
                    <Route path="/BuildTrip">
                        <ResponsiveNavigation
                            navbarCheckFunc={this.navbarCheck}
                            navLinks={navLinks}
                            logo={menu}
                            background="#fff"
                            hoverBackground="#A2D4FF"
                            linkColor="#1988ff"
                        />
                        <BuildTrip
                            Attractions={this.state.Attractions}
                            showToast={this.showToast}
                            cities={this.state.AllAreas}
                            navbarOpenCheck={this.state.navbarCheckOpen}
                            Guide={this.state.tempGuide}
                            local={this.state.local}
                        />
                        <MainFooter className="hidden-xs" />
                    </Route>
                    <Route path="/contact">
                        <ResponsiveNavigation
                            navbarCheckFunc={this.navbarCheck}
                            navLinks={navLinks}
                            logo={menu}
                            background="#fff"
                            hoverBackground="#A2D4FF"
                            linkColor="#1988ff"
                        />
                        <Contact
                            navbarOpenCheck={this.state.navbarCheckOpen}
                            //user={this.state.tempGuide}
                            tourist={this.state.tourist}
                        />
                        <MainFooter className="hidden-xs" />
                    </Route>
                </Switch>
                {/* Loading */}
                {this.state.isLoading ? (
                    <div className="viewLoading">
                        <ReactLoading
                            type={"spin"}
                            color={"#203152"}
                            height={"3%"}
                            width={"3%"}
                        />
                    </div>
                ) : null}
            </div>
        );
    }
}

export default withRouter(App);
