const multer = require('multer');

const fs = require("fs");
const path = require("path");
const { sendError, STATUS } = require('../utils/errorHandler');
 

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

 const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png|/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);

      if (!extname || !mimetype) {
        return sendError(res, 400, 'Format gambar tidak sesuai', STATUS.VALIDATION_ERROR);
    }
  
      if (extname && mimetype) {
        return cb(null, true);
      } else {
        cb('Error: File not allowed');
      }
    }
  }).single('profile_image');

module.exports = {upload}
  

