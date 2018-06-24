const mongoose = require('mongoose');
const Product = require('../models/product');

exports.products_get_all = (req, res, next) => {
  Product.find()
    .select('name price _id productImage') // which fields I want to select
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            productImage: doc.productImage,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + doc._id
            }
          }
        })
      }
      res.status(200).json(response);
      // console.log('PRODUCTS GET: ', docs);
      // if (docs.length >= 0) {
      //     res.status(200).json(docs); // return docs as json
      // } else {
      //     res.status(404).json({
      //         message: 'No entries found'
      //     });
      // }
    })
    .catch(err => {
      console.log('GET PRODUCTS ERROR: ', err);
      res.status(500).json({
        error: err
      });
    });
  // res.status(200).json({
  //     message: 'Handling GET request to /products'
  // });
};

exports.products_create_product = (req, res, next) => {
  console.log('====================');
  console.log(req.file);
  console.log('====================');
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product.save()
    .then(result => {
      res.status(201).json({
        message: 'Created product successfully',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products/' + result._id
          }
        },
      });
    }).catch(err => {
    console.log('ERROR', err);
    res.status(500).json({error: err});
  });
};

exports.products_get_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then((doc) => {
      console.log('GET DOC: ', doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({
          message: 'No valid entry found for provided ID'
        });
      }
    })
    .catch(err => {
      console.log('ERROR: ', err);
      res.status(500).json({error: err});
    });
};

exports.products_update_product = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({_id: id}, {
    $set: updateOps
    // $set: {
    //     name: req.body.newName,
    //     price: req.body.newPrice
    // }
  })
    .exec()
    .then(result => {
      console.log('PRODUCT UPDATED');
      res.status(200).json(result);
    })
    .catch(err => {
      console.log('UPDATE PRODUCT ERROR: ', err);
      res.status(500).json({error: err})
    });
};

exports.products_delete_product = (req, res, next) => {
  const id = req.params.orderId;
  Product.remove({_id: id})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/products',
          body: {name: 'String', price: 'Number'}
        }
      });
    })
    .catch(err => {
      console.log('DELETE PRODUCT ERROR: ', err);
      res.status(500).json({error: err})
    });
};