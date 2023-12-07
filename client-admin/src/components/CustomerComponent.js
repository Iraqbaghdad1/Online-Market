import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import './Customer.css';

class Customer extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      orders: [],
      order: null
    };
  }
  render() {
    const customerCards = this.state.customers.map((item) => (
      <div key={item._id} className="customer-card" onClick={() => this.trCustomerClick(item)}>
        <h3>{item.name}</h3>
        <p>Username: {item.username}</p>
        <p>Email: {item.email}</p>
        <p>Phone: {item.phone}</p>
        <p>Active: {item.active}</p>
        <div className="action-buttons">
          {item.active === 0 ? (
            <button className="link action-button" onClick={() => this.lnkActiveClick(item)}>
              ACTIVATE
            </button>
          ) : (
            <button className="link action-button" onClick={() => this.lnkDeActiveClick(item)}>
              DEACTIVATE
            </button>
          )}
        </div>
      </div>
    ));
    const orders = this.state.orders.map((item) => {
      return (
        <tr key={item._id} className="datatable" onClick={() => this.trOrderClick(item)}>
          <td>{item._id}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{item.customer.name}</td>
          <td>{item.customer.phone}</td>
          <td>{item.total}</td>
          <td>{item.status}</td>
        </tr>
      );
    });
    if (this.state.order) {
      var items = this.state.order.items.map((item, index) => {
        return (
          <tr key={item.product._id} className="datatable">
            <td>{index + 1}</td>
            <td>{item.product._id}</td>
            <td>{item.product.name}</td>
            <td><img src={"data:image/jpg;base64," + item.product.image} width="70px" height="70px" alt="" /></td>
            <td>{item.product.price}</td>
            <td>{item.quantity}</td>
            <td>{item.product.price * item.quantity}</td>
          </tr>
        );
      });
    }
    return (
      <div>
        <div className="customer-cards-container">{customerCards}</div>
        {this.state.orders.length > 0 ?
          <div className="align-center">
            <h2 className="text-center">ORDER LIST</h2>
            <table className="datatable" border="1">
              <tbody>
                <tr className="datatable">
                  <th>ID</th>
                  <th>Creation date</th>
                  <th>Cust.name</th>
                  <th>Cust.phone</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
                {orders}
              </tbody>
            </table>
          </div>
          : <div />}
        {this.state.order ?
          <div className="align-center">
            <h2 className="text-center">ORDER DETAIL</h2>
            <table className="datatable" border="1">
              <tbody>
                <tr className="datatable">
                  <th>No.</th>
                  <th>Prod.ID</th>
                  <th>Prod.name</th>
                  <th>Image</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                </tr>
                {items}
              </tbody>
            </table>
          </div>
          : <div />}
      </div>
    );
  }
  componentDidMount() {
    this.apiGetCustomers();
  }
  // event-handlers
  trCustomerClick(item) {
    this.setState({ orders: [], order: null });
    this.apiGetOrdersByCustID(item._id);
  }
  trOrderClick(item) {
    this.setState({ order: item });
  }

  lnkDeActiveClick(item) {
    const newActiveStatus = 0;
    this.apiPutCustomerStatus(item._id, item.token, newActiveStatus);
  }

  lnkActiveClick(item) {
    const newActiveStatus = 1;
    this.apiPutCustomerStatus(item._id, item.token, newActiveStatus);
  }


  // apis
  apiGetCustomers() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers', config).then((res) => {
      const result = res.data;
      this.setState({ customers: result });
    });
  }
  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders/customer/' + cid, config).then((res) => {
      const result = res.data;
      this.setState({ orders: result });
    });
  }

  apiPutCustomerStatus(id, token, newActiveStatus) {
    const body = { active: newActiveStatus, token:token };  // Removed token from the body
    const config = { headers: { 'x-access-token': this.context.token } };

    axios.put('/api/admin/customers/status/'+id, body, config)
      .then((res) => {
        const result = res.data;
        if (result) {
          alert('Status updated successfully!');
          this.apiGetCustomers();
        } else {
          alert('Error! An error occurred. Please try again later.');
          console.log(result);
        }
      })
      .catch((error) => {
        console.error('API error:', error);
        console.log(error);
        alert('Error! An unexpected error occurred. Please try again later.');
      });
  }

  // apiPutCustomerStatus(id, token, newActiveStatus) {
  //   const body = { token: token, active: newActiveStatus };
  //   const config = { headers: { 'x-access-token': this.context.token } };

  //   axios.put('/api/admin/customers/status/' + id, body, config)
  //     .then((res) => {
  //       const result = res.data;
  //       if (result) {
  //         alert('Status updated successfully!');
  //         this.apiGetCustomers();
  //       } else {
  //         alert('Error! An error occurred. Please try again later.');
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('API error:', error);
  //       alert('Error! An unexpected error occurred. Please try again later.');
  //     });
  // }

}
export default Customer;