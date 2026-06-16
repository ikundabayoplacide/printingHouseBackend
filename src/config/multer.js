const multer = require('multer');
const env = require('./env');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/postscript',
    'image/vnd.adobe.photoshop',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: JPEG, PNG, GIF, WEBP, PDF, AI, PSD'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.maxFileSize },
});

module.exports = upload;
