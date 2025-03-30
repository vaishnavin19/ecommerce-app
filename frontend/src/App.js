import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from './components/ProductList';
import SearchBar from './components/SearchBar';
import ShoppingCart from './components/ShoppingCart';
import ChatInterface from './components/ChatInterface';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  // Toggle body class when chat is open/closed
  useEffect(() => {
    if (showChat) {
      document.body.classList.add('chat-open');
    } else {
      document.body.classList.remove('chat-open');
    }
    
    return () => {
      document.body.classList.remove('chat-open');
    };
  }, [showChat]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsSearching(true);
        const url = searchQuery 
          ? `${process.env.REACT_APP_API_BASE_URL}/api/products/search?query=${searchQuery}`
          : `${process.env.REACT_APP_API_BASE_URL}/api/products`;
        console.log('Fetching products from:', url);
        const response = await axios.get(url);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId) => {
    const index = cart.findIndex(item => item._id === productId);
    if (index !== -1) {
      setCart([...cart.slice(0, index), ...cart.slice(index + 1)]);
    }
  };

  return (
    <div className="app">
      <h1 className='app-header'>E-Commerce Store</h1>
      
      <div className="search-chat-container">
        <SearchBar onSearch={setSearchQuery} />
      </div>
      
      <div className="content">
        <div className="product-list-container">
          {isSearching ? (
            searchQuery ? (
              <div className="loading-message">Searching...</div>
            ) : (
              <div className="loading-message">Loading...</div>
            )
          ) : products.length === 0 && searchQuery ? (
            <div className="no-products-message">No products found</div>
          ) : (
            <ProductList products={products} onAddToCart={addToCart} />
          )}
        </div>
        
        <div className="shopping-cart-container">
          <ShoppingCart cart={cart} onRemoveFromCart={removeFromCart} />
        </div>
      </div>
      
      {/* Chat toggle button positioned fixed in corner */}
      <button 
        className="chat-toggle-button"
        onClick={() => setShowChat(!showChat)}
      >
        {showChat ? (
          <>
            ✕ Close Chat
            {chatHistory.length > 0 && (
              <span className="unread-count">{chatHistory.length}</span>
            )}
          </>
        ) : (
          '💬 Product Help'
        )}
      </button>
      
      {/* Chat interface positioned as overlay */}
      {showChat && (
        <div className="chat-popup-container">
          <ChatInterface 
            onSearch={setSearchQuery} 
            onClose={() => setShowChat(false)}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
          />
        </div>
      )}
    </div>
  );
}

export default App;