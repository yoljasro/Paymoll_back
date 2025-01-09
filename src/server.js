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

// // Click API ma'lumotlari
// const MERCHANT_ID = '27487'; // Sizning merchant ID
// const SERVICE_ID = '37711'; // Sizning service ID
// const MERCHANT_USER_ID = '46815'; // Sizning merchant user ID
// const SECRET_KEY = 'isJihg1thilU'; // Sizning secret key\





//controllers 
// const { createOrder, getAllOrders, getOrderById, updateOrderStatus, updateOrder, deleteOrder } = require("./controllers/orders.controller");

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
const authMiddleware = require('./middleware/auth.middleware'); // Authentication middleware



// Click - Invoice yaratish

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

  // CRUD marshrutlar
  //profile
  // app.post('/profiles', createProfile);
  // app.put('/profiles/:id', updateProfile);
  // app.get('/profiles', getAllProfiles);
  // app.delete('/profiles/:id', deleteProfile);
  // app.put('/profiles/:id',  updateProfile);
  // Socket.IO configuration

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

  app.get('product/:id', getProductById);

  // PUT /api/products/:id - Update a specific product by ID
  app.put('product/:id', updateProduct);

  // DELETE /api/products/:id - Delete a specific product by ID
  app.delete('product/:id', deleteProduct);




  io.on('connection', (socket) => {
    z``
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

