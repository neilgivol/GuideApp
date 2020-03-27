import React, { Component } from "react";
import { Switch, Route, Link, withRouter, Redirect } from "react-router-dom";
import Agodit from "../image/Agodit.png";
import { ControlLabel } from "react-bootstrap";
import Swal from "sweetalert2";

class CCLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameEntered: "",
      PasswordEntered: "",
      redirected: false,
      rememberMe: false
    };
  } 
  UsernameChanged = e => {
    this.setState({ usernameEntered: e.target.value });
  };

  PasswordChanged = e => {
    this.setState({ PasswordEntered: e.target.value });
  };

  submitted = (evt) => {
  const { usernameEntered, PasswordEntered, rememberMe } = this.state;
  localStorage.setItem('rememberMe', rememberMe);
  localStorage.setItem('usernameEntered', rememberMe ? usernameEntered : '');
  localStorage.setItem('PasswordEntered', rememberMe ? PasswordEntered : '');
    for (let index = 0; index < this.props.PersonVar.length; index++) {
      const element = this.props.PersonVar[index];
      if (element.Email==this.state.usernameEntered && element.CellPhone==this.state.PasswordEntered) {
        this.setState({redirected:true})
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'התחברות התבצעה בהצלחה',
          showConfirmButton: false,
          timer: 1700
        })        
        return;
      }    
    } 
    evt.preventDefault();
    Swal.fire({
      icon: 'error',
      title: 'שגיאה',
      text: 'השם משתמש או הסיסמא אינם נכונים, אנא נסה שוב',
    })
  };

toggleRememberMe=()=>{
if (!this.state.rememberMe) {
  this.setState({ rememberMe: true });
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'מעתה פרטי המשתמש ישמרו לכניסות הבאות',
    showConfirmButton: false,
    timer: 1200
  })
}
else{
  this.setState({ rememberMe: false });
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'מעתה פרטי המשתמש אינם ישמרו לכניסות הבאות',
    showConfirmButton: false,
    timer: 1200
  })
} 
}
componentDidMount(){
  const rememberMe = localStorage.getItem('rememberMe') === 'true';
  const usernameEntered = rememberMe ? localStorage.getItem('usernameEntered') : '';
  const PasswordEntered = rememberMe ? localStorage.getItem('PasswordEntered') : '';
  this.setState({ usernameEntered, PasswordEntered, rememberMe });
}

  render() {
    if(this.state.redirected){
      return <Redirect to='/home' />
   }
    return (
      <div>
        <div className="LogoDiv">
          <img className="Agodit" src={Agodit}></img>
          <h1 className="AgoditText">אגודית</h1>
        </div>
        <br />
        <br />
        <br />
        <form id="LoginForm" onSubmit={this.submitted}>
          <h1>
            <b>התחברות</b>
          </h1>
          <br />
          <br />
          <br />
          <br />
          <div className="form-group">
            <h4>:שם משתמש</h4>
            <input
              type="email"
              className="form-control"
              placeholder="הכנס שם משתמש"
              onChange={this.UsernameChanged}
              value={this.state.usernameEntered}
            />
          </div>
          <br />
          <br />
          <div className="form-group">
            <h4>:סיסמא</h4>
            <input
              type="password"
              className="form-control"
              placeholder="הכנס סיסמא"
              onChange={this.PasswordChanged}
              value={this.state.PasswordEntered}
            />
          </div>
          <br />
          <br />
          <div className="form-group">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
                onChange={this.toggleRememberMe}
                checked={this.state.rememberMe}
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                זכור אותי
              </label>
            </div>
          </div>
          <br />
          <br />
          <button
            type="submit"
            className="btn btn-primary btn-block"        
          >
            <h4> התחבר</h4>
          </button>
        </form>
      </div>
    );
  }
}

export default CCLogin;
