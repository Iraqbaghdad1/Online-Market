import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import './Login.css';

class Login extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: 'ahmed',
      txtPassword: '12345'
    };
  }
  render() {
    if (this.context.token === '') {
      return (
        <div className="login-container">
          <h2 className="text-center">ADMIN LOGIN</h2>
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
            <div className="form-group center-button">
              <input id="login-button" type="submit" value="LOGIN" onClick={(e) => this.btnLoginClick(e)} />
            </div>
          </form>
        </div>
      );
    }
    return (<div />);
  }
  // event-handlers
  btnLoginClick(e) {
    e.preventDefault();
    const username = this.state.txtUsername;
    const password = this.state.txtPassword;
    if (username && password) {
      const account = { username: username, password: password };
      this.apiLogin(account);
    } else {
      alert('Please input username and password');
    }
  }
  // apis
  apiLogin(account) {
    axios.post('/api/admin/login', account).then((res) => {
      const result = res.data;
      if (result.success === true) {
        this.context.setToken(result.token);
        this.context.setUsername(account.username);
      } else {
        alert(result.message);
        this.setState({ txtUsername: '', txtPassword: '' });
      }
    });
  }
}
export default Login;