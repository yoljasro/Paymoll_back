  const mongoose = require('mongoose');

  const ProfileSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      index: true, // Indeks yaratish
      validate: {
          validator: function (value) {
              return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
          },
          message: 'Invalid email format',
      },
  },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: '', // Profil rasmi uchun URL
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  });

  // Parolni saqlashdan oldin vaqtni yangilash
  ProfileSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
  });

  const Profile = mongoose.model('Profile', ProfileSchema);

  module.exports = {Profile,  ProfileSchema };
