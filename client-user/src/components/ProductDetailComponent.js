import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';
import './ProductView.css';

class ProductDetail extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      product: null,
      txtQuantity: 1
    };
  }
  render() {
    const prod = this.state.product;
    if (prod != null) {
      return (
        <div className="product-details-container-view">
          <div className="product-image-container-view">
            <img className="product-image-view" src={"data:image/jpg;base64," + prod.image} alt={prod.name} />
          </div>
          <div className="product-info-container-view">
            <h2 className="product-title-view">{prod.name}</h2>
            <form className="product-form-view">
              <div className="form-group-view">
                <label>ID:</label>
                <span>{prod._id}</span>
              </div>
              <div className="form-group-view">
                <label>Price:</label>
                <h3>{prod.price}</h3>
              </div>
              <div className="form-group-view">
                <label>Category:</label>
                <h4>{prod.category.name}</h4>
              </div>
              <div className="form-group-view">
                <label>Quantity:</label>
                <input
                  type="number"
                  className="quantity-input-view"
                  min="1"
                  max="99"
                  value={this.state.txtQuantity}
                  onChange={(e) => this.setState({ txtQuantity: e.target.value })}
                />
              </div>
              <div className="form-group-view">
                <button className="add-to-cart-btn-view" onClick={(e) => this.btnAdd2CartClick(e)}>ADD TO CART</button>
              </div>
            </form>
          </div>
        </div>
      );
    }
    return (<div />);
  }


  componentDidMount() {
    const params = this.props.params;
    this.apiGetProduct(params.id);
  }
  // event-handlers
  btnAdd2CartClick(e) {
    e.preventDefault();
    const product = this.state.product;
    const quantity = parseInt(this.state.txtQuantity);
    if (quantity) {
      const mycart = this.context.mycart;
      const index = mycart.findIndex(x => x.product._id === product._id); // check if the _id exists in mycart
      if (index === -1) { // not found, push newItem
        const newItem = { product: product, quantity: quantity };
        mycart.push(newItem);
      } else { // increasing the quantity
        mycart[index].quantity += quantity;
      }
      this.context.setMycart(mycart);
      alert('Good job!');
    } else {
      alert('Please input quantity');
    }
  }
  // apis
  apiGetProduct(id) {
    axios.get('/api/customer/products/' + id).then((res) => {
      const result = res.data;
      this.setState({ product: result });
    });
  }
}
export default withRouter(ProductDetail);