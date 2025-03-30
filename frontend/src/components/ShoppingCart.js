import React from 'react';
import '../ShoppingCart.css';

const ShoppingCart = ({ cart, onRemoveFromCart }) => {
    const total = cart.reduce((sum, item) => sum + item['Variant Price'], 0);
  
    return (
      <div className="shopping-cart">
        <h2>Your Cart <span className="cart-count">{cart.length}</span></h2>
        
        {cart.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <ul className="cart-items">
              {cart.map(item => (
                <li key={item._id} className="cart-item">
                  <div className="item-info">
                    <div className="item-name">{item['Title']}</div>
                    <div className="item-price">${Number(item["Variant Price"])?.toFixed(2)}</div>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => onRemoveFromCart(item._id)}
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            
            <div className="cart-summary">
              <div className="subtotal">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <button className="checkout-btn" disabled={cart.length === 0}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    );
  };
export default ShoppingCart;