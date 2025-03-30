import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] }))
}));


// Mock child components
jest.mock('./components/ProductList', () => ({ products, onAddToCart }) => (
  <div data-testid="product-list">
    {products.map(product => (
      <div key={product._id} data-testid={`product-${product._id}`}>
        {product.name}
        <button onClick={() => onAddToCart(product)}>Add to Cart</button>
      </div>
    ))}
  </div>
));

jest.mock('./components/SearchBar', () => ({ onSearch }) => (
  <input 
    data-testid="search-bar" 
    onChange={(e) => onSearch(e.target.value)} 
    placeholder="Search products..."
  />
));

jest.mock('./components/ShoppingCart', () => ({ cart, onRemoveFromCart }) => (
  <div data-testid="shopping-cart">
    {cart.map(item => (
      <div key={item._id} data-testid={`cart-item-${item._id}`}>
        {item.name}
        <button onClick={() => onRemoveFromCart(item._id)}>Remove</button>
      </div>
    ))}
  </div>
));

jest.mock('./components/ChatInterface', () => ({ onClose, onSearch, chatHistory }) => (
  <div data-testid="chat-interface">
    <button onClick={onClose}>Close Chat</button>
    <button onClick={() => onSearch('test query')}>Search via Chat</button>
    <div data-testid="chat-history">
      {chatHistory.map((msg, i) => (
        <div key={i}>{msg}</div>
      ))}
    </div>
  </div>
));

// Mock axios
jest.mock('axios');

describe('App Component', () => {
  const mockProducts = [
    { _id: '1', name: 'Product 1', price: 10 },
    { _id: '2', name: 'Product 2', price: 20 }
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockProducts });
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.className = '';
  });

  it('renders the app header', () => {
    render(<App />);
    expect(screen.getByText('E-Commerce Store')).toBeInTheDocument();
  });

  it('fetches and displays products on initial render', async () => {
    render(<App />);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(`${process.env.REACT_APP_API_BASE_URL}/api/products`);
    });
    expect(screen.getByTestId('product-list')).toBeInTheDocument();
    expect(screen.getByTestId('product-1')).toHaveTextContent('Product 1');
    expect(screen.getByTestId('product-2')).toHaveTextContent('Product 2');
  });

  it('shows loading message when searching', async () => {
    axios.get.mockImplementation(() => new Promise(() => {}));
    render(<App />);
    fireEvent.change(screen.getByTestId('search-bar'), { target: { value: 'test' } });
    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });

  it('shows no products message when search returns empty', async () => {
    axios.get.mockResolvedValue({ data: [] });
    render(<App />);
    fireEvent.change(screen.getByTestId('search-bar'), { target: { value: 'nonexistent' } });
    await waitFor(() => {
      expect(screen.getByText('No products found')).toBeInTheDocument();
    });
  });

  it('adds product to cart when add button is clicked', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });
    
    const addButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addButtons[0]);
    
    expect(screen.getByTestId('shopping-cart')).toHaveTextContent('Product 1');
    expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
  });

  it('removes product from cart when remove button is clicked', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });
    
    // Add to cart
    const addButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addButtons[0]);
    
    // Remove from cart
    const removeButton = screen.getByText('Remove');
    fireEvent.click(removeButton);
    
    expect(screen.getByTestId('shopping-cart')).not.toHaveTextContent('Product 1');
    expect(screen.queryByTestId('cart-item-1')).not.toBeInTheDocument();
  });

  it('toggles chat interface when button is clicked', () => {
    render(<App />);
    const chatButton = screen.getByText('💬 Product Help');
    fireEvent.click(chatButton);
    expect(screen.getByTestId('chat-interface')).toBeInTheDocument();
    
    const closeButton = screen.getByText('Close Chat');
    fireEvent.click(closeButton);
    expect(screen.queryByTestId('chat-interface')).not.toBeInTheDocument();
  });

  it('adds body class when chat is open and removes it when closed', () => {
    render(<App />);
    const chatButton = screen.getByText('💬 Product Help');
    
    fireEvent.click(chatButton);
    expect(document.body).toHaveClass('chat-open');
    
    fireEvent.click(screen.getByText('Close Chat'));
    expect(document.body).not.toHaveClass('chat-open');
  });

  it('updates search query when search is triggered from chat', async () => {
    render(<App />);
    const chatButton = screen.getByText('💬 Product Help');
    fireEvent.click(chatButton);
    
    const searchViaChatButton = screen.getByText('Search via Chat');
    fireEvent.click(searchViaChatButton);
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_BASE_URL}/api/products/search?query=test query`
      );
    });
  });

  it('handles API errors gracefully', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));
    console.error = jest.fn(); // Suppress error logs
    
    render(<App />);
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching products:', expect.any(Error));
    });
  });
});