const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/products');

require('dotenv').config();

const app = express();

app.use(cors({
  origin: ["https://ecommerce-app-puce-five.vercel.app/", "https://ecommerce-app-latest.vercel.app"],
  methods: ["GET", "POST"],
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));

app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// At the end of server.js
module.exports = app;