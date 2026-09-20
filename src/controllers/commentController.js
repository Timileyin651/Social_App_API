const commentService = require('../services/comment.service');

const createComment = async(req,res,next)=>{
    try {
        const comment = await commentService.addComment(req.params.postId, req.body);
        res.status(201).json({ success:true, data: comment})
    } catch (error) {
        next(error)
    }
}

const listComment = async(req,res,next) => {
    try {
        const result = await commentService.listComments(req.params.id, req.query);
        res.status(200).json({success:true, ...result});
    } catch (error) {
        next(error);
    }
}

const deleteComment = async(req,res,next)=>{
    try {
        await commentService.deleteComment(req.params.id, req.user._id)
        res.status(204).json({
            message: 'Comment successfully deleted'
        })
    } catch (error) {
        next(error)
        
    }
}

module.exports  = { createComment, listComment, deleteComment}

