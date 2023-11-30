import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import './MenuComponent.css';
import './Page.css';
import logo from '../images/logo.png';


class Menu extends Component {
  static contextType = MyContext;

  render() {
    return (
      <div className="navbar" style={{ backgroundColor: '#b0c4b1' }}>
        <div className="navbar-logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="navbar-links">
          <Link to='/admin/home'>Home</Link>
          <Link to='/admin/category'>Category</Link>
          <Link to='/admin/product'>Product</Link>
          <Link to='/admin/order'>Order</Link>
          <Link to='/admin/customer'>Customer</Link>
        </div>
        <div className="navbar-user">
          Hello <b>{this.context.username}</b> | <Link to='/admin/home' onClick={() => this.lnkLogoutClick()}>Logout</Link>
        </div>
      </div>
    );
  }

  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setUsername('');
  }
}

export default Menu;
