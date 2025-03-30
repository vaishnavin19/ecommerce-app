// server.test.js
const request = require('supertest');
const mongoose = require('mongoose');

// 1. First mock all dependencies properly
jest.mock('express', () => {
  const express = () => ({
    use: jest.fn(),
    listen: jest.fn((port, callback) => callback())
  });
  express.json = jest.fn(() => 'json-middleware');
  express.Router = jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }));
  return express;
});

jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue({})
}));

jest.mock('cors', () => () => (req, res, next) => next());

jest.mock('dotenv', () => ({ config: jest.fn() }));

jest.mock('./routes/products', () => {
  // Use the mocked express.Router
  const express = require('express');
  const router = express.Router();
  router.get.mockImplementation((path, handler) => {
    handler({}, { json: jest.fn().mockReturnValue([{ name: 'Test Product' }]) });
  });
  return router;
});

describe('Server Configuration', () => {
  let app;
  
  beforeAll(() => {
    process.env.MONGODB_URI = 'mongodb://test:test@localhost:27017/testdb';
    process.env.PORT = '5000';
    
    // Create test app
    app = require('./server');
  });

  it('should configure middleware', () => {
    const express = require('express');
    // expect(app.use).toHaveBeenCalledWith(expect.any(Function)); // cors
    expect(app.use).toHaveBeenCalledWith(express.json());
  });

  it('should connect to MongoDB', () => {
    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URI);
  });

  it('should set up product routes', () => {
    expect(app.use).toHaveBeenCalledWith('/api/products', expect.any(Object));
  });

  it('should start listening on port', () => {
    expect(app.listen).toHaveBeenCalledWith(process.env.PORT, expect.any(Function));
  });
});
