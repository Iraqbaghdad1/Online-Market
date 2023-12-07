import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';
import withRouter from '../utils/withRouter';
import './MyCart.css'; 

class Mycart extends Component {
  static contextType = MyContext; // using this.context to access global state

  render() {
    const mycart = this.context.mycart.map((item, index) => (
      <div key={item.product._id} className="card">
        <img src={`data:image/jpg;base64,${item.product.image}`} alt={item.product.name} />
        <div className="card-details">
          <h3>{item.product.name}</h3>
          <p>Category: {item.product.category.name}</p>
          <p>Price: {item.product.price}</p>
          <p>Quantity: {item.quantity}</p>
          <p>Total: {item.product.price * item.quantity}</p>
          <span className="link" onClick={() => this.lnkRemoveClick(item.product._id)}>Remove</span>
        </div>
      </div>
    ));

    return (
      <div className="align-center">
        <h2 className="text-center">ITEM LIST</h2>
        <div className="card-container">{mycart}</div>
        <div className="total-container">
          <div className="total">Total: <b>{CartUtil.getTotal(this.context.mycart)}</b></div>
          <button className="checkout-button" onClick={() => this.lnkCheckoutClick()}>CHECKOUT</button>
        </div>
      </div>
    );
  }
  // event-handlers
  lnkRemoveClick(id) {
    const mycart = this.context.mycart;
    const index = mycart.findIndex(x => x.product._id === id);
    if (index !== -1) { // found, remove item
      mycart.splice(index, 1);
      this.context.setMycart(mycart);
    }
  }
  lnkCheckoutClick() {
    if (window.confirm('ARE YOU SURE?')) {
      if (this.context.mycart.length > 0) {
        const total = CartUtil.getTotal(this.context.mycart);
        const items = this.context.mycart;
        const customer = this.context.customer;
        if (customer) {
          this.apiCheckout(total, items, customer);
        } else {
          this.props.navigate('/login');
        }
      } else {
        alert('Your cart is empty');
      }
    }
  }
  // apis
  apiCheckout(total, items, customer) {
    const body = { total: total, items: items, customer: customer };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/customer/checkout', body, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Good job!');
        this.context.setMycart([]);
        this.props.navigate('/home');
      } else {
        alert('Error! An error occurred. Please try again later.');
      }
    });
  }
}
export default withRouter(Mycart);