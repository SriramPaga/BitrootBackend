const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: './csvWriter.csv',
  header: [
    { id: 'id', title: 'ID' },
    { id: 'name', title: 'NAME' },
    { id: 'phoneNumber', title: 'PHONENUMBER' },
    { id: 'avatar', title: 'AVATAR' },
    { id: 'address', title: 'ADDRESS' },
  ],
});

module.exports = csvWriter;
