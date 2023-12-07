import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import './MenuComponent.css';
import './Menu.css';
import logo from './images/logo0.png';


class Menu extends Component {
  static contextType = MyContext;

  render() {
    return (
      <div className="navbar">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="navbar-links">
          <Link to='/admin/order'>Order</Link>
          <Link to='/admin/category'>Category</Link>
          <Link to='/admin/product'>Product</Link>
          <Link to='/admin/customer'>Customer</Link>
        </div>
        <div className="navbar-user">
          <span>Hello {this.context.username}</span>
          <button onClick={() => this.lnkLogoutClick()}>Logout</button>
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
