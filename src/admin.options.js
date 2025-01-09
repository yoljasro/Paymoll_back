const { default: AdminBro } = require('admin-bro');
const AdminBroMongoose = require('admin-bro-mongoose');

AdminBro.registerAdapter(AdminBroMongoose);

// models
const Profile = require("./Profile/profile.admin")
const Product = require("./Product/product.admin")
/** @type {import('admin-bro').AdminBroOptions} */
const options = {
  resources: [
    Profile, Product
  ],
  // dashboard: {
  //   component: AdminBro.bundle('./Chart/components/SalesChart.js'), // Sales chart komponentini qo'shdik
  // },
};

module.exports = options;
