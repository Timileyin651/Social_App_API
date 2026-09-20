const express = require('express');
const likeController = require('../controllers/likeController');
const validate = require('../middleware/validate');
const { like, idParam } = require('../validators/schema');

const likeRouter = express.Router({ mergeParams: true});

likeRouter.post('/',validate(like.create), likeController.create);
likeRouter.get('/',likeController.list);
likeRouter.delete('/:id',validate(idParam, 'params'), likeController.remove)

module.exports = likeRouter
