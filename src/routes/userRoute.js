const express = require('express')
const userController = require('../controllers/userController');
const validate = require('../middleware/validate');
const { user, idParam } = require('../validators/schema');

const userRouter = express.Router();
// userRouter.post('/', validate(user.create), userController.create);
userRouter.get('/', userController.list);
userRouter.get('/:id', validate(idParam, 'params'), userController.getById);
userRouter.put('/:id',validate(idParam, 'params'), userController.updateUser);
userRouter.get('/username/:username', userController.getByUsername);
userRouter.post('/:id', userController.followUser);
userRouter.delete('/:id', validate(idParam, 'params'), userController.deleteUser)

module.exports = userRouter;



// WITH VALIDATION MIDDLEWARE



