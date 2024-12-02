const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: "dostagu5a",
  api_key: "856268476872551",
  api_secret: "vU4PFIolh6Az3XD0UyX3OypLK-Y"
});

const storage = new CloudinaryStorage({
  cloudinary,
  params:{
    folder:'songs',
    resource_type: 'auto'
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  }
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;