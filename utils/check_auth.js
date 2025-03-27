let jwt = require('jsonwebtoken');
let constants = require('../utils/constants');
let userController = require('../controllers/users');

async function check_authentication(req, res, next) {
    try {
        let authorization = req.headers.authorization;
        if (!authorization || !authorization.startsWith("Bearer")) {
            throw new Error("Bạn chưa đăng nhập");
        }

        let token = authorization.split(" ")[1];
        let decoded = jwt.verify(token, constants.SECRET_KEY);

        let user = await userController.GetUserById(decoded.id);
        if (!user) {
            throw new Error("Người dùng không tồn tại");
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
}

module.exports = { check_authentication };