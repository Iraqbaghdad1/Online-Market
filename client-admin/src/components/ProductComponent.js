import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import ProductDetail from './ProductDetailComponent';
import './Products.css';

class Product extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      noPages: 0,
      curPage: 1,
      itemSelected: null
    };
  }
  render() {
    const prods = this.state.products.map((item) => (
      <div key={item._id} className="product-card" onClick={() => this.trItemClick(item)}>
        <h3>{item.name}</h3>
        <p>ID: {item._id}</p>
        <p>Price: {item.price}</p>
        <p>Creation date: {new Date(item.cdate).toLocaleString()}</p>
        <p>Category: {item.category.name}</p>
        <img src={"data:image/jpg;base64," + item.image} width="100px" height="100px" alt="" />
      </div>
    ));

    const pagination = Array.from({ length: this.state.noPages }, (_, index) => (
      <span key={index} className={index + 1 === this.state.curPage ? "current-page" : "link"} onClick={() => this.lnkPageClick(index + 1)}>
        | {index + 1} |
      </span>
    ));

    return (
      <div className="product-page">
        <div className="product-list">
          <h2 className="text-center">PRODUCT LIST</h2>
          <div className="product-cards-container">{prods}</div>
          <div className="pagination">
            <p>{pagination}</p>
          </div>
        </div>
        <div className="product-form">
          <h2 className="text-center">PRODUCT DETAILS</h2>
          <ProductDetail item={this.state.itemSelected} curPage={this.state.curPage} updateProducts={this.updateProducts} />
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.apiGetProducts(this.state.curPage);
  }
  updateProducts = (products, noPages, curPage) => { // arrow-function
    this.setState({ products: products, noPages: noPages, curPage: curPage });
  }
  // event-handlers
  lnkPageClick(index) {
    this.apiGetProducts(index);
  }
  trItemClick(item) {
    this.setState({ itemSelected: item });
  }
  // apis
  apiGetProducts(page) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/products?page=' + page, config).then((res) => {
      const result = res.data;
      this.setState({ products: result.products, noPages: result.noPages, curPage: result.curPage });
    });
  }
}
export default Product;