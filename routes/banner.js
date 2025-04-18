var express = require('express');
var router = express.Router();
const bannerCtrl = require('../controller/information');

router.get('/banner', bannerCtrl.getInformation);
router.get('/services', bannerCtrl.getServices);


module.exports = router;
