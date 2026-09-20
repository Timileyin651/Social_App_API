const Post = require('../models/posts');
const Comment = require('../models/comments');
const Like = require('../models/likes');
const AppError = require('../utils/AppError');

async function createPost(data){
    const post = await Post.create(data);
    return post;
}

async function listPosts({ page =1, limit = 20, tag, viewerId}){
    const filter = { state: 'published'};

    if(viewerId){
        filter.$or = [{ state: 'published'}, { author: viewerId}];
        delete filter.state;
    }
    if(tag){
        filter.tags = tag.toLowerCase();
    }
    const skip = (page - 1) * limit;
    const [posts,total] = await Promise.all([
        Post.find(filter)
            .populate('author', 'username first_name last_name')
            .sort({published_at: -1, createdAt: -1})
            .skip(skip)
            .limit(limit),
        Post.countDocuments(filter),
    ]);

    return { posts, total, page: Number(page), limit: Number(limit)};
}

async function getPostById(id, viewerId) {
    const post = await Post.findById(id).populate(
        'author','username first_name last_name'
    );
    if(!post) throw new AppError('Post not found', 404);

    const isOwner = viewerId && post.author._id.toString() === viewerId;
    if(post.state === 'draft' && !isOwner ) {
        throw new AppError('Post not found', 404);
    }
    return post;
}

async function updatePost(id, authorId, data){
    const post = await Post.findOneAndUpdate({_id: id, author: authorId}, data, {
        new:true,
        runValidators:true
    });
    if(!post) throw new AppError('Post not found or not owned by this user',404);
    return post;
}

async function publishPost(id, authorId) {
    const post = await Post.findOneAndUpdate(
        {_id: id, author:authorId, state: 'draft'},
        { $set: {state: 'published', published_at: new Date() }},
        { new: true}
    );
    if(!post) {
        throw new AppError('Draft not found, already published, or not owned by this user',404);
    }
    return post;
}

async function deletePost(id, authorId) {
    const post = await Post.findOneAndDelete({_id: id, author: authorId});
    if(!post) throw new AppError('Post not found or not owned by this user', 404);

    await Promise.all([
        Comment.deleteMany({ post: id}),
        Like.deleteMany({ post: id})

    ]);
    return post;
}

async function incrementCommentCount(postId, delta) {
    await Post.updateOne({ _id: postId}, { $inc: { comment_count: delta}});
    
}

async function incrementLikeCount(postId, delta){
    await Post.updateOne({_id: postId}, {$inc: { like_count: delta}})
}

module.exports = {
    createPost,
    listPosts,
    getPostById,
    updatePost,
    publishPost,
    deletePost,
    incrementCommentCount,
    incrementLikeCount
};

