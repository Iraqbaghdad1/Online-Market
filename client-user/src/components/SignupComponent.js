import axios from 'axios';
import React, { Component } from 'react';
import './Login.css';


class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: 'xyz',
      txtPassword: '1234567890',
      txtName: 'Name here',
      txtPhone: '1234567890',
      txtEmail: 'xyz@gmail.com'
    };
  }
render() {
  return (
    <div className="align-center">
      <h2 className="text-center">SIGN-UP</h2>
      <form className='check-in'>
        <div className="form-group">
          <label className="text-center" htmlFor="username">Username</label>
          <div className="center-button">
            <input type="text" id="username" value={this.state.txtUsername} onChange={(e) => { this.setState({ txtUsername: e.target.value }) }} />
          </div>
        </div>
        <div className="form-group">
          <label className="text-center" htmlFor="password">Password</label>
          <div className="center-button">
            <input type="password" id="password" value={this.state.txtPassword} onChange={(e) => { this.setState({ txtPassword: e.target.value }) }} />
          </div>
        </div>
        <div className="form-group">
          <label className="text-center" htmlFor="name">Name</label>
          <div className="center-button">
            <input type="text" id="name" value={this.state.txtName} onChange={(e) => { this.setState({ txtName: e.target.value }) }} />
          </div>
        </div>
        <div className="form-group">
          <label className="text-center" htmlFor="phone">Phone</label>
          <div className="center-button">
            <input type="tel" id="phone" value={this.state.txtPhone} onChange={(e) => { this.setState({ txtPhone: e.target.value }) }} />
          </div>
        </div>
        <div className="form-group">
          <label className="text-center" htmlFor="email">Email</label>
          <div className="center-button">
            <input type="email" id="email" value={this.state.txtEmail} onChange={(e) => { this.setState({ txtEmail: e.target.value }) }} />
          </div>
        </div>
        <div className="form-group center-button">
          <input id="login-button" type="submit" value="SIGN-UP" onClick={(e) => this.btnSignupClick(e)} />
        </div>
      </form>
    </div>
  );
  }
  // event-handlers
  btnSignupClick(e) {
    e.preventDefault();
    const username = this.state.txtUsername;
    const password = this.state.txtPassword;
    const name = this.state.txtName;
    const phone = this.state.txtPhone;
    const email = this.state.txtEmail;
    if (username && password && name && phone && email) {
      const account = { username: username, password: password, name: name, phone: phone, email: email };
      this.apiSignup(account);
    } else {
      alert('Please input username and password and name and phone and email');
    }
  }
  // apis
  apiSignup(account) {
    axios.post('/api/customer/signup', account).then((res) => {
      const result = res.data;
      alert(result.message);
    });
  }
}
export default Signup;