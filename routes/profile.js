var express = require('express');
var router = express.Router();
const profileCtrl = require('../controller/profile');
const { generateToken } = require('../utils/auth');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.put('/photo', upload.single('profile_image'), generateToken, profileCtrl.avatar);
router.put('/update', generateToken, profileCtrl.profile);
router.get('/', generateToken, profileCtrl.getProfile);




module.exports = router;
