var express = require('express');
var router = express.Router();
const membershipCtrl = require('../controller/membership');


router.post('/registration', membershipCtrl.register);
router.post('/login', membershipCtrl.login);


module.exports = router;
