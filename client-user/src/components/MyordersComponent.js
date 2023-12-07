import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import './Order.css';

class Myorders extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null
    };
  }
  render() {
    if (this.context.token === '') return (<Navigate replace to='/login' />);

    const orders = this.state.orders.map((item) => (
      <div key={item._id} className="order-card-order" onClick={() => this.trItemClick(item)}>
        <p>ID: {item._id}</p>
        <p>Date: {new Date(item.cdate).toLocaleString()}</p>
        <p>Total: <b>{item.total}</b></p>
        <p>Status: <button id="status-button-order" disabled>{item.status}</button></p>
      </div>
    ));

    if (this.state.order) {
      var items = this.state.order.items.map((item, index) => (
        <div key={item.product._id} className="order-item-card-order">
          <p>No.: {index + 1}</p>
          <p>Prod. ID: {item.product._id}</p>
          <p>Prod. name: {item.product.name}</p>
          <img src={"data:image/jpg;base64," + item.product.image} width="70px" height="70px" alt="" />
          <p>Price: {item.product.price}</p>
          <p>Quantity: {item.quantity}</p>
          <p>Amount: {item.product.price * item.quantity}</p>
        </div>
      ));
    }

    return (
      <div className="order-container-order">
        <div className="order-list-order">
          <h2 className="text-center-order">ORDER LIST</h2>
          <div className="order-cards-container-order">{orders}</div>
        </div>
        {this.state.order && (
          <div className="order-details-order">
            <h2 className="text-center-order">ORDER DETAIL</h2>
            <div className="order-items-container-order">{items}</div>
          </div>
        )}
      </div>
    );
  }

  componentDidMount() {
    if (this.context.customer) {
      const cid = this.context.customer._id;
      this.apiGetOrdersByCustID(cid);
    }
  }
  // event-handlers
  trItemClick(item) {
    this.setState({ order: item });
  }
  // apis
  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/customer/orders/customer/' + cid, config).then((res) => {
      const result = res.data;
      this.setState({ orders: result });
    });
  }
}
export default Myorders;