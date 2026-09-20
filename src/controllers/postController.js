const postService = require('../services/post.service');


const create = async(req,res,next)=>{
    try {
        const post = await postService.createPost(req.body);
        res.status(201).json({ success: true, data: post})
    } catch (error) {
        next(error)
    }
}

const list = async(req,res,next) =>{
    try {
        const result = await postService.listPosts(req.query);
        res.status(200).json({ success: true, ...result});
    } catch (error) {
        next(error)
    }
}

const getPost = async(req,res,next) =>{
    try {
        const post = await postService.getPostById(req.params.id, req.query.viewerId);
        res.status(200).json({ success:true, data:post})
    } catch (error) {
        next(error)
    }
}

const updatePost = async(req,res,next) =>{
    try {
        const post = await postService.updatePost(req.params.id, req.user._id, req.body );
        req.status(200).json({ success:true, data:post})
    } catch (error) {
        next(error)
    }

}

const publishPost = async(req,res,next) =>{
    try {
        const post = await postService.publishPost(req.params.id, req.user._id, req.body);
        res.status(200).json({ success:true, data:post})
    } catch (error) {
        next(error)
    }
}

const removePost = async(req,res,next) => {
    try {
        await postService.deletePost(req.params.id, req.user._id)
        res.status(204).json({
            message: 'post successfully deleted'
        })
    } catch (error) {
        next(error)
    }
}

module.exports = { create, list, getPost, updatePost, publishPost, removePost};
