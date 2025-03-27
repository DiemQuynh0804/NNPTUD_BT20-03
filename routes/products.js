var express = require('express');
var router = express.Router();
let productModel = require('../schemas/product');
let CategoryModel = require('../schemas/category');
const authorize = require('../middlewares/auth'); // Import middleware

function buildQuery(obj) {
    let result = {};
    if (obj.name) {
        result.name = new RegExp(obj.name, 'i');
    }
    result.price = { $gte: obj.price?.$gte || 0, $lte: obj.price?.$lte || 10000 };
    return result;
}

// GET: Không yêu cầu đăng nhập
router.get('/', async (req, res) => {
    let products = await productModel.find(buildQuery(req.query)).populate("category");
    res.status(200).json({ success: true, data: products });
});

router.get('/:id', async (req, res) => {
    try {
        let product = await productModel.findById(req.params.id);
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    }
});

// POST: Chỉ cho phép MOD
router.post('/', authorize(["mod"]), async (req, res) => {
    try {
        let cate = await CategoryModel.findOne({ name: req.body.category });
        if (cate) {
            let newProduct = new productModel({
                name: req.body.name,
                price: req.body.price,
                quantity: req.body.quantity,
                category: cate._id
            });
            await newProduct.save();
            res.status(200).json({ success: true, data: newProduct });
        } else {
            res.status(404).json({ success: false, message: "Danh mục không hợp lệ" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT: Chỉ cho phép MOD
router.put('/:id', authorize(["mod"]), async (req, res) => {
    try {
        let updateObj = {};
        if (req.body.name) updateObj.name = req.body.name;
        if (req.body.price) updateObj.price = req.body.price;
        if (req.body.quantity) updateObj.quantity = req.body.quantity;
        if (req.body.category) {
            let cate = await CategoryModel.findOne({ name: req.body.category });
            if (!cate) {
                return res.status(404).json({ success: false, message: "Danh mục không hợp lệ" });
            }
            updateObj.category = cate._id;
        }
        let updatedProduct = await productModel.findByIdAndUpdate(req.params.id, updateObj, { new: true });
        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE: Chỉ cho phép ADMIN
router.delete('/:id', authorize(["admin"]), async (req, res) => {
    try {
        let deletedProduct = await productModel.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        res.status(200).json({ success: true, data: deletedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;