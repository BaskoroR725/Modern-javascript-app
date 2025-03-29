const express = require('express');

const router = express.Router();

router.post('/cart/products', (req, res) =>{
  console.log(req.body.productId);

  res.send('item added');
});

module.exports = router;