import React from 'react';
import { Link } from 'react-router-dom';

const Products = ({ products, cartItems, createLineItem, updateLineItem, createFavorite, auth, favorites, deleteFavorite})=> {

  const favorite = (product) => {
    const json = {
      product_id: product.id,
      user_id: auth.id
    }
    createFavorite(json)
  }

  const unFavorite = (product) => {
    const id = favorites.filter(item => item.product_id === product.id).filter(item => item.user_id === auth.id)[0].id
    deleteFavorite(id)
  }
  
  const usersFavorites = favorites.find(item => item.user_id === auth.id)

  const favoriteornot = (product) => {
    const usersFavorites = favorites.filter(item => item.user_id === auth.id);
    if (product) {
      return usersFavorites.filter(item => item.product_id === product.id).length;
    }
    return 0;
  }

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {
          products.map( product => {
            const cartItem = cartItems.find(lineItem => lineItem.product_id === product.id);
            return (
              <li key={ product.id }>
                { product.name }
                {
                  auth.id ? (
                    cartItem ? <button onClick={ ()=> updateLineItem(cartItem)}>Add Another</button>: <button disabled={product.out_of_stock} onClick={ ()=> createLineItem(product)}>{product.out_of_stock ? 'out of stock' : 'add'}</button>
                  ): null 
                }
                {
                  auth.id ? (
                  favoriteornot(product) ? <button onClick={() => unFavorite(product)}>unfavorite</button> : <button onClick={() => favorite(product)}>favorite</button> 
                  ) : null
                }
                {
                  auth.is_admin ? (
                    <Link to={`/products/${product.id}/edit`}>Edit</Link>
                  ): null
                }
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

export default Products;
