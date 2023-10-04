import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { Link, HashRouter, Routes, Route } from 'react-router-dom';
import Products from './Products';
import Orders from './Orders';
import Cart from './Cart';
import Login from './Login';

const App = ()=> {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [auth, setAuth] = useState({});

  const getHeaders = ()=> {
    return {
      headers: {
        authorization: window.localStorage.getItem('token')
      }
    };
  };

  const attemptLoginWithToken = async()=> {
    const token = window.localStorage.getItem('token');
    if(token){
      try {
        const response = await axios.get('/api/me', getHeaders());
        setAuth(response.data);
      }
      catch(ex){
        if(ex.response.status === 401){
          window.localStorage.removeItem('token');
        }
      }
    }
  }

  useEffect(()=> {
    attemptLoginWithToken();
  }, []);

  useEffect(()=> {
    const fetchData = async()=> {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    };
    fetchData();
  }, []);

  useEffect(()=> {
    if(auth.id){
      const fetchData = async()=> {
        const response = await axios.get('/api/orders', getHeaders());
        setOrders(response.data);
      };
      fetchData();
    }
  }, [auth]);

  useEffect(()=> {
    if(auth.id){
      const fetchData = async()=> {
        const response = await axios.get('/api/lineItems', getHeaders());
        setLineItems(response.data);
      };
      fetchData();
    }
  }, [auth]);


  const createLineItem = async(product)=> {
    const response = await axios.post('/api/lineItems', {
      order_id: cart.id,
      product_id: product.id
    }, getHeaders());
    setLineItems([...lineItems, response.data]);
  };

  const updateLineItem = async(lineItem)=> {
    const response = await axios.put(`/api/lineItems/${lineItem.id}`, {
      quantity: lineItem.quantity + 1,
      order_id: cart.id
    }, getHeaders());
    setLineItems(lineItems.map( lineItem => lineItem.id == response.data.id ? response.data: lineItem));
  };

  const updateOrder = async(order)=> {
    await axios.put(`/api/orders/${order.id}`, order, getHeaders());
    const response = await axios.get('/api/orders', getHeaders());
    setOrders(response.data);
  };

  const removeFromCart = async(lineItem)=> {
    const response = await axios.delete(`/api/lineItems/${lineItem.id}`, getHeaders());
    setLineItems(lineItems.filter( _lineItem => _lineItem.id !== lineItem.id));
  };

  const cart = orders.find(order => order.is_cart) || {};

  const cartItems = lineItems.filter(lineItem => lineItem.order_id === cart.id);

  const cartCount = cartItems.reduce((acc, item)=> {
    return acc += item.quantity;
  }, 0);

  const login = async(credentials)=> {
    const response = await axios.post('/api/login', credentials);
    const { token } = response.data;
    window.localStorage.setItem('token', token);
    attemptLoginWithToken();
  }

  const logout = ()=> {
    window.localStorage.removeItem('token');
    setAuth({});
  }

  const createNewUser = async (json) => {
    const response = await axios.post('/api/newUser', json);
  }

  return (
    <div>
      {
        auth.id ? (
          <>
            <nav>
              <Link to='/products'>Products ({ products.length })</Link>
              <Link to='/orders'>Orders ({ orders.filter(order => !order.is_cart).length })</Link>
              <Link to='/cart'>Cart ({ cartCount })</Link>
              <span>
                Welcome { auth.username }!
                <button onClick={ logout }>Logout</button>
              </span>
            </nav>
            <main>
              <Products
                auth = { auth }
                products={ products }
                cartItems = { cartItems }
                createLineItem = { createLineItem }
                updateLineItem = { updateLineItem }
              />
              <Cart
                cart = { cart }
                lineItems = { lineItems }
                products = { products }
                updateOrder = { updateOrder }
                removeFromCart = { removeFromCart }
              />
              <Orders
                orders = { orders }
                products = { products }
                lineItems = { lineItems }
              />
            </main>
            </>
        ):(
          <div>
            <Login login={ login }
            createNewUser={createNewUser}/>
            <Products
              products={ products }
              cartItems = { cartItems }
              createLineItem = { createLineItem }
              updateLineItem = { updateLineItem }
              auth = { auth }
            />
          </div>
        )
      }
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<HashRouter><App /></HashRouter>);
