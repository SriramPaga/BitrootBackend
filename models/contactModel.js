const mongoose = require('mongoose');

const contactSchema = mongoose.Schema(
  {
    id: {
      type: Number,
      required: [true, 'Id required'],
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Contact Name required'],
    },
    phoneNumber: [
      {
        type: String,
        unique: true,
        required: [true, 'Contact phone number required'],
      },
    ],
    address: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
