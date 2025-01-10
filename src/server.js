const express = require('express');
const { default: AdminBro } = require('admin-bro');
const AdminBroMongoose = require('admin-bro-mongoose');
const mongoose = require('mongoose');
const cors = require('cors');
const options = require('./admin.options');
const buildAdminRouter = require('./admin.router');
const axios = require('axios');
const crypto = require('crypto');
const path = require("path")
const http = require('http');
require('dotenv').config();
// const dotenv = require("{")
const { Server } = require('socket.io');


// Sales Chart uchun kerakli kutubxonalar


const app = express();
const port = 9000;


// Create an HTTP server to use with Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Frontend manzilingiz


    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true // Agar kerak bo'lsa
  }
});


app.use(cors());

// Middleware
app.use(express.json()); // JSON formatida ma'lumotlarni qabul qilish
app.use(express.json({ limit: '100mb' }));

app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use('/uploads', express.static('uploads'));

const {
  registerUser,
  loginUser,
  resetPassword,
  getUserProfile,
  updateUserProfile,
} = require('./controllers/profile.controller');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('./controllers/product.controller');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("./controllers/order.controller")
const authMiddleware = require('./middleware/auth.middleware'); // Authentication middleware


// AdminBro va boshqa marshrutlarni o'rnatish
const run = async () => {
  try {
    await mongoose.connect('mongodb+srv://saidaliyevjasur450:nBc8ZsOw0uFboAWM@paymall.t1g8n.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });

    console.log('Connected to MongoDB database');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }

  const admin = new AdminBro(options);
  const router = buildAdminRouter(admin);

  app.use(admin.options.rootPath, router);

  // Default routes
  app.get("/", (req, res) => {
    res.send("hello world. I'm JasurBek");
  });

  app.post('/register', registerUser);

  // POST /api/auth/login
  app.post('/login', loginUser);

  // GET /api/auth/verify

  // POST /api/auth/reset-password
  app.post('/reset-password', resetPassword);

  // GET /api/auth/profile (Requires Authentication)  1 
  app.get('/profile', authMiddleware, getUserProfile);

  // PUT /api/auth/profile (Requires Authentication)
  app.put('/profile', authMiddleware, updateUserProfile);


  app.post('/product', createProduct);

  // GET /api/products - Get all products
  app.get('/product', getProducts);

  app.get('/product/:id', getProductById);

  // PUT /api/products/:id - Update a specific product by ID
  app.put('/product/:id', updateProduct);

  // DELETE /api/products/:id - Delete a specific product by ID
  app.delete('/product/:id', deleteProduct);

  app.post('/order', createOrder);

  // Get list of all orders
  app.get('/orders', getOrders);

  // Get an order by ID
  app.get('/order/:id', getOrderById);

  // Update an order
  app.put('/order/:id', updateOrder);

  // Delete an order
  app.delete('/order/:id', deleteOrder);



  io.on('connection', (socket) => {

    console.log('A user connected:', socket.id);

    // Emit a message when a new order is created    
    socket.on('new-order', (data) => {
      io.emit('update-order-list', data); // Broadcast to all clients
      console.log('New order created:', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // Start the server using HTTP server
  server.listen(port, () => console.log(
    `Example app listening at http://localhost:${port}`,
  ));
};

module.exports = run;

