const userService = require('../services/user.service');

// const create = async(req,res,next) => {
//     try {
//         const user = await userService.createUser(req.body);
//         res.status(201).json({ success: true, data: user})
//     } catch (error) {
//         next(error)
//     }
// };

const list = async(req,res,next) => {
    try {
        const result = await userService.listUsers(req.query);
        res.status(200).json({success: true, ...result})
    } catch (error) {
        next(error)
    }
}

const getById = async(req,res,next) => {
    try {
        const user = await userService.getUser(req.params.id)
        res.status(200).json({ success:true, data: user})
    } catch (error) {
        next(error)
    }
}

const getByUsername = async(req,res,next)=>{
    try {
        const user = await userService.getUserByUsername(req.params.username);
        res.status(200).json({success:true,data:user});
    } catch (error) {
        next(error)
    }
}

const updateUser = async(req,res,next)=>{
    try {
        const user = await userService.updateUser(req.params.id,req.body);
        res.status(200).json({ success:true, data:user});
    } catch (error) {
        next(error) 
    } 
}

const deleteUser = async(req,res,next)=>{
    try {
        await userService.deleteUser(req.params.id)
        res.status(200).json({
            success: true,
            message: 'User successfully deleted'
        });
    } catch (error) {
        next(error)
    }
}

const followUser = async(req,res,next) => {
    try {
        const result = await userService.followUser(
            req.user._id,
            req.params.id
        );
        res.status(200).json({success:true, ...result})
        
    } catch (error) {
        next(error)
        
    }
}

module.exports = {  list, getById,getByUsername,updateUser,deleteUser, followUser }
