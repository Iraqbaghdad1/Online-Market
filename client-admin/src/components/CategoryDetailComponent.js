import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import './CategoryDetail.css';


class CategoryDetail extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtName: ''
    };
    // Bind event handler methods in the constructor
    this.btnAddClick = this.btnAddClick.bind(this);
    this.btnUpdateClick = this.btnUpdateClick.bind(this);
    this.btnDeleteClick = this.btnDeleteClick.bind(this);
  }
  render() {
    return (
      <div className="category-detail-form">
        <h2 className="text-center">CATEGORY DETAIL</h2>
        <form className="cat-form" onSubmit={this.handleSubmit}>
          <div className="cat-form-group">
            <label htmlFor="txtID">ID</label>
            <input
              className="cat-form-input"
              type="text"
              id="txtID"
              value={this.state.txtID}
              onChange={(e) => this.handleChange(e, 'txtID')}
              readOnly
            />
          </div>
          <div className="cat-form-group">
            <label htmlFor="txtName">Name</label>
            <input
              className="prod-cat-form-input"
              type="text"
              id="txtName"
              value={this.state.txtName}
              onChange={(e) => this.handleChange(e, 'txtName')}
            />
          </div>
          <div className="cat-form-group">
            <input className="cat-btn" type="submit" value="ADD NEW" onClick={this.btnAddClick} />
            <input className="cat-btn" type="submit" value="UPDATE" onClick={this.btnUpdateClick} />
            <input className="cat-btn" id="delete" type="submit" value="DELETE" onClick={this.btnDeleteClick} />
          </div>
        </form>
      </div>
    );
  }
  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.setState({ txtID: this.props.item._id, txtName: this.props.item.name });
    }
  }
  handleChange(e, fieldName) {
    this.setState({ [fieldName]: e.target.value });
  }
  // event-handlers
  btnAddClick(e) {
    e.preventDefault();
    console.log(this.state.txtName);
    const name = this.state.txtName;
    if (name) {
      const cate = { name: name };
      this.apiPostCategory(cate);
    } else {
      alert('Please input name');
    }
  }
  btnUpdateClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const name = this.state.txtName;
    if (id && name) {
      const cate = { name: name };
      this.apiPutCategory(id, cate);
    } else {
      alert('Please input id and name');
    }
  }
  btnDeleteClick(e) {
    e.preventDefault();
    if (window.confirm('ARE YOU SURE?')) {
      const id = this.state.txtID;
      if (id) {
        this.apiDeleteCategory(id);
      } else {
        alert('Please input id');
      }
    }
  }
  // apis
  apiPostCategory(cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/categories', cate, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Good job!');
        this.apiGetCategories();
      } else {
        alert('Error! An error occurred. Please try again later.');
      }
    });
  }
  apiPutCategory(id, cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/categories/' + id, cate, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Good job!');
        this.apiGetCategories();
      } else {
        alert('Error! An error occurred. Please try again later.');
      }
    });
  }
  apiDeleteCategory(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete('/api/admin/categories/' + id, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Good job!');
        this.apiGetCategories();
      } else {
        alert('Error! An error occurred. Please try again later.');
      }
    });
  }
  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      const result = res.data;
      this.props.updateCategories(result);
    });
  }
}
export default CategoryDetail;