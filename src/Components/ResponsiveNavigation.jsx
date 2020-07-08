import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';

function ResponsiveNavigation({ background, hoverBackground, linkColor, navLinks, logo, navbarCheckFunc, QuestionFunc, numOfNotification, logOutFunction }) {
  const [navOpen, setNavOpen] = useState(true)
  const [hoverIndex, setHoverIndex] = useState(-1)
  const [clickIndex, setClickIndex] = useState(-1)
  const [showNot, setShowNot] = useState(false)
  const [clickQuestion, setClickQuestion] = useState(true)
  const [tutorial, setTutorial] = useState("closeTutorial")
  const [badge, setBadge] = useState("badge")
  const [num, setNum] = useState(numOfNotification.length)
  const [arr, setArr] = useState([])


 const checkClass=()=>{
  if (numOfNotification.length==0) {
    return "noBadge";
  }
  else{
   return "badge";
  }
 }

 const ShowNotifications=()=>{
   let arr2 = [];
   if (numOfNotification.length>0) {
    numOfNotification.map(item=>{arr2.push("You have new message from " + item.name)});
 }
 setArr(arr2);
}

  useEffect(() => {
    const x = window.matchMedia("(max-width: 1000px)")
    function myFunction(e) {
      if (e.matches) {
        setNavOpen(!navOpen);
        navbarCheckFunc(navOpen);
      }
      else {
        setNavOpen(navOpen);
        navbarCheckFunc(!navOpen);
      }

    };
    x.addListener(myFunction)
    return () => x.removeListener(myFunction);
  }, []);

  

  return (

    <nav
      className="responsive-toolbar"
      style={{ background: background }}>

      <div className="hidden-md hidden-sm">
       <figure id="image-logo-Question hidden-xs" className="logOutDiv" onClick={() => {logOutFunction()}}>
        <span className="logoutIcon"><i className="fas fa-sign-out-alt"></i></span>
      </figure>

      <figure id="image-logo-Question hidden-xs" className="notification" onClick={()=>{setShowNot(!showNot)}}>
        <span className="notificationIcon"><i className="fas fa-bell"></i></span>
        <span className={checkClass()}>{numOfNotification.length}</span>
        {showNot ? <div id="listNotifDiv" className="ListNotifications"><h5 className="divTitleNotif">Notifications</h5><div id="listUL"><ul id="ulID1">{numOfNotification.length>0? numOfNotification.map(item=><li>{"You have new message from " + item.name}</li>):null}</ul></div></div> :null}
      </figure>

      <figure id="image-logo-Question hidden-xs" onClick={() => { setClickQuestion(!clickQuestion); QuestionFunc(clickQuestion); }}>
        <span className="QuestionCircle" ><i onMouseLeave={() => { setTutorial("closeTutorial") }} onMouseEnter={() => { setTutorial("openTutorial") }} className="fas fa-question-circle"></i></span>
        <span className={tutorial}>Watch Tutorial</span>
      </figure>
      </div>

      <div className="hidden-lg hidden-xl hidden-sm ">
      <figure id="image-logo-Question hidden-xs" className="logOutDiv2" onClick={() => {logOutFunction()}}>
        <span className="logoutIcon2"><i className="fas fa-sign-out-alt"></i></span>
      </figure>

      <figure id="image-logo-Question hidden-xs " className="notification2" onClick={()=>{setShowNot(!showNot)}}>
        <span className="notificationIcon2"><i className="fas fa-bell"></i></span>
        <span className={checkClass()}>{numOfNotification.length}</span>
        {showNot ? <div id="listNotifDiv2" className="ListNotifications"><h5 className="divTitleNotif2">Notifications</h5><div id="listUL2"><ul id="ulID1">{numOfNotification.length>0? numOfNotification.map(item=><li>{"You have new message from " + item.name}</li>):null}</ul></div></div> :null}
      </figure>

      <figure id="image-logo-Question hidden-xs" onClick={() => { setClickQuestion(!clickQuestion); QuestionFunc(clickQuestion); }}>
        <span className="QuestionCircle2" ><i onMouseLeave={() => { setTutorial("closeTutorial") }} onMouseEnter={() => { setTutorial("openTutorial2") }} className="fas fa-question-circle"></i></span>
        <span className={tutorial}>Watch Tutorial</span>
      </figure>
      </div>

      <ul
        style={{ background: "#fff" }}
        className={navOpen ? 'active' : ''}
        id={navOpen ? 'activeNav' : 'noActiveNav'}
      >
        <figure className="image-logo hidden-xs" onClick={() => { setNavOpen(!navOpen); navbarCheckFunc(navOpen); }}>
          <img src={logo} height="50px" width="40px" alt="toolbar-logo" />
        </figure>

        {navLinks.map((link, index) =>
          <li
            key={index}
            onMouseEnter={() => { setHoverIndex(index) }}
            onMouseLeave={() => { setHoverIndex(-1) }}
            onClick={() => { setClickIndex(index) }}
            style={{ background: hoverIndex === index ? (hoverBackground || '#D7D7D7') : '' }}

          >
            <Link
              to={link.path}
              style={{ color: linkColor }}
            >   {link.text}
              <i className={link.icon} />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default ResponsiveNavigation