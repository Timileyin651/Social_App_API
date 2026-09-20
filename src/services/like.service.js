const mongoose = require('mongoose');
const Like = require('../models/likes');
const Post = require('../models/posts');
const AppError = require('../utils/AppError');
const postService = require('./post.service');

async function likePost(postId, userId){;
    const post = await Post.findById(postId)
    if(!post) throw new AppError('Post not found', 404);
    const session = await mongoose.startSession();
    try{
        let like;
        await session.withTransaction(async() => {
            const existing = await Like.findOne({ user: userId, post: postId}).session(session);
            if(existing) throw new AppError('Post already liked', 409);

            like = await Like.create([{user:userId, post: postId}], {session});
            await Post.updateOne(
                {_id: postId},
                {$inc: { like_count: 1}},
                {session}
            );
            like = like[0];
        });
        return like;
    } catch (err){
        if(err.code === 11000) throw new AppError('Post already liked', 409);
        throw err;

    } finally{
        session.endSession();
    }
}

async function unlikePost(postId,userId) {
    const session = await monoose.startSession();
    try{
        let deleted;
        await session.withTransaction(async() => {
            deleted = await Like.findOneAndDelete(
                {user: userId, post: postId},{session}
            );
            if(!deleted) throw new AppError('Like not found', 404);
            await Post.updateOne(
                {_id: postId},
                {$inc: {like_count: -1}},
                {session}
            );
            
        });
        return deleted;
    } finally {
        session.endSession();
    }
}

async function listLikesForPost(postId, { page = 1, limit = 20}) {
    const skip = (page -1) * limit;
    const [likes,total] = await Promise.all([
        Like.find({ post: postId})
            .populate('user', 'username first)name last_name')
            .skip(skip)
            .limit(limit),
        Like.countDocuments({ post: postId}),
    ]);
    return {likes, total, page: Number(page), limit: Number(limit)};
}

module.exports = { likePost, unlikePost, listLikesForPost};