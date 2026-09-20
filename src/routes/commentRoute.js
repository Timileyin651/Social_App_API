const express = require('express')
const commentController = require('../controllers/commentController');
const validate = require('../middleware/validate');
const { comment, idParam } = require('../validators/schema');

const commentRouter = express.Router({mergeParams: true})

commentRouter.post('/', validate(comment.create), commentController.createComment);
commentRouter.get('/', commentController.listComment);
commentRouter.delete('/:id', validate(comment.create), commentController.deleteComment)

module.exports = commentRouter

