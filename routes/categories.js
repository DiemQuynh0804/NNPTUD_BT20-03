var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/category');
const authorize = require('../middlewares/auth'); // Middleware kiểm tra quyền

/* GET: Không yêu cầu đăng nhập */
router.get('/', async (req, res) => {
    let categories = await categoryModel.find({});
    res.status(200).json({ success: true, data: categories });
});

router.get('/:id', async (req, res) => {
    try {
        let category = await categoryModel.findById(req.params.id);
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(404).json({ success: false, message: "Không tìm thấy danh mục" });
    }
});

/* POST: Chỉ cho phép MOD */
router.post('/', authorize(["mod"]), async (req, res) => {
    try {
        let newCategory = new categoryModel({ name: req.body.name });
        await newCategory.save();
        res.status(200).json({ success: true, data: newCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/* PUT: Chỉ cho phép MOD */
router.put('/:id', authorize(["mod"]), async (req, res) => {
    try {
        let updatedCategory = await categoryModel.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
        res.status(200).json({ success: true, data: updatedCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/* DELETE: Chỉ cho phép ADMIN */
router.delete('/:id', authorize(["admin"]), async (req, res) => {
    try {
        let deletedCategory = await categoryModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: deletedCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;