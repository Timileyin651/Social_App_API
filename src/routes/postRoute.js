const express = require('express')
const postController = require('../controllers/postController');
const likeRoute = require('./likeRoute');
const commentRoute = require('./commentRoute');
const postRouter = express.Router();
const passport = require('passport');
const validate = require('../middleware/validate');
const { post, idParam } = require('../validators/schema');

require('../middleware/auth')

postRouter.post('/', passport.authenticate('jwt', {session: false}),validate(post.create), postController.create);
postRouter.get('/', postController.list);
postRouter.get('/:id',validate(idParam, 'params'), postController.getPost);
postRouter.put('/:id',passport.authenticate('jwt', {session: false}),validate(idParam, 'params'),validate(post.update),postController.updatePost);
postRouter.put('/:id/publish',passport.authenticate('jwt', {session: false}),validate(idParam, 'params'), postController.publishPost);
postRouter.delete('/:id',passport.authenticate('jwt', {session: false}),validate(idParam, 'params'), postController.removePost);

//Nested resources
postRouter.use('/:postId/comments',passport.authenticate('jwt', {session: false}), commentRoute)
postRouter.use('/:postId/likes',passport.authenticate('jwt', {session: false}), likeRoute);

module.exports = postRouter
