const mongoose = require('mongoose');

const postSchema =  new mongoose.Schema({
    title:{
        type:String,
        required:[true,'Title is required'],
        trim:true,
    },
    content:{
        type: String,
        required:[true, 'Content is required'],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required'],
    },
    tags:{
        type: [String],
        default: [],
        set: (tags)=> tags.map((t)=> t.toLowerCase().trim()),
    },
    state:{
        type: String,
        enum: ['draft','published'],
        default: 'draft'
    },
    like_count: {
        type:Number,
        default: 0,
    },
    comment_count: {
        type:Number,
        default: 0,
    },
    published_at: {
        type:Date,
        default: null,
    },
},{timestamps: true})

postSchema.index({author: 1});
postSchema.index({title: 1});
postSchema.index({tags: 1});
postSchema.index({like_count: -1, comment_count: -1, published_at: -1 });

module.exports = mongoose.model('Post', postSchema);