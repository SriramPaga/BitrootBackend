const express = require('express');
const Contact = require('./models/contactModel');

const app = express();
var cors = require('cors');
app.use(cors());
const port = 4000;
const host = '0.0.0.0';
var os = require('os');
app.use(express.json());

//Image Uplaod

const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const upload = require('./middleware/upload');
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'));

//CSV Writer
const Json2csvParser = require('json2csv').Parser;
const fs = require('fs');

const mongoose = require('mongoose');

mongoose
  .connect(
    'mongodb+srv://pagasriram2:tNLzA0swOG7NQQXA@assessmenttest.amjx9cv.mongodb.net/'
  )
  .then(() => {
    console.log('Connected!');
    app.listen(port, host, () => {
      console.log(`Server started at http://127.0.0.1:${port}`);
      console.log(host);
      console.log(os.hostname());
    });
  })
  .catch((error) => {
    console.log('Error with connecting database');
  });

//methods

//file upload
app.put(
  '/contact/uploadAvatar/:id',
  upload.single('avatar'),
  async (req, res) => {
    // console.log(req.file.path);
    try {
      const unique_id = await Contact.find({ id: { $eq: req.body.id } });
      // console.log(unique_id[0]._id);
      if (unique_id.length != 0) {
        // return console.log(req.file.path.toString());
        const contact = await Contact.findByIdAndUpdate(unique_id[0]._id, {
          avatar: req.file.path,
        });
        return res.status(201).json(contact);
      }
      return res.status(400).json({ message: 'User with id already exists' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

//Create a new contact
app.post('/contact', upload.single('avatar'), async (req, res) => {
  try {
    console.log(req);
    const unique_flag = await Contact.find({
      phoneNumber: { $eq: req.body.phoneNumber },
    });
    const unique_id = await Contact.find({
      id: { $eq: req.body.id },
    });
    console.log(unique_flag);
    if (unique_flag.length == 0) {
      if (unique_id.length == 0) {
        req.body.avatar = req.file.path;
        const contact = await Contact.create(req.body);
        return res.status(201).json(contact);
      }
      return res.status(400).json({ message: 'User with id already exists' });
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
    const unique_flag = await Contact.find({ id: { $eq: req.body.id } });
    const contact = await Contact.findByIdAndDelete(unique_flag[0]._id);
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
    const contact = await Contact.find({ id: id });
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//find by name
app.get('/contact/search/:searchvar', async (req, res) => {
  try {
    const { searchvar } = req.params;
    if (searchvar > 0) {
      const contact = await Contact.find({
        $or: [
          { name: { $eq: searchvar } },
          { phoneNumber: { $eq: searchvar } },
        ],
      });
      res.status(200).json(contact);
    } else {
      res.status(400).json({ message: 'No match found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Update contact
app.put('/contact/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('id', id);
    const unique_flag = await Contact.find({ id: { $eq: req.body.id } });
    console.log('unique_flag', unique_flag[0].id);
    if (
      unique_flag.length >= 1 &&
      unique_flag[0].id.toString() === id.toString()
    ) {
      // console.log('illige bantu if valage');
      req.body['_id'] = unique_flag[0]._id;
      delete req.body['phoneNumber'];
      console.log(req.body);
      const contact = await Contact.findByIdAndUpdate(
        unique_flag[0]._id.toString(),
        req.body
      );
      console.log(contact);
      if (!contact) {
        return res
          .status(404)
          .json({ message: `Cannot find contact with id ${id}` });
      }
      const update = await Contact.findById(unique_flag[0]._id);
      return res.status(201).json(update);
    }
    return res.status(400).json({ message: 'User with email already exists' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// to push phoneNumber
app.put('/contact/addphone/:id', async (req, res) => {
  try {
    console.log(req);
    const { id } = req.params;
    const unique_flag = await Contact.find({
      id: { $eq: id },
      //  phoneNumber:{$in: phoneNumber}
    });
    console.log(unique_flag);
    // const someVar = await Contact.
    // if (unique_flag.length == 0) {
    //   const contact = await Contact.create(req.body);
    //   return res.status(201).json(contact);
    // }

    if (unique_flag.length >= 1) {
      let tempArr;
      if (typeof req.body.phoneNumber == 'object') {
        console.log('this is an object');
        tempArr = new Array();
        for (let i = 0; i < req.body.phoneNumber.length; i++) {
          if (!unique_flag[0].phoneNumber.includes(req.body.phoneNumber[i])) {
            tempArr.push(req.body.phoneNumber[i]);
          }
        }
        if (tempArr.length == 0) {
          return res
            .status(400)
            .json({ message: ' phoneNumber already exists' });
        }
        // req.body.phoneNumber.forEach((el, i) => {
        //   if (req.body.phoneNumber.includes(req.body.phoneNumber[i])) {
        //     req.body.phoneNumber.splice(i, 1);
        //   }
        // });
        // req.body.phoneNumber.filter((item, i) => {
        //   unique_flag[0].phoneNumber.includes(req.body.phoneNumber[i]);
        // });
      } else {
        if (unique_flag[0].phoneNumber.includes(req.body.phoneNumber)) {
          return res
            .status(400)
            .json({ message: ' phoneNumber already exists' });
        }
        tempArr = req.body.phoneNumber;
      }
      const someVariable = Contact.findOneAndUpdate(
        { _id: unique_flag[0]._id },
        {
          $push: { phoneNumber: tempArr },
        }
      ).exec();
      // console.log(someVariable);
      return res
        .status(200)
        .json({ message: 'Phone Number Added', 'phoneNumbers added': tempArr });
    }
    return res
      .status(400)
      .json({ message: 'User with phoneNumber already exists' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// to pull phoneNumber
app.put('/contact/deletephone/:id', async (req, res) => {
  try {
    console.log(req);
    const { id } = req.params;
    const unique_flag = await Contact.find({
      id: { $eq: id },
      //  phoneNumber:{$in: phoneNumber}
    });
    console.log(unique_flag);
    // const someVar = await Contact.
    // if (unique_flag.length == 0) {
    //   const contact = await Contact.create(req.body);
    //   return res.status(201).json(contact);
    // }

    if (unique_flag.length >= 1) {
      // if (unique_flag[0].phoneNumber.includes(req.body.phoneNumber)) {
      //   return res.status(400).json({ message: ' phoneNumber already exists' });
      // }
      const someVariable = Contact.findByIdAndUpdate(unique_flag[0]._id, {
        $pull: { phoneNumber: { $eq: req.body.phoneNumber } },
      }).exec();
      console.log(someVariable);
      return res.status(200).json({ message: 'Phone Number deleted' });
    }
    return res
      .status(400)
      .json({ message: 'User with phoneNumber already exists' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//To export data to CSV
app.get('/contact/csvexport', async (req, res) => {
  try {
    const contacts = await Contact.find({}).toArray((err, data) => {
      if (err) throw err;
      console.log(data);
      const json2csvParser = new Json2csvParser({ header: true });
      const csvData = json2csvParser.parse(data);

      fs.writeFile('bezkoder_mongodb_fs.csv', csvData, function (error) {
        if (error) throw error;
        console.log('Write to bezkoder_mongodb_fs.csv successfully!');
      });

      client.close();
    });

    res.status(200).json({ message: 'CSV created' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
