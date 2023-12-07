import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CategoryDetail from './CategoryDetailComponent';
import './Category.css';

class Category extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      itemSelected: null
    };
  }
  render() {
    const categoriesList = this.state.categories.map((item) => (
      <div key={item._id} className="category-card" onClick={() => this.trItemClick(item)}>
        <h3>{item.name}</h3>
        <p>ID: {item._id}</p>
      </div>
    ));

    return (
      <div className="category-page">
        <div className="category-list">
          <h2 className="text-center">CATEGORY LIST</h2>
          <div className="category-cards-container">{categoriesList}</div>
        </div>
        <div className="category-form">
          <CategoryDetail item={this.state.itemSelected} updateCategories={this.updateCategories} />
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.apiGetCategories();
  }
  updateCategories = (categories) => { // arrow-function
    this.setState({ categories: categories });
  }
  // event-handlers
  trItemClick(item) {
    this.setState({ itemSelected: item });
  }
  // apis
  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }
}
export default Category;