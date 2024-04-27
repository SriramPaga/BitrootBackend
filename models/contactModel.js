const mongoose = require('mongoose');

const contactSchema = mongoose.Schema(
  {
    id: {
      type: Number,
      required: [true, 'Id required'],
    },
    name: {
      type: String,
      required: [true, 'Contact Name required'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Contact phone number required'],
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
