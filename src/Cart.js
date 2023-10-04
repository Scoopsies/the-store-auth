import React, {useState} from 'react';

const Cart = ({ updateOrder, removeFromCart, lineItems, cart, products })=> {
  const [address, setAddress] = useState('')
  return (
    <div>
      <h2>Cart</h2>
      <ul>
        {
          lineItems.filter(lineItem=> lineItem.order_id === cart.id).map( lineItem => {
            const product = products.find(product => product.id === lineItem.product_id) || {};
            console.log(product)
            return (
              <li key={ lineItem.id }>
                { product.name }
                ({ lineItem.quantity })
                <button onClick={ ()=> removeFromCart(lineItem)}>Remove From Cart</button>
              </li>
            );
          })
        }
      </ul>
      {lineItems.filter(lineItem => lineItem.order_id === cart.id ).length ? <label>Address:</label> : null}
      {lineItems.filter(lineItem => lineItem.order_id === cart.id ).length ? <input value={address} onChange={(ev) => setAddress(ev.target.value)}></input> : null}
      <br/>
      {
        lineItems.filter(lineItem => lineItem.order_id === cart.id ).length ? <button disabled={!address} onClick={()=> {
          updateOrder({...cart, is_cart: false, address });
          setAddress('');
        }}>Create Order</button>: null
      }
    </div>
  );
};

export default Cart;
