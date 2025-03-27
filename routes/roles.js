var express = require('express');
var router = express.Router();
let roleController = require('../controllers/roles')
var {CreateSuccessRes,CreateErrorRes} = require('../utils/ResHandler')

/* GET users listing. */
router.get('/', async function(req, res, next) {
    let users = await roleController.GetAllRole();
    CreateSuccessRes(res,200,users);
});
router.get('/:id', async function(req, res, next) {
  try {
    let user = await roleController.GetRoleById(req.params.id)
    CreateSuccessRes(res,200,user);
  } catch (error) {
    next(error);
  }
});
router.post('/', async function(req, res, next) {
  try {
    let newRole = await roleController.CreateRole(req.body.name);
    CreateSuccessRes(res,200,newRole);
  } catch (error) {
    next(error);
  }var express = require('express');
  var router = express.Router();
  let roleController = require('../controllers/roles');
  var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');
  const authorize = require('../middlewares/auth'); // Middleware kiểm tra quyền
  
  /* GET all roles - Không yêu cầu quyền */
  router.get('/', async function(req, res, next) {
      try {
          let roles = await roleController.GetAllRole();
          CreateSuccessRes(res, 200, roles);
      } catch (error) {
          next(error);
      }
  });
  
  /* GET role by ID - Không yêu cầu quyền */
  router.get('/:id', async function(req, res, next) {
      try {
          let role = await roleController.GetRoleById(req.params.id);
          CreateSuccessRes(res, 200, role);
      } catch (error) {
          next(error);
      }
  });
  
  /* POST: Chỉ admin mới có quyền tạo role */
  router.post('/', authorize(["admin"]), async function(req, res, next) {
      try {
          let newRole = await roleController.CreateRole(req.body.name);
          CreateSuccessRes(res, 200, newRole);
      } catch (error) {
          next(error);
      }
  });
  
  /* PUT: Chỉ admin mới có quyền cập nhật */
  router.put('/:id', authorize(["admin"]), async function(req, res, next) {
      try {
          let updatedRole = await roleController.UpdateRole(req.params.id, req.body);
          CreateSuccessRes(res, 200, updatedRole);
      } catch (error) {
          next(error);
      }
  });
  
  /* DELETE: Chỉ admin mới có quyền xóa */
  router.delete('/:id', authorize(["admin"]), async function(req, res, next) {
      try {
          let deletedRole = await roleController.DeleteRole(req.params.id);
          CreateSuccessRes(res, 200, deletedRole);
      } catch (error) {
          next(error);
      }
  });
  
  module.exports = router;
  
})

module.exports = router;