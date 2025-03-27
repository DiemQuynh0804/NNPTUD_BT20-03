var express = require('express');
var router = express.Router();
let userController = require('../controllers/users');
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');
let jwt = require('jsonwebtoken');
let constants = require('../utils/constants');
const authorize = require('../middlewares/auth'); // Middleware kiểm tra quyền

/* GET all users - Chỉ mod */
router.get('/', authorize(["mod"]), async function (req, res, next) {
    try {
        let users = await userController.GetAllUser();
        CreateSuccessRes(res, 200, users);
    } catch (error) {
        next(error);
    }
});

/* GET user by ID - Chỉ mod (trừ chính mình) */
router.get('/:id', authorize(["mod"]), async function (req, res, next) {
    try {
        if (req.user.id === req.params.id) {
            return CreateErrorRes(res, 403, "Bạn không thể xem thông tin của chính mình");
        }
        let user = await userController.GetUserById(req.params.id);
        CreateSuccessRes(res, 200, user);
    } catch (error) {
        CreateErrorRes(res, 404, error);
    }
});

/* POST: Chỉ admin mới có quyền tạo user */
router.post('/', authorize(["admin"]), async function (req, res, next) {
    try {
        let { username, password, email, role } = req.body;
        let newUser = await userController.CreateAnUser(username, password, email, role);
        CreateSuccessRes(res, 200, newUser);
    } catch (error) {
        next(error);
    }
});

/* PUT: Chỉ admin mới có quyền cập nhật */
router.put('/:id', authorize(["admin"]), async function (req, res, next) {
    try {
        let updateUser = await userController.UpdateUser(req.params.id, req.body);
        CreateSuccessRes(res, 200, updateUser);
    } catch (error) {
        next(error);
    }
});

/* DELETE: Chỉ admin mới có quyền xóa */
router.delete('/:id', authorize(["admin"]), async function (req, res, next) {
    try {
        let deletedUser = await userController.DeleteUser(req.params.id);
        CreateSuccessRes(res, 200, deletedUser);
    } catch (error) {
        next(error);
    }
});

module.exports = router;