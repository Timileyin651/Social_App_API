const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            default: null
        },
        content: {
            type:String,
            required:[true, 'Comment content is required'],
            trim:true,
        },
    },{ timestamps: true}
)

commentSchema.index({ post:1, createdAt: -1});

module.exports = mongoose.model('Comment', commentSchema);

//the parent is used for the self referencing relationship between comments