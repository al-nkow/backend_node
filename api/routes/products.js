const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const checkAuth = require('../middleware/check-auth');

const multer = require('multer'); // file upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        // cb(null, file.filename)
        cb(null, new Date().toISOString() + file.originalname)
    }
});
// const upload = multer({dest: 'uploads/'});
const fileFilter = (req, file, cb) => {
    // reject file - cb(null, false);
    // accept file - cb(null, true);
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2 // 2 mb file size allowed
    },
    fileFilter: fileFilter
});

const Product = require('../models/product');

// All routes here starts with /products/

router.get('/', (req, res, next) => {
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
});

router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
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
});

// router.post('/', (req, res, next) => {
//     const product = new Product({
//         _id: new mongoose.Types.ObjectId(),
//         name: req.body.name,
//         price: req.body.price
//     });
//     // product.save();// save(req, res) сохраняет в бд
//     // .exec() - returns promise
//     product.save()
//         .then(result => {
//         console.log('RES >>>>>', result);
//         res.status(201).json({
//             message: 'Created product successfully',
//             createdProduct: {
//                 name: result.name,
//                 price: result.price,
//                 _id: result._id,
//                 request: {
//                     type: 'GET',
//                     url: 'http://localhost:3000/products/' + result._id
//                 }
//             },
//         });
//     }).catch(err => {
//         console.log('ERR >>>>>', err);
//         res.status(500).json({error: err});
//     });
// });

router.get('/:productId', (req, res, next) => {
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
});

// UPDATE
// we can not add new property here!!!!!
// we can only change existing ones!!!
router.patch('/:productId', checkAuth, (req, res, next) => {
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
});

router.delete('/:orderId', checkAuth, (req, res, next) => {
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
});

module.exports = router;