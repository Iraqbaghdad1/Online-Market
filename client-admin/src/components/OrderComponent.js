import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import './Order.css';

class Order extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null
    };
  }
  render() {
    const orderCards = this.state.orders.map((item) => (
      <div key={item._id} className="order-card" onClick={() => this.trItemClick(item)}>
        <h3>Order ID: {item._id}</h3>
        <p>Creation Date: {new Date(item.cdate).toLocaleString()}</p>
        <p>Customer Name: {item.customer.name}</p>
        <p>Customer Phone: {item.customer.phone}</p>
        <p>Total: {item.total}</p>
        <p>Status: <button id="status-button-order" disabled>{item.status}</button></p>
        {item.status === 'PENDING' && (
          <div className="action-buttons">
            <button id="approve-btn" className="link" onClick={() => this.lnkApproveClick(item._id)}>
              APPROVE
            </button>{' '}
            <button id="cancel-btn" className="link" onClick={() => this.lnkCancelClick(item._id)}>
              CANCEL
            </button>
          </div>
        )}
      </div>
    ));

    const items =
      this.state.order &&
      this.state.order.items.map((item, index) => (
        <div key={item.product._id} className="order-item">
          <p>No.: {index + 1}</p>
          <p>Product ID: {item.product._id}</p>
          <p>Product Name: {item.product.name}</p>
          <img src={`data:image/jpg;base64,${item.product.image}`} width="70px" height="70px" alt="" />
          <p>Price: {item.product.price}</p>
          <p>Quantity: {item.quantity}</p>
          <p>Amount: {item.product.price * item.quantity}</p>
        </div>
      ));

    return (
      <div className="order-page-container">
        <div className="order-cards-container">
          <h2 className="text-center">ORDERS</h2>
          {orderCards}
        </div>
        {this.state.order && (
          <div className="order-details-container">
            <h2 className="text-center">ORDER DETAIL</h2>
            <div className="order-items-container">{items}</div>
          </div>
        )}
      </div>
    );
  }
  componentDidMount() {
    this.apiGetOrders();
  }
  // event-handlers
  trItemClick(item) {
    this.setState({ order: item });
  }
  lnkApproveClick(id) {
    this.apiPutOrderStatus(id, 'APPROVED');
  }
  lnkCancelClick(id) {
    this.apiPutOrderStatus(id, 'CANCELED');
  }
  // apis
  apiGetOrders() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders', config).then((res) => {
      const result = res.data;
      this.setState({ orders: result });
    });
  }
  apiPutOrderStatus(id, status) {
    const body = { status: status };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/orders/status/' + id, body, config).then((res) => {
      const result = res.data;
      if (result) {
        this.apiGetOrders();
      } else {
        alert('Error! An error occurred. Please try again later.');
      }
    });
  }
}
export default Order;