const express = require('express');
const router = express.Router();
const ProductsController = require('../controllers/products');

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


// All routes here starts with /products/
router.get('/', ProductsController.products_get_all);
router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

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

router.get('/:productId', ProductsController.products_get_product);

// UPDATE
// we can not add new property here!!!!!
// we can only change existing ones!!!
router.patch('/:productId', checkAuth, ProductsController.products_update_product);

router.delete('/:orderId', checkAuth, ProductsController.products_delete_product);

module.exports = router;