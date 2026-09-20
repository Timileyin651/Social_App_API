const Comment = require('../models/comments');
const Post = require('../models/posts');
const AppError = require('../utils/AppError');
const postService = require('./post.service');

async function addComment(postId, data){
    const post = await Post.findById(postId);
    if(!post) throw new AppError('Post not found', 404);
    const  comment = await Comment.create({ ...data, post: postId});
    await postService.incrementCommentCount(postId, 1);
    return comment;
}

async function listComments(postId, {page = 1, limit = 20}){
    const skip = (page - 1) * limit;
    const [comments, total] = await Promise.all([
        Comment.find({ post: postId})
            .populate('user', 'username first_name last_name')
            .sort({ createdAt: -1})
            .skip(skip)
            .limit(limit),
        Comment.countDocuments({post: postId})
    ]);
    return { comments, total, page: Number(page), limit: Number(limit)};
}

async function deleteComment(commentId, userId){
    const comment = await Comment.findOneAndDelete({ _id: commentId, user: userId});
    if(!comment) throw new AppError('Comment not found or owned by this user', 404);

    await postService.incrementCommentCount(comment.post, -1);
    return comment;
}

module.exports = {
    addComment, listComments, deleteComment
};