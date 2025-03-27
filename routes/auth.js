var express = require('express');
var router = express.Router();
let userController = require('../controllers/users');
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');
let jwt = require('jsonwebtoken');
let constants = require('../utils/constants');
let { check_authentication } = require('../utils/check_auth');
let bcrypt = require('bcrypt');

/* Đăng nhập */
router.post('/login', async function (req, res, next) {
    try {
        let { username, password } = req.body;
        let result = await userController.Login(username, password);
        
        let token = jwt.sign(
            {
                id: result._id,
                expire: new Date(Date.now() + 24 * 3600 * 1000)
            },
            constants.SECRET_KEY
        );

        CreateSuccessRes(res, 200, token);
    } catch (error) {
        next(error);
    }
});

/* Đăng ký */
router.post('/signup', async function (req, res, next) {
    try {
        let { username, password, email } = req.body;
        let result = await userController.CreateAnUser(username, password, email, 'user');

        let token = jwt.sign(
            {
                id: result._id,
                expire: new Date(Date.now() + 24 * 3600 * 1000)
            },
            constants.SECRET_KEY
        );

        CreateSuccessRes(res, 200, token);
    } catch (error) {
        next(error);
    }
});

/* Lấy thông tin người dùng hiện tại - Không yêu cầu quyền */
router.get('/me', check_authentication, async function (req, res, next) {
    CreateSuccessRes(res, 200, req.user);
});

/* Đổi mật khẩu - Không yêu cầu quyền */
router.post('/changepassword', check_authentication, async function (req, res, next) {
    let { oldpassword, newpassword } = req.body;

    if (bcrypt.compareSync(oldpassword, req.user.password)) {
        let user = req.user;
        user.password = newpassword;
        await user.save();
        CreateSuccessRes(res, 200, user);
    } else {
        next(new Error("Mật khẩu cũ không đúng"));
    }
});

/* Middleware yêu cầu đăng nhập cho tất cả các route còn lại */
router.use((req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Bạn chưa đăng nhập" });
    }
    next();
});

/* Các route khác (yêu cầu đăng nhập) */
router.get('/some-protected-route', async function (req, res, next) {
    CreateSuccessRes(res, 200, { message: "Bạn đã đăng nhập và truy cập thành công!" });
});

module.exports = router;