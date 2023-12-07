import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import './Products.css';

class ProductDetail extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtID: '',
      txtName: '',
      txtPrice: 0,
      cmbCategory: '',
      imgProduct: '',
    };
  }
  render() {
    const cates = this.state.categories.map((cate) => {
      if (this.props.item != null) {
        return (<option key={cate._id} value={cate._id} selected={cate._id === this.props.item.category._id}>{cate.name}</option>);
      } else {
        return (<option key={cate._id} value={cate._id}>{cate.name}</option>);
      }
    });
    return (
      <div className="product-form-container" id="product-details-form">
        <form className="product-form">
          <div className="form-group">
            <label>ID</label>
            <div className="center-button">
              <input type="text" id="input" value={this.state.txtID} onChange={(e) => { this.setState({ txtID: e.target.value }) }} readOnly={true} />
            </div>
          </div>
          <div className="form-group">
            <label>Name</label>
            <div className="center-button">
              <input type="text" id="input" value={this.state.txtName} onChange={(e) => { this.setState({ txtName: e.target.value }) }} />
            </div>
          </div>
          <div className="form-group">
            <label>Price</label>
            <div className="center-button">
              <input type="text" id="input" value={this.state.txtPrice} onChange={(e) => { this.setState({ txtPrice: e.target.value }) }} />
            </div>
          </div>
          <div className="form-group">
            <label>Image</label>
            <div className="center-button">
              <input type="file" name="fileImage" accept="image/jpeg, image/png, image/gif" onChange={(e) => this.previewImage(e)} />
            </div>
          </div>
          <div className="form-group">
            <label>Category</label>
            <div className="center-button">
              <select onChange={(e) => { this.setState({ cmbCategory: e.target.value }) }}>{cates}</select>
            </div>
          </div>
          <div className="cat-form-group">
            <input id="btn" type="submit" value="ADD NEW" onClick={(e) => this.btnAddClick(e)} />
            <input id="btn" type="submit" value="UPDATE" onClick={(e) => this.btnUpdateClick(e)} />
            <input id="delete" type="submit" value="DELETE" onClick={(e) => this.btnDeleteClick(e)} />
          </div>
          <div className="form-row">
            <img src={this.state.imgProduct} width="300px" height="300px" alt="" />
          </div>
        </form>
      </div>
    );
  }
  componentDidMount() {
    this.apiGetCategories();
  }
  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.setState({
        txtID: this.props.item._id,
        txtName: this.props.item.name,
        txtPrice: this.props.item.price,
        cmbCategory: this.props.item.category._id,
        imgProduct: 'data:image/jpg;base64,' + this.props.item.image
      });
    }
  }
  // event-handlers
  previewImage(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.setState({ imgProduct: evt.target.result });
      }
      reader.readAsDataURL(file);
    }
  }

  btnAddClick(e) {
    e.preventDefault();
    const { txtName, txtPrice, cmbCategory, imgProduct } = this.state;
    const name = txtName;
    const price = parseInt(txtPrice, 10); //To ensure price is an integer
    const category = cmbCategory;

    if (name && !isNaN(price) && category && imgProduct !== undefined && imgProduct !== null && imgProduct !== '') {
      const image = imgProduct.split(',')[1]; // Extracting image data without "data:image/...;base64,"
      const prod = { name, price, category, image };
      this.apiPostProduct(prod);
    }  else {
      alert('Please input name, price, category, and image');
    }
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const name = this.state.txtName;
    const price = parseInt(this.state.txtPrice);
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace(/^data:image\/[a-z]+;base64,/, ''); // remove "data:image/...;base64,"
    if (id && name && price && category && image) {
      const prod = { name: name, price: price, category: category, image: image };
      this.apiPutProduct(id, prod);
    } else {
      alert('Please input id and name and price and category and image');
    }
  }
  btnDeleteClick(e) {
    e.preventDefault();
    if (window.confirm('ARE YOU SURE?')) {
      const id = this.state.txtID;
      if (id) {
        this.apiDeleteProduct(id);
      } else {
        alert('Please input id');
      }
    }
  }
  // apis
  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }

  // apiPostProduct function
  apiPostProduct(prod) {
    const config = {
      headers: {
        'x-access-token': this.context.token,
        'Content-Type': 'application/json', // Setting Content-Type header
      },
    };
    axios.post('/api/admin/products', prod, config)
      .then((res) => {
        const result = res.data;
        console.log(result);
        if (result) {
          alert('Good job!');
          this.apiGetProducts();
        } else {
          alert('Error! An error occurred. Please try again later.');
        }
      })
      .catch((error) => {
        console.error('API error:', error);
        alert('Error! An unexpected error occurred. Please try again later.');
      });
  }

  apiPutProduct(id, prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/products/' + id, prod, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Good job!');
        this.apiGetProducts();
      } else {
        alert('Error! An error occurred. Please try again later.');
      }
    });
  }
  apiDeleteProduct(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete('/api/admin/products/' + id, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Good job!');
        this.apiGetProducts();
      } else {
        alert('Error! An error occurred. Please try again later.');
      }
    });
  }
  apiGetProducts() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/products?page=' + this.props.curPage, config).then((res) => {
      const result = res.data;
      if (result.products.length !== 0) {
        this.props.updateProducts(result.products, result.noPages, result.curPage);
      } else {
        const curPage = this.props.curPage - 1;
        axios.get('/api/admin/products?page=' + curPage, config).then((res) => {
          const result = res.data;
          this.props.updateProducts(result.products, result.noPages, curPage);
        });
      }
    });
  }
}
export default ProductDetail;