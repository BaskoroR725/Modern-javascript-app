const express = require('express');
const { validationResult } = require('express-validator');
const productsRepo = require('../../repository/products');
const productNewTemplate = require('../../views/admin/products/new');
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();

router.get('/admin/products', (req, res) =>{
  
});

router.get('/admin/products/new', (req, res) =>{
  res.send(productNewTemplate({}));
});

router.post('./admin/products/new',[requireTitle, requirePrice] , (req, res)=>{
  const errors = validationResult(req);
  console.log(errors);
  
  res.send('submitted');
});

module.exports = router;