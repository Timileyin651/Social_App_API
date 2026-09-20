const likeService = require('../services/like.service');

const create = async(req,res,next) => {
    try {
        const like = await likeService.likePost(req.params.postId, req.user._id);
        res.status(200).json({ success: true, data: like})
    } catch (error) {
        next(error)
    }
}

const remove = async(req,res,next) =>{
    try {
        await likeService.unlikePost(req.params.postId, req.user._id);
        res.status(204).json({
            message: 'Post successfully unliked'
        })
    } catch (error) {
        next(error)
        
    }

}

const list = async(req,res,next)=>{
    try {
        const result = await likeService.listLikesForPost(req.params.postId, req.query);
        res.status(200).json({ success: true, ...result})
    } catch (error) {
        next(error)
    }
}

module.exports = {
    create,remove,list
}