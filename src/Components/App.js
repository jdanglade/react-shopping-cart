import Header from "./Header";
import React from "react";
import data from "../data.json";
import Products from "./Products";
import Filter from "./Filter";
import Cart from "./Cart";
import store from "../store";
import { Provider } from "react-redux";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      products: data.products,
      size: "",
      sort: "",
      cartItems: localStorage.getItem("cartItems")
        ? JSON.parse(localStorage.getItem("cartItems"))
        : [],
      showCheckout: false,
    };
  }
  createOrder = (order) => {
    alert("Need to save order for " + order.name);
  };
  removeFromCart = (product) => {
    const cartItems = this.state.cartItems.slice();
    this.setState({
      cartItems: cartItems.filter((x) => x._id !== product._id),
    });
    localStorage.setItem(
      "cartItems",
      JSON.stringify(cartItems.filter((x) => x._id !== product._id))
    );
  };

  addToCart = (product) => {
    const cartItems = this.state.cartItems.slice();
    let alreadyInCart = false;
    cartItems.forEach((item) => {
      if (item._id === product._id) {
        item.count++;
        alreadyInCart = true;
      }
    });

    if (!alreadyInCart) {
      cartItems.push({ ...product, count: 1 });
    }
    this.setState({ cartItems });
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  };

  sortProducts = (event) => {
    //implementation
    const sortBy = event.target.value;
    console.log(event.target.value);
    this.setState((state) => ({
      sort: sortBy,
      products: this.state.products
        .slice()
        .sort((a, b) =>
          sortBy === "lowest"
            ? a.price > b.price
              ? 1
              : -1
            : sortBy === "highest"
            ? a.price < b.price
              ? 1
              : -1
            : a._id > b._id
            ? 1
            : -1
        ),
    }));
  };
  filterProducts = (event) => {
    //implementation
    console.log(event.target.value);
    if (event.target.value === "All") {
      this.setState({ size: event.target.value, products: data.products });
    } else {
      this.setState({
        size: event.target.value,
        products: data.products.filter(
          (product) => product.availableSizes.indexOf(event.target.value) >= 0
        ),
      });
    }
  };

  render() {
    return (
      <Provider store={store}>
        <div className="grid-container">
          <Header />
          <main>
            <div className="content">
              <div className="main">
                <Filter
                  count={this.state.products.length}
                  size={this.state.size}
                  sort={this.state.sort}
                  filterProducts={this.filterProducts}
                  sortProducts={this.sortProducts}
                ></Filter>
                <Products
                  products={this.state.products}
                  addToCart={this.addToCart}
                ></Products>
              </div>
              <div className="sidebar">
                <Cart
                  cartItems={this.state.cartItems}
                  removeFromCart={this.removeFromCart}
                  createOrder={this.state.createOrder}
                ></Cart>
              </div>
            </div>
          </main>
          <footer>All rights reserved.</footer>
        </div>
      </Provider>
    );
  }
}

export default App;
