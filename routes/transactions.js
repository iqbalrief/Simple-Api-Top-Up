var express = require('express');
var router = express.Router();
const transactionCtrl = require('../controller/transactions');
const { generateToken } = require('../utils/auth');


router.post('/topup', generateToken,  transactionCtrl.topUp);
router.post('/transaction', generateToken,  transactionCtrl.transaction);
router.get('/transaction/history', generateToken,  transactionCtrl.getTransactionHistory);
router.get('/balance', generateToken,  transactionCtrl.getBalance);


module.exports = router;
