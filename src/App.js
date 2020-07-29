import React, { Component } from "react";
import SignIn from "./Login/SignIn";
import { Switch, Route, withRouter } from "react-router-dom";
import SignUp from "./Login/SignUp";
import Chat from "./pages/Chat.jsx";
import Home from "./pages/Home.jsx";
import ResponsiveNavigation from "./Components/ResponsiveNavigation.jsx";
import ResetPassword from "./Login/ResetPassword";
import menu from "./Img/menu.png";
import MainFooter from "./Profile/Components/MainFooter";
import FileUpload from "./Profile/Components/fileUpload.jsx";
import $ from "jquery";
import { toast, ToastContainer } from "react-toastify";
import { myFirestore, myFirebase } from "./services/firebase";
import ReactLoading from "react-loading";
import BuildTrip from "./pages/BuildTrip";
import Swal from "sweetalert2";
import Contact from "./pages/Contact";
import LanguagesDataTable from "./DataTables/Languages";
import ExpertisesDataTable from "./DataTables/Expertises";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import HobbiesDataTable from "./DataTables/Hobbies";
import Admin from "./DataTables/Admin";

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
        path: "/BuildTrip",
        icon: "ion-ios-map"
    },
    {
        text: "Contact",
        path: "/contact",
        icon: "ion-ios-mail"
    }
];
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            local:false, //אם השרת לוקאלי או לא
            docId: "",  //קוד משתמש לפיירבס
            idChat: "", //קוד משתמש לפיירבייס צ'אט
            notificationsMessages: [],   //מערך התראות
            navbarCheckOpen: "open",    //מצב התפריט השמאלי
            tempGuide: "",             //מדריך
            AllHobbies: [],           // כל התחביבים מסודרים
            sqlHobbies: [],          //תחביבים מהשרת
            AllExpertises: [],      //כל ההתמחויות מסודרות
            sqlExpertises: [],     //התמחויות מהשרת 
            GuidesFromGovIL: [],  //מדריך ממשרד התיירות
            LanguagesList: [],   //רשימת השפות מהשרת
            LanguagesListOrgenized: [], //שפות מסודרות
            isLoading: false,
            Attractions: [],  //כל ההאטרקציות
            tourist: "",     //תייר
            Cities: [],     //כל הערים
            openTutorial: false, //הקדמה
            numOfNotifications: 0 //התראות
        };
        let local = this.state.local;
        this.apiUrl = "http://localhost:49948/api/";
        if (!local) {
            this.apiUrl = "https://proj.ruppin.ac.il/bgroup10/PROD/api/";
        }
    }
    
    componentDidMount() {
        this.CheckHobbiesLocalStorage();          //מביא את כל התחביבים שקיימים במסד הנתונים
        this.CheckExpertisesLocalStorage();      //מביא את כל ההתמחויות הקיימות במסד נתונים
        this.CheckLanguagesLocalStorage();      //מביא את כל השפות שבשרת
        this.GetGuidesGOVFromSQL(); //מביא את כל המדריכים שבאתר משרד התיירות
       //this.GetRequests();
        this.CheckAttractionsLocalStorage();    //בודק אם קיימות אטרקציות בלואקל סטורג'
        this.CheckCitiesLocalStorage();        //בודק אם קיימים ערים בלוקאל סטורג'
        this.CheckIfGuideInLocalStorage();    //בודק אם המדריך קיים בלוקאל סטורג'
        this.CheckMessagesNotifications();   //בודק אם יש התראות חדשות למדריך
    }


      //****************************בודק אם קיימים תחביבים בלואקל סטורג'*********************************************
      CheckHobbiesLocalStorage = () => {
        if (localStorage.getItem("AllHobbies") === null) {
            this.GetAllHobbies();
        } else {
            let temparr = JSON.parse(localStorage.getItem("AllHobbies"));
            this.setState({
                AllHobbies: temparr
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
                    this.setState({ sqlHobbies: result });
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
            localStorage.setItem('AllHobbies',JSON.stringify(temp))
    };
    //******************************************************************************************************************/

 //****************************בודק אם קיימים התמחויות בלואקל סטורג'*********************************************
 CheckExpertisesLocalStorage = () => {
    if (localStorage.getItem("AllExpertises") === null) {
        this.GetAllExpertises();
    } else {
        let temparr = JSON.parse(localStorage.getItem("AllExpertises"));
        this.setState({
            AllExpertises: temparr
        });
    }
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
                    this.setState({ sqlExpertises: result });
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
        })
            localStorage.setItem('AllExpertises',JSON.stringify(temp))
    }
    //******************************************************************************************************************/

//****************************בודק אם קיימים שפות בלואקל סטורג'*********************************************
CheckLanguagesLocalStorage = () => {
    if (localStorage.getItem("AllLanguages") === null) {
        this.GetAllLanguages();
    } else {
        let temparr = JSON.parse(localStorage.getItem("AllLanguages"));
        this.setState({
            LanguagesListOrgenized: temparr
        });
    }
};
    //מביא את כל השפות שבשרת
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
        })
            localStorage.setItem('AllLanguages',JSON.stringify(tempArrayList))
    };
     //******************************************************************************************************************/


      //*******************************מביא את כל המדריכים שבאתר משרד התיירות*****************************************
      GetGuidesGOVFromSQL = () => {
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
        this.setState({
            GuidesFromGovIL: data.result.records
        });
    };
    //******************************************************************************************************************/

   
    //****************************בודק אם קיימות אטרקציות בלואקל סטורג'*********************************************
    CheckAttractionsLocalStorage = () => {
        if (localStorage.getItem("AllAtt") === null) {
            this.GetAllAttractions();
        } else {
            let temparr = JSON.parse(localStorage.getItem("AllAtt"));
            this.setState({
                Attractions: temparr
            });
        }
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
    //מוסיף את רשימת האטרקציות מאתר משרד התיירות
    AddAtractions = (data) => {
        this.setState({ isLoading: true });

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
                Region: element.Region,
                Product_Url: element.Product_Url
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
            for (let i = 0; i < point.FullDescription.length; i++) {
                if (point.FullDescription.includes("'")) {
                    point.FullDescription = point.FullDescription.replace(
                        "'",
                        "`"
                    );
                }
            }
            for (let i = 0; i < point.FullDescription.length - 3; i++) {
                const element = point.FullDescription.slice(i, i + 3);
                if (element === "<p>" || element === "</p>") {
                    point.FullDescription = point.FullDescription.replace(
                        "<p>",
                        ""
                    );
                    point.FullDescription = point.FullDescription.replace(
                        "</p>",
                        ""
                    );
                }
            }
            NewArray.push(point);
        }
        localStorage.setItem("AllAtt", JSON.stringify(NewArray));
        this.setState({
            Attractions: NewArray,
            isLoading: false
        });
    };
    //******************************************************************************************************************/


    //**************************************בודק אם קיימים ערים בלוקאל סטורג'********************************************
    CheckCitiesLocalStorage = () => {
        if (localStorage.getItem("cities") === null) {
            this.GetAllCitiesFromGOVIL();
        } else {
            let citiesLocal = JSON.parse(localStorage.getItem("cities"));
            this.setState({
                Cities: citiesLocal
            });
        }
    };
     //מביא את כל הערים בארץ מ GOV-IL
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
    //מוסיף את הערים
    AddCities = (data) => {
        localStorage.setItem("cities", JSON.stringify(data.result.records));
        this.setState({
            Cities: data.result.records
        });
    };
    //**************************************************************************************************************************/

    //בודק אם המדריך שמור בלוקאל סטורג'
    CheckIfGuideInLocalStorage = () => {
        if (localStorage.getItem("Guide") === null) {
        } else {
            let Guide = JSON.parse(localStorage.getItem("Guide"));
            this.setState({ tempGuide: Guide });
            this.connectToFirebase(Guide);
        }
    };
    
    //*************************************בודק אם יש התראות חדשות למדריך********************************************
    CheckMessagesNotifications = () => {        
        let DocumentIdUser = this.state.docId;
            let messagesNotificationUser = [];
        if (localStorage.getItem('docId')) {
            DocumentIdUser = localStorage.getItem('docId');
            myFirestore.collection('users').doc(DocumentIdUser).get()
                .then((docRef) => {
                    messagesNotificationUser = docRef.data().messages;
                    this.orgenizeNotifications(messagesNotificationUser);
                })
        }      
    }
     //מסדר את הנוטיפיקיישנים במערך
     orgenizeNotifications = (notifications) => {
        let arr = [];
        let users = [];
        if (notifications.length > 0) {
            notifications.map(item => arr.push(item.notificationId));
            for (let i = 0; i < arr.length; i++) {
                const documentId = arr[i];
                myFirestore.collection('users')
                    .where('id', "==", documentId)
                    .get()
                    .then(function (querySnapshot) {
                        querySnapshot.forEach(function (doc) {
                            users.push(doc.data());
                        })
                    })
                    .then((data) => {
                        this.setState({
                            notificationsMessages: users
                        })
                        this.numOfNotifications(users);
                    })
            }
        }
        else {
            this.numOfNotifications(0);
        }
    }
    //**************************************************************************************************************************/

    //נוטיפיקיישן
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

    //show tutorial
    questionFunction = (quest) => {
        if (!quest) {
            this.setState({
                openTutorial: false
            });
        }
        else{
            this.setState({
                openTutorial: true
            });
        }
    };

    //מציג את מספר הנוטיפיקיישנים למדריך
    numOfNotifications = (num) => {
        this.setState(
            {
                numOfNotifications: num
            },
            () => {
            }
        );
    };

   //שולח לעמוד הצ'אט
    MoveToChatByClick = (email)=>{
        this.props.history.push({
                pathname: "/chat/",
                state: { userEmail: email }
            });
    }

    //מתנתק מהמדריך
    logOutFunction = () => {
        localStorage.removeItem("docId");
        localStorage.removeItem("idChat");
        localStorage.removeItem("languages");
        localStorage.removeItem("Expertise");
        localStorage.removeItem("Hobby");
        localStorage.removeItem("Guide");
        localStorage.removeItem("ListTourists");
        localStorage.removeItem("links");
        localStorage.removeItem("linksFromSQL");
        localStorage.removeItem("TripTourists");
        myFirebase.auth().signOut();
        this.props.history.push({
            pathname: "/"
        });
    };

    //*******************בדיקה אם המדריך ממשרד התיירות נרשם באפליקציה או לא**************************************
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
                return res.json();
            })
            .then(
                (result) => {
                    if (result !== null) {
                        this.setState({
                            tempGuide: result
                        });
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
                }
                
                const { value: password } = await Swal.fire({
                    title: "Input Password",
                    input: "password",
                    inputPlaceholder: "Enter new password",
                    inputAttributes: {
                        minlength: 6,
                        autocapitalize: "off",
                        autocorrect: "off"
                    },
                    confirmButtonText: "Continue"
                });
                let PasswordGuide = password;
                if (Email !== "" || Email !== null) {
                    if (PasswordGuide.length >= 6) {
                        let FirstName = this.AddFirstName(element);
                        let LastName = this.AddLastName(element);
                        let DescriptionGuide = this.AddDescription(element);
                        let Phone = this.AddPhoneNumber(element);
                        let Languages = this.AddLanguagesToGovIlGuide(element);
                        let SignDate = new Date();
                        let signDateCorrect = SignDate.toLocaleDateString(
                            "en-US"
                        );
                        let Guide = {
                            Email: Email,
                            FirstName: FirstName,
                            LastName: LastName,
                            Phone: Phone,
                            License: licenseNum,
                            SignDate: signDateCorrect,
                            DescriptionGuide: DescriptionGuide,
                            PasswordGuide: PasswordGuide
                        };
                        this.PostGuideToSQLFromGovIL(Guide, Languages);
                    } else {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title:
                                " You need add password with more than 6 letters or numbers",
                            showConfirmButton: false,
                            timer: 1200
                        });
                    }
                } else {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: " You must insert Email adress",
                        showConfirmButton: false,
                        timer: 1200
                    });
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
                            title: " You did'nt Succeed register",
                            showConfirmButton: false,
                            timer: 1200
                        });
                    }
                },
                (error) => {
                    console.log("err post=", error);
                }
            );
    };

    //מוסיף שפות מאתר התיירות למדריך
    AddLanguages = (guide, languages) => {
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
        this.PostLanguagesGuide(listGuideLang);
    };

    //מכניסה את שפות המדריך מאתר משרד התיירות
    PostLanguagesGuide = (guideLanguages) => {
        fetch(this.apiUrl + "Guide/PostGuideLanguage", {
            method: "POST",
            body: JSON.stringify(guideLanguages),
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
                        guide: this.state.tempGuide
                    });
                    this.AddtoFirebase(this.state.tempGuide);
                },
                (error) => {
                    console.log("err post=", error);
                }
            );
    };
        //********************************************סיום הכנסת מדריך מאתר משרד התיירות***************************************/


    //לוקח את הפרטים מעמוד ההרשמה ובודק האם האימייל נמצא במסד נתונים- אם לא נמצא יוסיף אותו למסד נתונים
    PostGuideToCheckSignUp = (userDetails) => {
        //this.setState({isLoading:true})
        //pay attention case sensitive!!!! should be exactly as the prop in C#!
        fetch(this.apiUrl + "Guide/PostToCheckIfSignUp", {
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
                    if (result == 2) {
                        this.PostGuideToCheckSignIn(userDetails, 2);
                    } else if (result == 1) {
                        this.PostGuideToCheckSignIn(userDetails, 1);
                    } else {
                    }
                },
                (error) => {
                    console.log("err post=", error);
                }
            );
    };

    //לוקח את פרטי המשתמש מהעמוד ההתחברות(אימייל וסיסמא) ובודק האם נמצא במסד נתונים
    PostGuideToCheckSignIn = (signInUser, num) => {
        if (signInUser.Email === "isradvisor@gmail.com" && signInUser.Password === "isradvisor" ) {
            this.props.history.push({
                pathname: "/Admin/",
            });
        }
        else{
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
                    if (result !== null) {
                        if (num == 2) {
                            this.connectToFirebase(result);
                        } else if (num == 1) {
                            this.AddtoFirebase(result);
                        }
                        this.setState({
                            tempGuide: result
                        });
                    } else {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: " incorrect login information",
                            showConfirmButton: false,
                            timer: 2500
                        });
                    }
                },
                (error) => {
                    console.log("err post=", error);
                }
            );
        }
    };
    
//התחברות לפיירבייס
    connectToFirebase = (e) => {
        let docId = "";
        let idChat = "";
        try {
            myFirebase
                .auth()
                .signInWithEmailAndPassword(e.Email, e.PasswordGuide)
                .then(async (result) => {
                    let user = result.user;
                    localStorage.setItem("idChat", user.uid);
                    if (user) {
                        await myFirestore
                            .collection("users")
                            .where("id", "==", user.uid)
                            .get()
                            .then(function (querySnapshot) {
                                querySnapshot.forEach(function (doc) {
                                    const currentdata = doc.data();
                                    docId = doc.id;
                                    idChat = currentdata.id;
                                    localStorage.setItem("docId", doc.id);
                                    localStorage.setItem(
                                        "idChat",
                                        currentdata.id
                                    );
                                });
                            });
                    }
                });
                this.setState({docId:docId})
            this.MoveToHomePage(e, docId, idChat);
        } catch (error) {}
    };

    //הוספה לfirebase
    AddtoFirebase = (e) => {
        let docId = "";
        let idChat = "";
        if (e !== null) {
            const name = e.FirstName + " " + e.LastName;
            const email = e.Email;
            const password = e.PasswordGuide;
            let URL = e.ProfilePic;
            if (URL == "" || URL == null) {
                URL =
                    "http://proj.ruppin.ac.il/bgroup10/PROD/Images/Default-welcomer.png";
            }
            try {
                myFirebase
                    .auth()
                    .createUserWithEmailAndPassword(e.Email, e.PasswordGuide)
                    .then(async (result) => {
                        localStorage.setItem("idChat", result.user.uid);
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
                                docId = docRef.id;
                                idChat = result.user.uid;
                                localStorage.setItem("docId", docRef.id);
                            })
                            .catch((error) => {
                                console.error("Error adding document", error);
                            });
                    });
            } catch (error) {
                // document.getElementById("1").innerHTML =
                //     "Error in singing up please try again";
            }
            this.setState({docId:docId})
            this.MoveToHomePage(e, docId, idChat);
        } else {
            this.setState({ isLoading: false });
            Swal.fire({
                position: "center",
                icon: "error",
                title: " incorrect login information",
                showConfirmButton: false,
                timer: 2500
            });
        }
    };
    //  במידה וההתחברות הצליחה, המשתמש יועבר לעמוד הבית.
    MoveToHomePage = (e, docId, idChat) => {
        this.setState({ isLoading: false });
        if (e !== null) {
            localStorage.setItem("Guide", JSON.stringify(e));
            this.props.history.push({
                pathname: "/home/",
                state: { GuideTemp: e, docId: docId, idChat: idChat }
            });
        } else {
            this.setState({ isLoading: false });
            Swal.fire({
                position: "center",
                icon: "error",
                title: " incorrect login information",
                showConfirmButton: false,
                timer: 2500
            });
        }
    };

 

    render() {
        return  (
            <div className="app">
                <ToastContainer
                    autoClose={2000}
                    hideProgressBar={false}
                    position={toast.POSITION.BOTTOM_CENTER}
                />
                <Switch>
                    <Route path="/upload">
                        <FileUpload local={this.state.local} />
                    </Route>
                    <Route path="/reset">
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
                            logOutFunction={this.logOutFunction}
                            numOfNotification={this.state.numOfNotifications}
                            QuestionFunc={this.questionFunction}
                            moveToChat = {this.MoveToChatByClick}
                            navbarCheckFunc={this.navbarCheck}
                            navLinks={navLinks}
                            logo={menu}
                            background="#fff"
                            hoverBackground="#A2D4FF"
                            linkColor="#1988ff"
                        />
                        <Home
                            showToast={this.showToast}
                            AllLanguages={this.state.LanguagesListOrgenized}
                            local={this.state.local}
                            AllExpertises={this.state.AllExpertises}
                            AllHobbies={this.state.AllHobbies}
                            navbarOpenCheck={this.state.navbarCheckOpen}
                            GetGuidesFromSQL={this.GetGuidesFromSQL}
                            openTutorial={this.state.openTutorial}
                            QuestionFunc={this.questionFunction}
                            numOfNotifications={this.numOfNotifications}
                            CheckMessagesNotifications={this.CheckMessagesNotifications}
                        />
                        <MainFooter className="hidden-xs" />
                    </Route>
                    <Route path="/chat">
                        <ResponsiveNavigation
                                                    moveToChat = {this.MoveToChatByClick}
                            logOutFunction={this.logOutFunction}
                            numOfNotification={this.state.numOfNotifications}
                            navbarCheckFunc={this.navbarCheck}
                            navLinks={navLinks}
                            logo={menu}
                            background="#fff"
                            hoverBackground="#A2D4FF"
                            linkColor="#1988ff"
                        />
                        <Chat
                        numOfNotificationsSet = {this.numOfNotifications}
                            orgenizeNotifications = {this.orgenizeNotifications}
                            CheckMessagesNotifications={this.CheckMessagesNotifications}
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
                        <MainFooter className="mainfooterDiv hidden-xs" />
                    </Route>
                    <Route path="/BuildTrip">
                        <ResponsiveNavigation
                                                    moveToChat = {this.MoveToChatByClick}
                            logOutFunction={this.logOutFunction}
                            numOfNotification={this.state.numOfNotifications}
                            navbarCheckFunc={this.navbarCheck}
                            navLinks={navLinks}
                            logo={menu}
                            background="#fff"
                            hoverBackground="#A2D4FF"
                            linkColor="#1988ff"
                            QuestionFunc={this.questionFunction}
                        />
                        <BuildTrip
                            //SaveListAtt={this.SaveListAtt}
                            Attractions={this.state.Attractions}
                            showToast={this.showToast}
                            cities={this.state.Cities}
                            navbarOpenCheck={this.state.navbarCheckOpen}
                            Guide={this.state.tempGuide}
                            local={this.state.local}
                            //ListAttractions={this.state.ListAttractions}
                            tourist={this.state.tourist}
                            //listAPI={this.state.listAtt}
                            GetCities={this.GetAllCitiesFromGOVIL}
                            openTutorial={this.state.openTutorial}
                            QuestionFunc={this.questionFunction}
                            CheckMessagesNotifications={this.CheckMessagesNotifications}
                        />
                        <MainFooter className="hidden-xs" />
                    </Route>
                    <Route path="/contact">
                        <ResponsiveNavigation
                                                    moveToChat = {this.MoveToChatByClick}
                            logOutFunction={this.logOutFunction}
                            numOfNotification={this.state.numOfNotifications}
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
                            local={this.state.local}
                            CheckMessagesNotifications={this.CheckMessagesNotifications}
                        />
                        <MainFooter className="hidden-xs" />
                    </Route>
                    <Route path="/Languages">
                        <LanguagesDataTable
                            languages={this.state.LanguagesList}
                            local={this.state.local}
                        />
                        <MainFooter className="hidden-xs" id="footerAdmin" />
                    </Route>
                    <Route path="/Hobbies">
                        <HobbiesDataTable
                            GetHobbies={this.GetAllHobbies}
                            hobbies={this.state.sqlHobbies}
                            local={this.state.local}
                        />
                        <MainFooter className="hidden-xs" />
                    </Route>
                    <Route path="/Expertises">
                        <ExpertisesDataTable
                            expertises={this.state.sqlExpertises}
                            local={this.state.local}
                        />
                        <MainFooter className="hidden-xs" />
                    </Route>
                    <Route exact path="/Admin">
                        <Admin />
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
