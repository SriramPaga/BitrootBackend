const express = require('express');
const Contact = require('./models/contactModel');

const app = express();
var cors = require('cors');
app.use(cors());
const port = 5000;

app.use(express.json());

const mongoose = require('mongoose');

mongoose
  .connect(
    'mongodb+srv://pagasriram2:tNLzA0swOG7NQQXA@assessmenttest.amjx9cv.mongodb.net/'
  )
  .then(() => {
    console.log('Connected!');
    app.listen(port, () => {
      console.log(`Server started at http://127.0.0.1:${port}`);
    });
  })
  .catch((error) => {
    console.log('Error with connecting database');
  });

//methods
//Create a new contact
app.post('/contact', async (req, res) => {
  try {
    console.log(req);
    const unique_flag = await Contact.find({
      phoneNumber: { $eq: req.body.phoneNumber },
    });
    console.log(unique_flag);
    if (unique_flag.length == 0) {
      const contact = await Contact.create(req.body);
      return res.status(201).json(contact);
    }
    return res
      .status(400)
      .json({ message: 'User with phoneNumber already exists' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Delete Contact
app.delete('/contact/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);
    console.log(contact);
    res.status(200).json({ message: 'User Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Fetch all ccontacts
app.get('/contact', async (req, res) => {
  try {
    const contacts = await Contact.find({});
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Seacrh Contacts
app.get('/contact/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Update contact
app.put("/contact/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log("id",id)
      const unique_flag = await Contact.find({ name: { $eq: req.body.name } });
      console.log("unique_flag",unique_flag);
      if ((unique_flag.length == 1) && (unique_flag[0]._id == id) ) {
        const contact = await Contact.findByIdAndUpdate(id, req.body);
        if (!contact) {
          return res
            .status(404)
            .json({ message: `Cannot find contact with id ${id}` });
        }
        const update = await Contact.findById(id);
        return res.status(201).json(update);
      }
      return res.status(400).json({ message: "User with email already exists" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


